import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  HONEYPOT_FIELD,
  type Tipo,
  truncateCodePoints,
  validateFeedback,
} from "../../../domus/suporte/feedbackContract";

export const runtime = "nodejs";

// Formulário de suporte do DOMUS (/domus/suporte): relato de bug, sugestão ou contato.
// Envia um e-mail pelo SMTP configurado nas variáveis de ambiente do servidor.

const TIPO_LABELS: Record<Tipo, string> = {
  bug: "🐛 Bug",
  sugestao: "💡 Sugestão",
  contato: "✉️ Contato",
};

const TIPO_COLORS: Record<Tipo, string> = {
  bug: "#EF4444",
  sugestao: "#C9A96E",
  contato: "#14B8A6",
};

interface FeedbackBody {
  nome?: string;
  email: string;
  tipo: Tipo;
  mensagem: string;
  versao_app?: string;
  dispositivo?: string;
  /** Honeypot: campo escondido que só robôs preenchem. */
  armadilha?: string;
}

const UNAVAILABLE_MSG =
  "O envio pelo formulário está indisponível no momento. Tente de novo mais tarde.";
const INVALID_BODY_MSG = "Corpo da requisição inválido.";
const TOO_LARGE_MSG = "Mensagem grande demais para enviar pelo formulário.";

// ─── Rate limit (best effort, por instância do servidor) ───────────────────────

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MAX_TRACKED_IPS = 5000;
/** Envios concluídos com sucesso, por IP. Ordem de inserção = mais antigo primeiro. */
const hits = new Map<string, number[]>();
/** Envios em andamento, por IP, para que rajadas paralelas não furem o limite. */
const inFlight = new Map<string, number>();

function recentHits(ip: string, now: number): number[] {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length) hits.set(ip, recent);
  else hits.delete(ip);
  return recent;
}

function rateLimited(ip: string): boolean {
  return recentHits(ip, Date.now()).length + (inFlight.get(ip) ?? 0) >= RATE_MAX;
}

/** Conta um envio só depois de o e-mail sair com sucesso. */
function recordHit(ip: string): void {
  const now = Date.now();
  const recent = recentHits(ip, now);
  recent.push(now);
  hits.delete(ip); // reinsere no fim: a ordem do Map vira "menos recente primeiro"
  hits.set(ip, recent);
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
    for (const key of hits.keys()) {
      if (hits.size <= MAX_TRACKED_IPS) break;
      hits.delete(key);
    }
  }
}

let warnedNoIp = false;

/**
 * IP do cliente. Na Vercel, `x-vercel-forwarded-for` e `x-real-ip` vêm do proxy
 * e não podem ser forjados; o primeiro valor do `x-forwarded-for` vem do cliente,
 * então só o último (acrescentado pelo proxy mais próximo) é usado.
 */
function clientIp(req: NextRequest): string | null {
  const vercel = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const last = forwarded.split(",").map((v) => v.trim()).filter(Boolean).pop();
    if (last) return last;
  }
  if (!warnedNoIp) {
    warnedNoIp = true;
    console.warn(
      "[DOMUS Suporte] Requisição sem IP do cliente (x-vercel-forwarded-for, x-real-ip, x-forwarded-for); limite por IP desativado para esses pedidos."
    );
  }
  return null;
}

// ─── Corpo com teto de tamanho ─────────────────────────────────────────────────

const MAX_BODY_BYTES = 16 * 1024;

type BodyResult = { ok: true; text: string } | { ok: false; status: 400 | 413 };

async function readBodyCapped(req: NextRequest): Promise<BodyResult> {
  const declared = req.headers.get("content-length");
  if (declared !== null) {
    const n = Number(declared);
    if (!Number.isFinite(n) || n < 0) return { ok: false, status: 400 };
    if (n > MAX_BODY_BYTES) return { ok: false, status: 413 };
  }
  if (!req.body) return { ok: true, text: "" };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400 };
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  try {
    return { ok: true, text: new TextDecoder("utf-8", { fatal: true }).decode(buf) };
  } catch {
    return { ok: false, status: 400 };
  }
}

// ─── Validação ─────────────────────────────────────────────────────────────────

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(raw: Record<string, unknown>): FeedbackBody {
  return {
    nome: str(raw.nome) || undefined,
    email: str(raw.email),
    tipo: str(raw.tipo) as Tipo,
    mensagem: str(raw.mensagem),
    versao_app: str(raw.versao_app) || undefined,
    dispositivo: str(raw.dispositivo) || undefined,
    armadilha: str(raw[HONEYPOT_FIELD]) || undefined,
  };
}

// ─── E-mail ────────────────────────────────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Linha única, sem quebras, para cabeçalhos como o assunto. */
function oneLine(value: string, max: number): string {
  return truncateCodePoints(value.replace(/\s+/g, " ").trim(), max);
}

function field(label: string, valueHtml: string, accentColor: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr>
      <td style="background:#141210;border:1px solid ${accentColor}20;border-radius:10px;padding:12px 16px;">
        <p style="margin:0 0 4px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">${label}</p>
        <p style="margin:0;color:#F5F0E8;font-size:14px;">${valueHtml}</p>
      </td>
    </tr>
  </table>`;
}

function buildHtml(data: FeedbackBody, resumo: string): string {
  const tipoLabel = TIPO_LABELS[data.tipo];
  const color = TIPO_COLORS[data.tipo];
  const email = escapeHtml(data.email);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Suporte — DOMUS</title>
</head>
<body style="margin:0;padding:0;background:#111008;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111008;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#1C1914 0%,#2A2318 100%);border-radius:16px 16px 0 0;padding:32px 32px 24px;border-bottom:2px solid ${color}40;">
              <p style="margin:0;color:${color};font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;">DOMUS — Suporte</p>
              <p style="margin:8px 0 0;color:#F5F0E8;font-size:20px;font-weight:700;">${escapeHtml(resumo)}</p>
              <p style="margin:12px 0 0;">
                <span style="background:${color}20;border:1px solid ${color}40;border-radius:20px;padding:4px 12px;color:${color};font-size:12px;font-weight:600;">${tipoLabel}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#1C1914;padding:24px 32px;">
              ${data.nome ? field("👤 Nome", escapeHtml(data.nome), color) : ""}
              ${field("📧 E-mail", `<a href="mailto:${email}" style="color:${color};text-decoration:none;">${email}</a>`, color)}
              ${data.versao_app ? field("🏷️ Versão do app", escapeHtml(data.versao_app), color) : ""}
              ${data.dispositivo ? field("📱 Aparelho", escapeHtml(data.dispositivo), color) : ""}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#141210;border:1px solid ${color}25;border-left:3px solid ${color};border-radius:0 12px 12px 0;padding:16px;">
                    <p style="margin:0 0 8px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">📝 Mensagem</p>
                    <p style="margin:0;color:#F5F0E8;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.mensagem)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#141210;border-radius:0 0 16px 16px;padding:16px 32px;border-top:1px solid ${color}20;text-align:center;">
              <p style="margin:0;color:#4A4035;font-size:11px;">
                Enviado pelo formulário de suporte · DOMUS · Pixel Eucarístico
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await readBodyCapped(req);
  if (body.ok === false) {
    return NextResponse.json(
      { error: body.status === 413 ? TOO_LARGE_MSG : INVALID_BODY_MSG },
      { status: body.status }
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(body.text);
  } catch {
    return NextResponse.json({ error: INVALID_BODY_MSG }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ error: INVALID_BODY_MSG }, { status: 400 });
  }

  const data = normalize(raw as Record<string, unknown>);

  // Robô preencheu o honeypot: responde como sucesso e descarta (com aviso no log,
  // caso algum navegador esteja preenchendo o campo sozinho).
  if (data.armadilha) {
    console.warn("[DOMUS Suporte] Mensagem descartada: campo-armadilha preenchido.");
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const error = validateFeedback(data);
  if (error) return NextResponse.json({ error }, { status: 422 });

  const ip = clientIp(req);
  if (ip && rateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente de novo." },
      { status: 429 }
    );
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[DOMUS Suporte] SMTP não configurado (SMTP_HOST, SMTP_USER, SMTP_PASS).");
    return NextResponse.json({ error: UNAVAILABLE_MSG }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const recipient = process.env.DOMUS_FEEDBACK_EMAIL || SMTP_USER;
  const tag = data.tipo.toUpperCase();
  const resumo = oneLine(data.mensagem, 70);

  if (ip) inFlight.set(ip, (inFlight.get(ip) ?? 0) + 1);
  try {
    await transporter.sendMail({
      from: `"DOMUS Suporte" <${SMTP_USER}>`,
      to: recipient,
      // Só o endereço, nunca nome de exibição: o e-mail já foi validado sem `<>,;:"`.
      replyTo: { name: "", address: data.email },
      subject: `[DOMUS Suporte][${tag}] ${resumo}`,
      html: buildHtml(data, resumo),
      text: [
        `[DOMUS Suporte][${tag}]`,
        ``,
        `Tipo: ${TIPO_LABELS[data.tipo]}`,
        data.nome ? `Nome: ${data.nome}` : null,
        `E-mail: ${data.email}`,
        data.versao_app ? `Versão do app: ${data.versao_app}` : null,
        data.dispositivo ? `Aparelho: ${data.dispositivo}` : null,
        ``,
        `Mensagem:`,
        data.mensagem,
      ]
        .filter((l): l is string => l !== null)
        .join("\n"),
    });
  } catch (err) {
    console.error("[DOMUS Suporte] Erro de SMTP:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde." },
      { status: 502 }
    );
  } finally {
    if (ip) {
      const n = (inFlight.get(ip) ?? 1) - 1;
      if (n > 0) inFlight.set(ip, n);
      else inFlight.delete(ip);
    }
  }

  if (ip) recordHit(ip);
  return NextResponse.json({ ok: true }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Formulário de suporte do DOMUS (/domus/suporte): relato de bug, sugestão ou contato.
// Envia um e-mail pelo SMTP configurado nas variáveis de ambiente do servidor.

const TIPOS = ["bug", "sugestao", "contato"] as const;
type Tipo = (typeof TIPOS)[number];

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

const LIMITS = {
  nome: 100,
  email: 200,
  mensagem: 5000,
  versao_app: 40,
  dispositivo: 120,
} as const;

const MIN_MENSAGEM = 10;

interface FeedbackBody {
  nome?: string;
  email: string;
  tipo: Tipo;
  mensagem: string;
  versao_app?: string;
  dispositivo?: string;
  /** Honeypot: campo escondido que só robôs preenchem. */
  website?: string;
}

const UNAVAILABLE_MSG =
  "O envio pelo formulário está indisponível no momento. Tente de novo mais tarde.";

// ─── Rate limit (best effort, por instância do servidor) ───────────────────────

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
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
    website: str(raw.website) || undefined,
  };
}

function validate(body: FeedbackBody): string | null {
  if (!TIPOS.includes(body.tipo)) return "Escolha o tipo de mensagem.";
  if (body.nome && body.nome.length > LIMITS.nome) return "Nome muito longo.";
  if (
    !body.email ||
    body.email.length > LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  )
    return "Informe um e-mail válido para podermos responder.";
  if (body.mensagem.length < MIN_MENSAGEM)
    return `A mensagem deve ter ao menos ${MIN_MENSAGEM} caracteres.`;
  if (body.mensagem.length > LIMITS.mensagem)
    return `A mensagem deve ter no máximo ${LIMITS.mensagem} caracteres.`;
  if (body.versao_app && body.versao_app.length > LIMITS.versao_app)
    return "Versão do app muito longa.";
  if (body.dispositivo && body.dispositivo.length > LIMITS.dispositivo)
    return "Descrição do aparelho muito longa.";
  return null;
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
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
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
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const data = normalize(raw as Record<string, unknown>);

  // Robô preencheu o honeypot: responde como sucesso e descarta.
  if (data.website) return NextResponse.json({ ok: true }, { status: 200 });

  const error = validate(data);
  if (error) return NextResponse.json({ error }, { status: 422 });

  if (rateLimited(clientIp(req))) {
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

  try {
    await transporter.sendMail({
      from: `"DOMUS Suporte" <${SMTP_USER}>`,
      to: recipient,
      replyTo: data.email,
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
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

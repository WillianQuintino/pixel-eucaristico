import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const TIPOS = ["bug", "melhoria", "sugestao", "elogio"] as const;
type Tipo = (typeof TIPOS)[number];

const TIPO_LABELS: Record<Tipo, string> = {
  bug: "🐛 Bug",
  melhoria: "✨ Melhoria",
  sugestao: "💡 Sugestão",
  elogio: "🙌 Elogio",
};

const TIPO_COLORS: Record<Tipo, string> = {
  bug: "#EF4444",
  melhoria: "#10B981",
  sugestao: "#C9A96E",
  elogio: "#8B5CF6",
};

interface FeedbackBody {
  nome: string;
  email: string;
  tipo: Tipo;
  titulo: string;
  descricao: string;
  dispositivo?: "android" | "ios";
  versao_app?: string;
}

function validate(body: Partial<FeedbackBody>): string | null {
  if (!body.nome || body.nome.trim().length < 2) return "Nome inválido.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return "E-mail inválido.";
  if (!body.tipo || !TIPOS.includes(body.tipo as Tipo))
    return "Tipo de feedback inválido.";
  if (!body.titulo || body.titulo.trim().length < 4)
    return "Título deve ter ao menos 4 caracteres.";
  if (!body.descricao || body.descricao.trim().length < 20)
    return "Descrição deve ter ao menos 20 caracteres.";
  return null;
}

function buildHtml(data: FeedbackBody): string {
  const tipoLabel = TIPO_LABELS[data.tipo];
  const tipoColor = TIPO_COLORS[data.tipo];
  const device =
    data.dispositivo === "android"
      ? "Android"
      : data.dispositivo === "ios"
      ? "iOS"
      : null;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Feedback — DOMUS</title>
</head>
<body style="margin:0;padding:0;background:#111008;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111008;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1914 0%,#2A2318 100%);border-radius:16px 16px 0 0;padding:32px 32px 24px;border-bottom:2px solid ${tipoColor}40;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:${tipoColor};font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;">DOMUS — Feedback</p>
                    <p style="margin:8px 0 0;color:#F5F0E8;font-size:20px;font-weight:700;">${data.titulo}</p>
                    <div style="margin-top:12px;display:inline-flex;gap:8px;flex-wrap:wrap;">
                      <span style="background:${tipoColor}20;border:1px solid ${tipoColor}40;border-radius:20px;padding:4px 12px;color:${tipoColor};font-size:12px;font-weight:600;">${tipoLabel}</span>
                      ${
                        device
                          ? `<span style="background:#C9A96E15;border:1px solid #C9A96E30;border-radius:20px;padding:4px 12px;color:#C9A96E;font-size:12px;">📱 ${device}</span>`
                          : ""
                      }
                      ${
                        data.versao_app
                          ? `<span style="background:#F5F0E810;border:1px solid #F5F0E820;border-radius:20px;padding:4px 12px;color:#8A8070;font-size:12px;">v${data.versao_app}</span>`
                          : ""
                      }
                    </div>
                    <p style="margin:12px 0 0;background:${tipoColor}18;border:1px solid ${tipoColor}30;border-radius:8px;padding:8px 12px;color:${tipoColor};font-size:11px;display:inline-block;">
                      🏷️ [DOMUS Feedback][${data.tipo.toUpperCase()}]
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1C1914;padding:24px 32px;">

              ${field("👤 Nome", data.nome, tipoColor)}
              ${field("📧 E-mail", `<a href="mailto:${data.email}" style="color:${tipoColor};text-decoration:none;">${data.email}</a>`, tipoColor)}

              <!-- Descrição -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#141210;border:1px solid ${tipoColor}25;border-left:3px solid ${tipoColor};border-radius:0 12px 12px 0;padding:16px;">
                    <p style="margin:0 0 8px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">📝 Descrição</p>
                    <p style="margin:0;color:#F5F0E8;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.descricao}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#141210;border-radius:0 0 16px 16px;padding:16px 32px;border-top:1px solid ${tipoColor}20;text-align:center;">
              <p style="margin:0;color:#4A4035;font-size:11px;">
                Enviado automaticamente · DOMUS Feedback · Pixel Eucarístico
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

function field(label: string, value: string, accentColor: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr>
      <td style="background:#141210;border:1px solid ${accentColor}20;border-radius:10px;padding:12px 16px;">
        <p style="margin:0 0 4px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">${label}</p>
        <p style="margin:0;color:#F5F0E8;font-size:14px;">${value}</p>
      </td>
    </tr>
  </table>`;
}

export async function POST(req: NextRequest) {
  let body: Partial<FeedbackBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const error = validate(body);
  if (error) return NextResponse.json({ error }, { status: 422 });

  const data = body as FeedbackBody;
  const tipoLabel = TIPO_LABELS[data.tipo];

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipient =
    process.env.DOMUS_FEEDBACK_EMAIL ??
    process.env.SMTP_USER ??
    "williancustodioquintino@gmail.com";

  const device =
    data.dispositivo === "android"
      ? "Android"
      : data.dispositivo === "ios"
      ? "iOS"
      : null;

  try {
    await transporter.sendMail({
      from: `"DOMUS Feedback" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: data.email,
      subject: `[DOMUS Feedback][${data.tipo.toUpperCase()}] ${data.titulo}`,
      html: buildHtml(data),
      text: [
        `[DOMUS Feedback][${data.tipo.toUpperCase()}]`,
        ``,
        `Título: ${data.titulo}`,
        `Tipo: ${tipoLabel}`,
        `Nome: ${data.nome}`,
        `E-mail: ${data.email}`,
        device ? `Dispositivo: ${device}` : "",
        data.versao_app ? `Versão: ${data.versao_app}` : "",
        ``,
        `Descrição:`,
        data.descricao,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  } catch (err) {
    console.error("[DOMUS Feedback] SMTP error:", err);
    return NextResponse.json(
      { error: "Falha ao enviar e-mail. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

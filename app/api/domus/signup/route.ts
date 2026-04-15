import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface SignupBody {
  nome: string;
  email: string;
  dispositivo: "android" | "ios";
  ocupacao?: string;
  motivacao: string;
  como_soube?: string;
}

function validate(body: Partial<SignupBody>): string | null {
  if (!body.nome || body.nome.trim().length < 2) return "Nome inválido.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return "E-mail inválido.";
  if (!body.dispositivo || !["android", "ios"].includes(body.dispositivo))
    return "Dispositivo inválido.";
  if (!body.motivacao || body.motivacao.trim().length < 20)
    return "Motivação deve ter ao menos 20 caracteres.";
  return null;
}

function buildHtml(data: SignupBody): string {
  const device = data.dispositivo === "android" ? "Android" : "iOS";
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nova Inscrição — DOMUS Beta</title>
</head>
<body style="margin:0;padding:0;background:#111008;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111008;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1914 0%,#2A2318 100%);border-radius:16px 16px 0 0;padding:32px 32px 24px;border-bottom:2px solid #C9A96E40;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-flex;align-items:center;gap:12px;">
                      <div style="width:48px;height:48px;background:#C9A96E20;border-radius:12px;display:flex;align-items:center;justify-content:center;border:1px solid #C9A96E40;">
                        <img src="https://pixel-eucaristico.vercel.app/logos/domus_icon.png" alt="DOMUS" width="32" height="32" style="border-radius:8px;" onerror="this.style.display='none'" />
                      </div>
                      <div>
                        <p style="margin:0;color:#C9A96E;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;">DOMUS</p>
                        <p style="margin:4px 0 0;color:#F5F0E8;font-size:20px;font-weight:700;">Nova Inscrição Beta</p>
                      </div>
                    </div>
                    <p style="margin:16px 0 0;background:#C9A96E18;border:1px solid #C9A96E30;border-radius:8px;padding:8px 12px;color:#C9A96E;font-size:12px;display:inline-block;">
                      🏷️ [DOMUS Beta] Inscrição
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1C1914;padding:24px 32px;">

              <!-- Field rows -->
              ${field("👤 Nome", data.nome)}
              ${field("📧 E-mail", `<a href="mailto:${data.email}" style="color:#C9A96E;text-decoration:none;">${data.email}</a>`)}
              ${field("📱 Dispositivo", device)}
              ${data.ocupacao ? field("💼 Ocupação / Profissão", data.ocupacao) : ""}
              ${data.como_soube ? field("🔍 Como soube do DOMUS", data.como_soube) : ""}

              <!-- Motivação -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#141210;border:1px solid #C9A96E25;border-radius:12px;padding:16px;">
                    <p style="margin:0 0 8px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">💬 Motivação</p>
                    <p style="margin:0;color:#F5F0E8;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.motivacao}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#141210;border-radius:0 0 16px 16px;padding:16px 32px;border-top:1px solid #C9A96E20;text-align:center;">
              <p style="margin:0;color:#4A4035;font-size:11px;">
                Enviado automaticamente · DOMUS Beta · Pixel Eucarístico
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

function field(label: string, value: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr>
      <td style="background:#141210;border:1px solid #C9A96E20;border-radius:10px;padding:12px 16px;">
        <p style="margin:0 0 4px;color:#8A8070;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">${label}</p>
        <p style="margin:0;color:#F5F0E8;font-size:14px;">${value}</p>
      </td>
    </tr>
  </table>`;
}

export async function POST(req: NextRequest) {
  let body: Partial<SignupBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const error = validate(body);
  if (error) return NextResponse.json({ error }, { status: 422 });

  const data = body as SignupBody;

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
    process.env.DOMUS_BETA_EMAIL ??
    process.env.SMTP_USER ??
    "williancustodioquintino@gmail.com";

  const device = data.dispositivo === "android" ? "Android" : "iOS";

  try {
    await transporter.sendMail({
      from: `"DOMUS Beta" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: data.email,
      subject: `[DOMUS Beta] Nova inscrição: ${data.nome}`,
      html: buildHtml(data),
      text: [
        `[DOMUS Beta] Nova inscrição`,
        ``,
        `Nome: ${data.nome}`,
        `E-mail: ${data.email}`,
        `Dispositivo: ${device}`,
        data.ocupacao ? `Ocupação: ${data.ocupacao}` : "",
        data.como_soube ? `Como soube: ${data.como_soube}` : "",
        ``,
        `Motivação:`,
        data.motivacao,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  } catch (err) {
    console.error("[DOMUS Beta signup] SMTP error:", err);
    return NextResponse.json(
      { error: "Falha ao enviar e-mail. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

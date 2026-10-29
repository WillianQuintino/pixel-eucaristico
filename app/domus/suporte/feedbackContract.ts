// Contrato do formulário de suporte do DOMUS, compartilhado entre o cliente
// (DomusSuporteClient.tsx) e a rota (app/api/domus/feedback/route.ts).
// Sem dependências de servidor nem de navegador: pode ser importado dos dois lados.

export const TIPOS = ["bug", "sugestao", "contato"] as const;
export type Tipo = (typeof TIPOS)[number];

export const MIN_MENSAGEM = 10;

/** Limites em pontos de código (não em unidades UTF-16): um emoji conta 1. */
export const LIMITS = {
  nome: 100,
  email: 200,
  mensagem: 5000,
  versao_app: 40,
  dispositivo: 120,
} as const;

/**
 * Nome do campo-armadilha (honeypot). Neutro de propósito: nomes como
 * "website" ou "url" fazem o navegador preencher sozinho e descartar pessoas.
 */
export const HONEYPOT_FIELD = "fb_extra_ref" as const;

export interface FeedbackPayload {
  nome: string;
  email: string;
  tipo: Tipo | "";
  mensagem: string;
  versao_app: string;
  dispositivo: string;
  [HONEYPOT_FIELD]: string;
}

/** Tamanho em pontos de código, igual nos dois lados. */
export function codePointLength(value: string): number {
  return Array.from(value).length;
}

/** Corta em `max` pontos de código, sem partir um par substituto (emoji). */
export function truncateCodePoints(value: string, max: number): string {
  const chars = Array.from(value);
  return chars.length > max ? `${chars.slice(0, Math.max(0, max - 1)).join("")}…` : value;
}

/**
 * E-mail só como endereço simples: sem nome de exibição, grupo ou lista.
 * Recusa espaços e `< > , ; : " ( ) [ ] \`.
 */
const EMAIL_RE = /^[^\s<>,;:"()[\]\\@]+@[^\s<>,;:"()[\]\\@]+\.[^\s<>,;:"()[\]\\@]+$/;

export function isValidEmail(value: string): boolean {
  return codePointLength(value) <= LIMITS.email && EMAIL_RE.test(value);
}

export function isTipo(value: unknown): value is Tipo {
  return typeof value === "string" && (TIPOS as readonly string[]).includes(value);
}

/**
 * Valida os campos já com `trim`. Devolve a mensagem de erro (pt-BR) ou null.
 * Usada pelo cliente antes de enviar e pela rota antes de mandar o e-mail.
 */
export function validateFeedback(body: {
  tipo: string;
  nome?: string;
  email: string;
  mensagem: string;
  versao_app?: string;
  dispositivo?: string;
}): string | null {
  if (!isTipo(body.tipo)) return "Escolha o tipo de mensagem.";
  if (body.nome && codePointLength(body.nome) > LIMITS.nome) return "Nome muito longo.";
  if (!body.email || !isValidEmail(body.email))
    return "Informe um e-mail válido para podermos responder.";
  const len = codePointLength(body.mensagem);
  if (len < MIN_MENSAGEM) return `A mensagem deve ter ao menos ${MIN_MENSAGEM} caracteres.`;
  if (len > LIMITS.mensagem)
    return `A mensagem deve ter no máximo ${LIMITS.mensagem} caracteres.`;
  if (body.versao_app && codePointLength(body.versao_app) > LIMITS.versao_app)
    return "Versão do app muito longa.";
  if (body.dispositivo && codePointLength(body.dispositivo) > LIMITS.dispositivo)
    return "Descrição do aparelho muito longa.";
  return null;
}

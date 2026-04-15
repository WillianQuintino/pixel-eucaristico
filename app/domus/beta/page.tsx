import type { Metadata } from "next";
import DomusBetaClient from "./DomusBetaClient";

export const metadata: Metadata = {
  title: "Teste Beta — DOMUS",
  description:
    "Inscreva-se para testar o DOMUS em primeira mão. App de finanças pessoais 100% local com scanner de NF, IA financeira e sincronização P2P criptografada.",
  openGraph: {
    title: "DOMUS Beta — Seja um dos primeiros testadores",
    description:
      "Controle financeiro completo no seu dispositivo. Scanner de NF, IA, sync P2P e backup AES-256. Sem servidor central. Inscreva-se no teste fechado.",
    type: "website",
  },
};

export default function DomusBetaPage() {
  return <DomusBetaClient />;
}

import type { Metadata } from "next";
import DomusSuporteClient from "./DomusSuporteClient";

export const metadata: Metadata = {
  title: "Suporte — DOMUS",
  description:
    "Baixe o DOMUS no Google Play e fale com a gente: relate um bug, envie uma sugestão ou entre em contato. App de finanças pessoais com gamificação, scanner de NF e IA financeira.",
  alternates: { canonical: "/domus/suporte" },
  openGraph: {
    title: "DOMUS — Finanças Pessoais & Gamificação",
    description:
      "Disponível no Google Play. Relate um bug, envie uma sugestão ou fale com a equipe do DOMUS.",
    type: "website",
    url: "/domus/suporte",
  },
};

export default function DomusSuportePage() {
  return <DomusSuporteClient />;
}

export interface Screenshot {
  file: string;
  label: string;
  desc: string;
}

export const SCREENSHOTS: Screenshot[] = [
  {
    file: "/images/domus/home.webp",
    label: "Início",
    desc: "Dashboard com XP, nível, streak e saldo total",
  },
  {
    file: "/images/domus/temporada.webp",
    label: "Temporada",
    desc: "Gamificação com troféus, conquistas e progresso mensal",
  },
  {
    file: "/images/domus/contas.webp",
    label: "Contas",
    desc: "Gestão de contas com saldo e objetivos vinculados",
  },
  {
    file: "/images/domus/nova-transacao.webp",
    label: "Nova Transação",
    desc: "Lançamento rápido de despesas, receitas e transferências",
  },
  {
    file: "/images/domus/importar-nf.webp",
    label: "Importar NF",
    desc: "Scanner de nota fiscal via QR Code ou chave de acesso",
  },
  {
    file: "/images/domus/lista-desejos.webp",
    label: "Lista de Desejos",
    desc: "Compras planejadas com progresso e orçamento",
  },
  {
    file: "/images/domus/domus-ia.webp",
    label: "DOMUS IA",
    desc: "Consultor financeiro com Claude, GPT, Gemini ou DeepSeek",
  },
  {
    file: "/images/domus/sincronizar.webp",
    label: "Sincronizar",
    desc: "Sync P2P entre dispositivos via Nostr com criptografia E2E",
  },
];

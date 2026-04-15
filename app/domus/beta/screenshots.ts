export interface Screenshot {
  file: string;
  label: string;
  desc: string;
}

export const SCREENSHOTS: Screenshot[] = [
  {
    file: "/images/domus/home.jpeg",
    label: "Início",
    desc: "Dashboard com XP, nível, streak e saldo total",
  },
  {
    file: "/images/domus/temporada.jpeg",
    label: "Temporada",
    desc: "Trofeu do Santo do mês e conquistas desbloqueadas",
  },
  {
    file: "/images/domus/contas.jpeg",
    label: "Contas",
    desc: "Gestão de contas com saldo e objetivos vinculados",
  },
  {
    file: "/images/domus/nova-transacao.jpeg",
    label: "Nova Transação",
    desc: "Lançamento rápido de despesas, receitas e transferências",
  },
  {
    file: "/images/domus/importar-nf.jpeg",
    label: "Importar NF",
    desc: "Scanner de nota fiscal via QR Code ou chave de acesso",
  },
  {
    file: "/images/domus/lista-desejos.jpeg",
    label: "Lista de Desejos",
    desc: "Compras planejadas com progresso e orçamento",
  },
  {
    file: "/images/domus/domus-ia.jpeg",
    label: "DOMUS IA",
    desc: "Consultor financeiro com Claude, GPT, Gemini ou DeepSeek",
  },
  {
    file: "/images/domus/sincronizar.jpeg",
    label: "Sincronizar",
    desc: "Sync P2P entre dispositivos via Nostr com criptografia E2E",
  },
];

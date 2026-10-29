import type { Metadata } from "next";
import { DOMUS_CONTACT_EMAIL as CONTACT_EMAIL } from "../links";

export const metadata: Metadata = {
  title: "Política de Privacidade — DOMUS",
  description:
    "Política de Privacidade do aplicativo DOMUS — Finanças Pessoais & Gamificação. O que fica no seu aparelho, o que cada recurso opcional envia a serviços de terceiros e como parar os envios.",
};

// Cópia da política em docs/politica-de-privacidade.md, no repositório do DOMUS
// (fonte única). As frases "Envia:" e "Sem isso:" precisam ser idênticas às do app.

const UPDATED_AT = "21 de outubro de 2026";

interface PolicyItem {
  /** Rótulo em negrito no início do item (ex.: "Seus registros:"). */
  label?: string;
  /** Nome da opção do app; o texto traz as frases "Envia:" e "Sem isso:". */
  flag?: string;
  text: string;
}

interface PolicySection {
  n: number;
  title: string;
  badge?: string;
  lead?: string;
  items: PolicyItem[];
}

const INTRO =
  "Esta política descreve o que o DOMUS faz hoje com os seus dados. O DOMUS não tem servidor próprio que receba seus dados: eles ficam no seu aparelho. Alguns recursos, quando você os usa ou ativa, enviam dados a serviços de terceiros. Cada um está descrito abaixo, com a condição em que acontece. Os recursos marcados abaixo com \"Envia:\" e \"Sem isso:\" têm uma opção no app para ligar ou desligar, ou escolher um modo; ao lado dela, o app diz o que ela envia e o que você perde sem ela, com as mesmas frases. Os outros acessos (a página da SEFAZ pela chave de acesso da nota, a página de um produto cujo link você cola ou compartilha e a busca na Amazon ou no Mercado Livre) só acontecem quando você os pede.";

const SECTIONS: PolicySection[] = [
  {
    n: 1,
    title: "Dados no aparelho",
    items: [
      {
        label: "Seus registros:",
        text: "transações, contas, orçamento, notas fiscais e lista de desejos ficam no banco de dados local do aparelho (SQLite). Esse banco não é cifrado pelo DOMUS; ele conta com a proteção do próprio sistema, que isola os dados de cada app. Na versão web, os dados ficam no armazenamento do navegador, sem cifra.",
      },
      {
        label: "Segredos:",
        text: "chaves de API, o código do grupo de sincronização e o acesso ao Google Drive ficam no armazenamento seguro do sistema (Keystore no Android, Keychain no iOS). Na web, ficam cifrados com uma chave do próprio navegador. Exceções: a chave do Google Cloud Vision e a chave da cópia automática de backup ficam no armazenamento comum do app, sem cifra.",
      },
      {
        label: "PIN e biometria:",
        text: "o PIN é guardado só como hash PBKDF2-SHA256 (30 mil iterações) com salt aleatório, no armazenamento seguro; um PIN criado antes desta versão passa para esse formato no próximo desbloqueio por PIN. A biometria é processada pelo sistema; o DOMUS não acessa nem guarda dados biométricos.",
      },
      {
        text: "O DOMUS não pede CPF, RG, endereço, número de cartão nem dados bancários. Fotos de notas fiscais e holerites podem conter alguns desses dados (veja \"Câmera e fotos\").",
      },
    ],
  },
  {
    n: 2,
    title: "Sincronização entre aparelhos",
    badge: "Opcional",
    items: [
      {
        text: "Fica desligada até você criar ou entrar num grupo com um código.",
      },
      {
        text: "Quando ligada, o app publica seus registros em seis relays Nostr públicos, mantidos por terceiros: relay.damus.io, nos.lol, relay.snort.social, relay.primal.net, relay.nostr.com.br e nostr.bitcoiner.social.",
      },
      {
        text: "O conteúdo vai cifrado com uma chave derivada do código do grupo. É uma proteção simples: quem souber o código, ou descobri-lo por tentativa, consegue ler os registros publicados.",
      },
      {
        text: "Ficam visíveis sem cifra: o identificador do aparelho gerado pelo app, o horário de publicação, a quantidade de registros de cada lote e a chave pública do grupo. Os relays também veem o endereço IP do aparelho.",
      },
      {
        text: "Os registros publicados continuam nos relays depois que você sai do grupo, reseta o app ou o desinstala. O DOMUS não consegue apagá-los.",
      },
      {
        flag: "Sincronização.",
        text: "Envia: seus registros a seis relays Nostr públicos, cifrados com uma chave derivada do código do grupo, uma proteção simples; o identificador do aparelho, o horário, o tamanho de cada lote e a chave pública do grupo vão sem cifra, os relays veem o endereço IP e os registros continuam lá depois que você sai do grupo. Sem isso: seus dados ficam só neste aparelho, sem cópia nos seus outros aparelhos.",
      },
    ],
  },
  {
    n: 3,
    title: "Assistente de IA",
    badge: "Opcional",
    items: [
      {
        text: "Só funciona se você cadastrar a sua própria chave de API de um provedor: OpenAI, Google Gemini, Anthropic Claude, DeepSeek, Qwen ou OpenRouter, e ligar \"Ativar IA\". As chamadas saem do aparelho direto para o provedor, sem passar por servidor do DOMUS, e seguem a política desse provedor.",
      },
      {
        text: "Sem precisar de permissão, cada mensagem envia ao provedor as 6 últimas mensagens da conversa e mais: numa conversa comum, saldo total, receita e despesa do mês, taxa de poupança e a sua mensagem; num pedido de resumo do mês, esses mesmos números, as 3 categorias com mais gastos (valor e percentual) e um índice de variação dos gastos, no lugar da sua mensagem; num pedido de conselho de compra, seu perfil (tolerância a risco, taxa de poupança, índices de impulsividade e de variação dos gastos), a tendência de gastos, o preço do item e a sua pergunta.",
      },
      {
        text: "Só se você liberar nas configurações da IA (todas começam desligadas): os dados listados em \"Acesso aos dados\", abaixo. O código do grupo nunca é enviado à IA.",
      },
      {
        text: "Ao revisar uma nota fiscal, o nome de um item pode ser enviado ao provedor de IA configurado para sugerir a categoria.",
      },
      {
        label: "Voz (só se você ligar a voz):",
        text: "o texto a ser falado vai ao provedor de áudio escolhido (OpenAI, Gemini, Qwen ou ElevenLabs), que devolve o áudio. A voz que você grava vai à OpenAI, ao Gemini ou à ElevenLabs para ser transcrita ou entendida.",
      },
      {
        text: "As respostas da IA são informativas e não são aconselhamento financeiro profissional.",
      },
      {
        flag: "Ativar IA.",
        text: "Envia: a sua mensagem, as 6 últimas mensagens da conversa e um resumo do mês (saldo, receita, despesa e taxa de poupança) ao provedor de IA escolhido, com a sua chave de API; ao revisar uma nota fiscal, o nome do item, para sugerir a categoria. Sem isso: não há chat com a IA, resumo do mês, conselho de compra nem sugestão de categoria pela IA; o resto do app funciona normalmente.",
      },
      {
        flag: "Acesso aos dados.",
        text: "Envia: só o que você liberar, junto de cada mensagem à IA: até 50 transações recentes (data, tipo, valor, categoria e descrição), contas (nome, tipo, saldo e limite de crédito), categorias (nome e grupo), até 10 notas fiscais (data, emissor, quantidade de itens e valor total), lista de desejos (nome, urgência e preço), troféus e conquistas (nível, XP total e da temporada, sequência atual e maior sequência, quantidade de conquistas e de troféus mensais) e sincronização (se há grupo, sync automático, quantidade de eventos e de relays e a última sincronização), nunca o código do grupo. Sem isso: a IA responde só com o resumo do mês e não comenta as suas transações, contas, notas, desejos, conquistas nem a sincronização.",
      },
      {
        flag: "Modo Voz.",
        text: "Envia: a gravação da sua voz, que sai do aparelho para a OpenAI, o Gemini ou a ElevenLabs, para ser transcrita, e o texto das respostas ao provedor de áudio escolhido (OpenAI, Gemini, Qwen ou ElevenLabs), para virar fala. Sem isso: não há perguntas por voz nem respostas faladas; o chat segue por texto.",
      },
      {
        flag: "OCR por Visão (IA).",
        text: "Envia: a foto da nota fiscal ou do holerite que você tirar ou escolher no chat ou na tela de holerites ao provedor de IA ativo, que lê o texto; a foto pode conter nome, CPF, empregador e salário. Sem isso: o chat da IA não lê fotos; na tela de holerites e na importação de notas, a leitura é feita no aparelho, ou no Google Cloud Vision, se ele estiver configurado.",
      },
    ],
  },
  {
    n: 4,
    title: "Câmera e fotos",
    items: [
      {
        text: "A câmera serve para ler o QR Code de notas fiscais e para fotografar notas fiscais e holerites.",
      },
      {
        text: "Ao ler o QR Code, o app abre a página da SEFAZ do seu estado com a chave de acesso da nota, para buscar os itens.",
      },
      {
        text: "Com a IA e o \"OCR por Visão (IA)\" ligados, a foto que você tirar ou escolher na galeria pelo chat da IA ou na tela de holerites vai ao provedor de IA escolhido para leitura do texto.",
      },
      {
        text: "Na importação de notas, e na tela de holerites sem o \"OCR por Visão (IA)\", a leitura das fotos é feita no aparelho. Se você cadastrar uma chave do Google Cloud Vision, a foto também vai ao Google Cloud Vision quando a leitura feita no aparelho falha ou tem confiança abaixo de 60%; se você escolher o Cloud Vision como provedor principal, a foto vai a ele primeiro.",
      },
      {
        text: "Fotos de notas e holerites podem conter nome, CPF, empregador e salário.",
      },
      {
        text: "O DOMUS não salva as fotos de forma permanente.",
      },
      {
        flag: "Google Cloud Vision.",
        text: "Envia: a foto da nota fiscal ou do holerite ao Google Cloud Vision, com a sua chave, quando a leitura no aparelho falha ou tem confiança abaixo de 60%, ou sempre, se o Cloud Vision for o provedor principal. Sem isso: a leitura das fotos fica só no aparelho, sem a segunda tentativa do Google.",
      },
    ],
  },
  {
    n: 5,
    title: "Backup e Google Drive",
    items: [
      {
        label: "Backup manual:",
        text: "gera um arquivo .domusbackup cifrado com AES-256-GCM, com chave derivada da sua senha (PBKDF2-SHA256, 100 mil iterações). O DOMUS não conhece a senha, e você escolhe para onde enviar o arquivo. Também existe a exportação sem criptografia: o app pede confirmação antes, porque esse arquivo pode ser lido por qualquer pessoa que tenha acesso a ele.",
      },
      {
        label: "Cópia automática:",
        text: "no Android e no iOS, uma vez por dia, ao abrir o app, o DOMUS grava uma cópia cifrada (AES-256-GCM, PBKDF2-SHA256 com 100 mil iterações) na pasta do app, com uma chave gerada no próprio aparelho. Essa cópia não sai do aparelho sozinha.",
      },
      {
        label: "Google Drive (opcional):",
        text: "se você conectar sua conta Google, essa cópia diária é enviada automaticamente para a pasta de dados do app no seu Drive, que fica oculta. O e-mail da conta e o acesso ao Drive ficam no armazenamento seguro do aparelho. Desconecte o Drive na tela de Backup para parar o envio.",
      },
      {
        flag: "Google Drive.",
        text: "Envia: a cópia diária cifrada do backup automático para a pasta oculta do app no seu Google Drive. Sem isso: a cópia automática cifrada fica só neste aparelho, sem cópia na nuvem para restaurar em outro.",
      },
    ],
  },
  {
    n: 6,
    title: "Estatísticas e anúncios",
    items: [
      {
        label: "Firebase (Google):",
        text: "Analytics (uso do app), Crashlytics (relatórios de falha) e Performance (desempenho) começam desligados. Só enviam dados se você aceitar no aviso de consentimento ou ligar em Sobre › Analytics & Performance, e você pode desligá-los a qualquer momento. Os três enviam o ID da instalação do app, e o Firebase vê o endereço IP do aparelho; o Analytics também pode ler o ID de publicidade. Esses dados não levam seu nome, e-mail nem dados financeiros, mas não são anônimos.",
      },
      {
        label: "Anúncios (Google AdMob):",
        text: "o modo de apoio padrão não tem anúncios. Se você escolher um modo de apoio com anúncios, o AdMob recebe dados do aparelho, como o ID de publicidade, e vê o endereço IP, do qual tira a localização aproximada. Os anúncios são não personalizados por padrão; para personalizá-los, ligue \"Anúncios personalizados\" em Sobre › Apoio & Anúncios, e desligue no mesmo lugar quando quiser. Mesmo desligado, o Google recebe dados do aparelho para entregar e medir os anúncios. Volte ao modo sem anúncios para parar.",
      },
      {
        flag: "Analytics de Uso.",
        text: "Envia: eventos de uso coletados automaticamente, como a abertura do app e a duração das sessões, versão do app e do sistema, o ID da instalação do app e, quando houver, o ID de publicidade ao Google Firebase, que também vê o endereço IP. Sem isso: nada muda para você; o DOMUS deixa de saber quais recursos são usados.",
      },
      {
        flag: "Performance.",
        text: "Envia: tempos de carregamento, de tela e de rede, versão do app e do sistema e o ID da instalação do app ao Google Firebase, que também vê o endereço IP. Sem isso: nada muda para você; o DOMUS deixa de ver onde o app fica lento.",
      },
      {
        flag: "Crash Reports.",
        text: "Envia: relatórios de falha do app, com a mensagem de erro e a pilha de componentes, que podem conter textos do app, a versão do app e do sistema e o ID da instalação do app ao Google Firebase, que também vê o endereço IP. Sem isso: nada muda para você; as falhas do seu aparelho demoram mais a ser corrigidas.",
      },
      {
        flag: "Modos de apoio com anúncio.",
        text: "Envia: ao Google AdMob o ID de publicidade, informações do aparelho, o endereço IP, do qual ele tira a localização aproximada, e como você interage com os anúncios, para entregar e medir os anúncios. Sem isso: com só o modo Apenas Links na Lista, o app não inicia o SDK do AdMob nem pede anúncios ao Google; você ainda apoia o DOMUS pelos links de afiliado da lista de desejos e por doações.",
      },
      {
        flag: "Anúncios personalizados.",
        text: "Envia: o ID de publicidade, informações do aparelho e do uso dos anúncios, que o Google usa para escolher anúncios pelos seus interesses. Sem isso: os anúncios continuam, não personalizados e menos relacionados a você; o Google ainda recebe dados do aparelho para entregar e medir os anúncios.",
      },
    ],
  },
  {
    n: 7,
    title: "Consultas de itens, preços e ícones e outros serviços",
    lead: "Nestes acessos, os serviços veem o endereço IP do aparelho; cada item diz o que mais recebem:",
    items: [
      {
        label: "Consultas de itens, preços e ícones (opcional):",
        text: "com a opção ligada em Sobre › Configurações, o código de barras (EAN) dos itens de nota vai ao Open Food Facts e ao Cosmos (Bluesoft), a tabela pública de NCM é baixada do Portal Único Siscomex, o app acessa as páginas dos produtos que você salvou na lista de desejos para atualizar o preço e busca o ícone de cada loja no serviço de ícones do Google, que recebe o endereço da loja. Começa desligada numa instalação nova; quem já usava o app a recebeu ligada, com um aviso único.",
      },
      {
        label: "Cotação do dólar",
        text: "(AwesomeAPI, DolarAPI e ExchangeRate-API), só no painel da IA, para estimar o custo da IA.",
      },
      {
        label: "Busca de produtos na lista de desejos:",
        text: "quando você pede, ao adicionar um item, o app abre a busca da Amazon ou do Mercado Livre com o nome do produto, e os links da Amazon levam o código de afiliado do DOMUS. Quando você cola ou compartilha o link de um produto, o app acessa a página para ler o nome e o preço.",
      },
      {
        flag: "Consultas de itens, preços e ícones.",
        text: "Envia: o código de barras dos itens de nota ao Open Food Facts e ao Cosmos (Bluesoft), o pedido da tabela de NCM ao Portal Único Siscomex, o acesso a cada 24 h às páginas dos produtos da lista de desejos e o domínio de cada loja ao serviço de ícones do Google. Sem isso: os itens são classificados pela tabela interna de NCM, por palavras-chave e, se ligada, pela IA; a lista de desejos mostra o último preço salvo e as lojas aparecem com ícone genérico.",
      },
    ],
  },
  {
    n: 8,
    title: "Seus direitos e exclusão",
    items: [
      {
        label: "Apagar os dados do aparelho:",
        text: "use \"Resetar aplicativo\" na tela Sobre ou desinstale o app.",
      },
      {
        label: "O reset e a desinstalação não apagam:",
        text: "registros já publicados nos relays Nostr; cópias no seu Google Drive (apague-as no Drive ou remova o acesso do DOMUS na sua Conta Google); arquivos de backup que você exportou; e dados já enviados a provedores de IA, ao Firebase ou ao AdMob, que seguem as políticas desses serviços.",
      },
      {
        label: "Exportar seus dados:",
        text: "use o backup.",
      },
      {
        label: "Parar envios:",
        text: "saia do grupo de sincronização, desconecte o Google Drive, remova as chaves de IA ou desligue as permissões de dados, desligue as estatísticas, desligue as consultas de itens, preços e ícones, desligue os anúncios personalizados e escolha o modo de apoio sem anúncios.",
      },
    ],
  },
];

function SectionNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-700 text-white text-xs font-bold flex-shrink-0">
      {n}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-teal-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md ml-2 align-middle">
      {children}
    </span>
  );
}

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-teal-700 mb-2">
      <SectionNumber n={n} /> {children}
    </h2>
  );
}

/** Opção do app: destaca "Envia:" e "Sem isso:" sem alterar o texto. */
function FlagItem({ flag, text }: { flag: string; text: string }) {
  const match = text.match(/^Envia: (.*) Sem isso: (.*)$/);
  return (
    <div className="bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 rounded-r-lg p-3 text-sm text-base-content/70">
      <p className="font-bold text-teal-700 dark:text-teal-400 mb-1">{flag}</p>
      {match ? (
        <>
          <p>
            <strong>Envia:</strong> {match[1]}
          </p>
          <p className="mt-1">
            <strong>Sem isso:</strong> {match[2]}
          </p>
        </>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
}

function Section({ section }: { section: PolicySection }) {
  const bullets = section.items.filter((i) => !i.flag);
  const flags = section.items.filter((i) => i.flag);
  return (
    <section>
      <SectionTitle n={section.n}>
        {section.title}
        {section.badge && <Badge>{section.badge}</Badge>}
      </SectionTitle>
      {section.lead && (
        <p className="text-sm text-base-content/70 mb-2">{section.lead}</p>
      )}
      {bullets.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1.5">
          {bullets.map((item) => (
            <li key={item.text}>
              {item.label && <strong>{item.label}</strong>}
              {item.label && " "}
              {item.text}
            </li>
          ))}
        </ul>
      )}
      {flags.length > 0 && (
        <div className="space-y-2 mt-3">
          {flags.map((item) => (
            <FlagItem key={item.flag} flag={item.flag!} text={item.text} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function DomusPrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-500 text-center py-12 px-6 -mx-4 -mt-4 mb-0 rounded-b-3xl">
        <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-white/15 mb-4">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
          </svg>
        </div>
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">
          DOMUS
        </h1>
        <p className="text-white/80 text-sm">Política de Privacidade</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto -mt-6 px-2">
        <div className="bg-base-100 rounded-2xl shadow-lg p-6 md:p-8">
          <p className="text-center text-sm text-base-content/50 mb-6 pb-5 border-b border-base-300">
            Última atualização: {UPDATED_AT}
          </p>

          <div className="bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 rounded-r-xl p-4 mb-8 text-sm text-base-content/70">
            {INTRO}
          </div>

          <div className="space-y-8">
            {SECTIONS.map((section) => (
              <Section key={section.n} section={section} />
            ))}

            <section>
              <SectionTitle n={9}>Contato</SectionTitle>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1.5">
                <li>
                  E-mail:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-teal-700 hover:underline break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>Empresa: Pixel Eucarístico (CNPJ 55.075.291/0001-79)</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="text-center py-8 text-base-content/40 text-xs">
          <p className="font-bold">
            Pixel Eucarístico — Onde a Fé encontra a Tecnologia
          </p>
          <p className="mt-1">
            <a
              href="https://pixel-eucaristico.com.br"
              className="text-teal-700 hover:underline"
            >
              pixel-eucaristico.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

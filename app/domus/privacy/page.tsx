import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — DOMUS",
  description:
    "Política de Privacidade do aplicativo DOMUS — Finanças Pessoais & Gamificação. Seus dados ficam no seu dispositivo.",
};

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
            Última atualização: março de 2026
          </p>

          <div className="bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 rounded-r-xl p-4 mb-8 text-sm text-base-content/70">
            O DOMUS é um aplicativo de finanças pessoais desenvolvido pela{" "}
            <strong>Pixel Eucarístico</strong>. Respeitamos sua privacidade —
            todos os seus dados financeiros são armazenados localmente no seu
            dispositivo. Nenhum dado pessoal ou financeiro é enviado para nossos
            servidores.
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={1} /> Armazenamento Local
              </h2>
              <p className="text-sm text-base-content/70">
                O DOMUS armazena todos os dados financeiros (transações, contas,
                metas, configurações) exclusivamente no dispositivo do usuário,
                utilizando SQLite com criptografia local.{" "}
                <strong>
                  Nenhum dado é coletado ou enviado para servidores da Pixel
                  Eucarístico.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={2} /> Câmera
              </h2>
              <p className="text-sm text-base-content/70 mb-2">
                A permissão de câmera é utilizada apenas para:
              </p>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1">
                <li>
                  Escanear QR Codes de notas fiscais eletrônicas (NF-e)
                </li>
                <li>
                  Capturar imagens de notas fiscais para leitura OCR
                </li>
                <li>
                  Escanear QR Codes para sincronização entre dispositivos
                </li>
              </ul>
              <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-3 mt-2 text-xs text-teal-700 dark:text-teal-400">
                Nenhuma imagem é armazenada em servidores ou transmitida para
                terceiros.
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={3} /> Biometria
              </h2>
              <p className="text-sm text-base-content/70">
                A biometria (impressão digital ou reconhecimento facial) é usada
                exclusivamente para desbloquear o aplicativo. Os dados
                biométricos são gerenciados pelo sistema operacional do
                dispositivo e{" "}
                <strong>
                  nunca são acessados ou armazenados pelo DOMUS
                </strong>
                .
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={4} /> Sincronização P2P
                <Badge>Opcional</Badge>
              </h2>
              <p className="text-sm text-base-content/70 mb-2">
                Quando ativada pelo usuário, a sincronização entre dispositivos
                é realizada via relays públicos Nostr com{" "}
                <strong>criptografia ponta-a-ponta</strong>.
              </p>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1">
                <li>Nenhum servidor central armazena seus dados</li>
                <li>
                  Os dados trafegam criptografados e só podem ser lidos pelos
                  seus dispositivos
                </li>
                <li>Esta funcionalidade é totalmente opcional</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={5} /> Assistente de IA
                <Badge>Opcional</Badge>
              </h2>
              <p className="text-sm text-base-content/70 mb-2">
                Ao utilizar o assistente financeiro com IA, os dados necessários
                para a conversa são enviados ao provedor de IA escolhido pelo
                usuário:
              </p>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1">
                <li>OpenAI (ChatGPT)</li>
                <li>Google (Gemini)</li>
                <li>Anthropic (Claude)</li>
                <li>DeepSeek</li>
                <li>Alibaba (Qwen)</li>
              </ul>
              <p className="text-sm text-base-content/70 mt-2">
                Esta funcionalidade é <strong>opcional</strong> e requer
                configuração manual pelo usuário, incluindo o fornecimento de
                uma chave de API própria. O DOMUS não fornece nem gerencia essas
                chaves.
              </p>
              <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-3 mt-2 text-xs text-teal-700 dark:text-teal-400">
                Os dados enviados à IA incluem apenas o contexto da conversa e
                resumos financeiros necessários para a interação. Nenhum dado é
                retido pelo DOMUS para esse fim.
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={6} /> Backup
                <Badge>Opcional</Badge>
              </h2>
              <p className="text-sm text-base-content/70 mb-2">
                O DOMUS permite exportar backups criptografados com{" "}
                <strong>AES-256-GCM</strong>, protegidos por senha definida pelo
                usuário. O arquivo de backup pode ser:
              </p>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1">
                <li>Salvo localmente no dispositivo</li>
                <li>
                  Compartilhado pelo menu do sistema (e-mail, WhatsApp, Google
                  Drive, etc.)
                </li>
                <li>
                  Enviado ao Google Drive (quando configurado pelo usuário)
                </li>
              </ul>
              <p className="text-sm text-base-content/70 mt-2">
                O DOMUS não tem acesso ao conteúdo dos backups nem à senha
                escolhida.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={7} /> Cotação de Moeda
              </h2>
              <p className="text-sm text-base-content/70">
                Para converter valores entre USD e BRL (usado no cálculo de
                custos da IA), o DOMUS consulta APIs públicas de cotação cambial.
                Nenhum dado pessoal é transmitido nessas requisições.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={8} /> Compartilhamento com Terceiros
              </h2>
              <p className="text-sm text-base-content/70">
                <strong>
                  Não compartilhamos, vendemos ou transferimos dados pessoais a
                  terceiros.
                </strong>{" "}
                Os únicos serviços externos acionados são aqueles explicitamente
                ativados pelo usuário (IA e sincronização), conforme descrito
                acima.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={9} /> Dados de Crianças
              </h2>
              <p className="text-sm text-base-content/70">
                O DOMUS não é direcionado a menores de 13 anos e não coleta
                intencionalmente dados de crianças.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={10} /> Alterações nesta Política
              </h2>
              <p className="text-sm text-base-content/70">
                Eventuais alterações serão publicadas nesta página com a data de
                atualização revisada. Recomendamos consultar esta página
                periodicamente.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                <SectionNumber n={11} /> Contato
              </h2>
              <p className="text-sm text-base-content/70 mb-2">
                Em caso de dúvidas sobre esta política de privacidade, entre em
                contato:
              </p>
              <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-1">
                <li>
                  <strong>Empresa:</strong> Pixel Eucarístico
                </li>
                <li>
                  <strong>E-mail:</strong> contato@pixel-eucaristico.com.br
                </li>
                <li>
                  <strong>Site:</strong>{" "}
                  <a
                    href="https://pixel-eucaristico.com.br"
                    className="text-teal-700 hover:underline"
                  >
                    pixel-eucaristico.com.br
                  </a>
                </li>
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

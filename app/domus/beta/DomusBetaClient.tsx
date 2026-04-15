"use client";

import { useState, useId } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "signup" | "feedback";
type Device = "android" | "ios";
type FeedbackTipo = "bug" | "melhoria" | "sugestao" | "elogio";

interface SignupForm {
  nome: string;
  email: string;
  dispositivo: Device | "";
  ocupacao: string;
  motivacao: string;
  como_soube: string;
}

interface FeedbackForm {
  nome: string;
  email: string;
  tipo: FeedbackTipo | "";
  titulo: string;
  descricao: string;
  dispositivo: Device | "";
  versao_app: string;
}

type FormState = "idle" | "loading" | "success" | "error";

// ─── Feature list ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "💰",
    title: "Controle Financeiro",
    desc: "Despesas, receitas e transferências com categorias, produtos e histórico imutável.",
  },
  {
    icon: "📊",
    title: "Orçamento 50/30/20",
    desc: "Metodologia integrada para controle de necessidades, desejos e investimentos.",
  },
  {
    icon: "📄",
    title: "Scanner de NF",
    desc: "Importa notas fiscais via QR Code, galeria ou digitação da chave de acesso.",
  },
  {
    icon: "❤️",
    title: "Lista de Desejos",
    desc: "Organize compras planejadas com progresso visual e controle de orçamento.",
  },
  {
    icon: "🤖",
    title: "IA Financeira",
    desc: "Consultor financeiro com Claude, ChatGPT, Gemini ou DeepSeek. Sua chave, sem rastreamento.",
  },
  {
    icon: "🏆",
    title: "Gamificação",
    desc: "XP, nível, streak, temporadas e troféus para transformar finanças em hábito.",
  },
  {
    icon: "🔄",
    title: "Sync P2P",
    desc: "Sincroniza entre dispositivos via Nostr com criptografia E2E. Sem servidor central.",
  },
  {
    icon: "🔒",
    title: "100% Local & Privado",
    desc: "SQLite cifrado. Backup AES-256-GCM. Seus dados nunca saem do dispositivo.",
  },
];

const FEEDBACK_TIPOS: { value: FeedbackTipo; label: string; color: string }[] =
  [
    { value: "bug", label: "🐛 Bug", color: "#EF4444" },
    { value: "melhoria", label: "✨ Melhoria", color: "#10B981" },
    { value: "sugestao", label: "💡 Sugestão", color: "#C9A96E" },
    { value: "elogio", label: "🙌 Elogio", color: "#8B5CF6" },
  ];

// ─── Input component ──────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-widest uppercase text-[#8A8070]">
        {label}
        {required && <span className="text-[#C9A96E] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#141210] border border-[#C9A96E25] rounded-xl px-4 py-3 text-[#F5F0E8] text-sm placeholder-[#4A4035] focus:outline-none focus:border-[#C9A96E60] focus:ring-1 focus:ring-[#C9A96E30] transition-all";

const textareaClass = inputClass + " resize-none leading-relaxed";

// ─── Success banner ───────────────────────────────────────────────────────────

function SuccessBanner({
  title,
  body,
  onReset,
}: {
  title: string;
  body: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-10">
      <div className="w-20 h-20 rounded-full bg-[#10B98120] border border-[#10B98140] flex items-center justify-center text-4xl">
        ✅
      </div>
      <div>
        <p className="text-[#F5F0E8] text-xl font-bold mb-2">{title}</p>
        <p className="text-[#8A8070] text-sm leading-relaxed max-w-xs">{body}</p>
      </div>
      <button
        onClick={onReset}
        className="text-[#C9A96E] text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        Enviar outro
      </button>
    </div>
  );
}

// ─── Signup form ──────────────────────────────────────────────────────────────

function SignupFormComponent() {
  const baseId = useId();
  const [form, setForm] = useState<SignupForm>({
    nome: "",
    email: "",
    dispositivo: "",
    ocupacao: "",
    motivacao: "",
    como_soube: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(key: keyof SignupForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.dispositivo) {
      setErrorMsg("Selecione o dispositivo.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/domus/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Erro desconhecido.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Erro de rede. Verifique sua conexão e tente novamente.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <SuccessBanner
        title="Inscrição recebida!"
        body="Entraremos em contato pelo e-mail informado quando as vagas estiverem abertas. Obrigado pelo interesse!"
        onReset={() => {
          setForm({ nome: "", email: "", dispositivo: "", ocupacao: "", motivacao: "", como_soube: "" });
          setState("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nome completo" required>
          <input
            id={`${baseId}-nome`}
            type="text"
            className={inputClass}
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            required
            minLength={2}
          />
        </Field>

        <Field label="E-mail" required>
          <input
            id={`${baseId}-email`}
            type="email"
            className={inputClass}
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Dispositivo" required>
        <div className="grid grid-cols-2 gap-3">
          {(["android", "ios"] as Device[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => set("dispositivo", d)}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium border transition-all ${
                form.dispositivo === d
                  ? "bg-[#C9A96E20] border-[#C9A96E] text-[#C9A96E]"
                  : "bg-[#141210] border-[#C9A96E25] text-[#8A8070] hover:border-[#C9A96E50] hover:text-[#C9A96E]"
              }`}
            >
              {d === "android" ? "🤖 Android" : "🍎 iOS"}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Ocupação / Profissão">
          <input
            id={`${baseId}-ocupacao`}
            type="text"
            className={inputClass}
            placeholder="Ex: Desenvolvedor, Estudante…"
            value={form.ocupacao}
            onChange={(e) => set("ocupacao", e.target.value)}
          />
        </Field>

        <Field label="Como soube do DOMUS">
          <input
            id={`${baseId}-como_soube`}
            type="text"
            className={inputClass}
            placeholder="Ex: Instagram, amigo, GitHub…"
            value={form.como_soube}
            onChange={(e) => set("como_soube", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Por que quer testar o DOMUS?" required>
        <textarea
          id={`${baseId}-motivacao`}
          className={textareaClass}
          rows={4}
          placeholder="Conte um pouco sobre o que te interessa no app e o que espera do teste…"
          value={form.motivacao}
          onChange={(e) => set("motivacao", e.target.value)}
          required
          minLength={20}
        />
        <p className="text-[10px] text-[#4A4035] mt-0.5 self-end">
          {form.motivacao.length} / 20 mín.
        </p>
      </Field>

      {state === "error" && (
        <p className="text-[#EF4444] text-xs bg-[#EF444415] border border-[#EF444430] rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-[#C9A96E] hover:bg-[#DDB87A] disabled:opacity-50 disabled:cursor-not-allowed text-[#111008] font-bold text-sm rounded-xl py-4 transition-all active:scale-[0.98]"
      >
        {state === "loading" ? "Enviando…" : "Quero Testar o DOMUS →"}
      </button>

      <p className="text-center text-[10px] text-[#4A4035]">
        Nenhum dado financeiro é coletado. Apenas nome e e-mail para contato.
      </p>
    </form>
  );
}

// ─── Feedback form ────────────────────────────────────────────────────────────

function FeedbackFormComponent() {
  const baseId = useId();
  const [form, setForm] = useState<FeedbackForm>({
    nome: "",
    email: "",
    tipo: "",
    titulo: "",
    descricao: "",
    dispositivo: "",
    versao_app: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedTipo = FEEDBACK_TIPOS.find((t) => t.value === form.tipo);

  function set(key: keyof FeedbackForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tipo) {
      setErrorMsg("Selecione o tipo de feedback.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/domus/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Erro desconhecido.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Erro de rede. Verifique sua conexão e tente novamente.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <SuccessBanner
        title="Feedback enviado!"
        body="Obrigado pela contribuição! Seu retorno é essencial para tornar o DOMUS cada vez melhor."
        onReset={() => {
          setForm({ nome: "", email: "", tipo: "", titulo: "", descricao: "", dispositivo: "", versao_app: "" });
          setState("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Tipo de feedback */}
      <Field label="Tipo de feedback" required>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEEDBACK_TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("tipo", t.value)}
              className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all ${
                form.tipo === t.value
                  ? `border-[${t.color}] text-[${t.color}]`
                  : "bg-[#141210] border-[#C9A96E25] text-[#8A8070] hover:border-[#C9A96E50]"
              }`}
              style={
                form.tipo === t.value
                  ? {
                      backgroundColor: t.color + "18",
                      borderColor: t.color,
                      color: t.color,
                    }
                  : {}
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nome" required>
          <input
            id={`${baseId}-nome`}
            type="text"
            className={inputClass}
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            required
            minLength={2}
          />
        </Field>

        <Field label="E-mail" required>
          <input
            id={`${baseId}-email`}
            type="email"
            className={inputClass}
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Título" required>
        <input
          id={`${baseId}-titulo`}
          type="text"
          className={inputClass}
          placeholder={
            form.tipo === "bug"
              ? "Ex: App trava ao abrir scanner de NF"
              : form.tipo === "melhoria"
              ? "Ex: Adicionar filtro por categoria no relatório"
              : form.tipo === "sugestao"
              ? "Ex: Widget de saldo para a tela inicial"
              : form.tipo === "elogio"
              ? "Ex: Interface muito limpa e intuitiva"
              : "Descreva resumidamente…"
          }
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          required
          minLength={4}
        />
      </Field>

      <Field label="Descrição detalhada" required>
        <textarea
          id={`${baseId}-descricao`}
          className={textareaClass}
          rows={5}
          placeholder={
            form.tipo === "bug"
              ? "Descreva o passo a passo para reproduzir o problema, o comportamento esperado e o que aconteceu de fato…"
              : "Descreva sua ideia com o máximo de detalhes possível…"
          }
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          required
          minLength={20}
        />
        <p className="text-[10px] text-[#4A4035] mt-0.5 self-end">
          {form.descricao.length} / 20 mín.
        </p>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Dispositivo">
          <div className="grid grid-cols-2 gap-2">
            {(["android", "ios"] as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  set("dispositivo", form.dispositivo === d ? "" : d)
                }
                className={`rounded-xl py-2.5 text-xs font-medium border transition-all ${
                  form.dispositivo === d
                    ? "bg-[#C9A96E20] border-[#C9A96E] text-[#C9A96E]"
                    : "bg-[#141210] border-[#C9A96E25] text-[#8A8070] hover:border-[#C9A96E50]"
                }`}
              >
                {d === "android" ? "🤖 Android" : "🍎 iOS"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Versão do app">
          <input
            id={`${baseId}-versao`}
            type="text"
            className={inputClass}
            placeholder="Ex: 1.0.3"
            value={form.versao_app}
            onChange={(e) => set("versao_app", e.target.value)}
          />
        </Field>
      </div>

      {state === "error" && (
        <p className="text-[#EF4444] text-xs bg-[#EF444415] border border-[#EF444430] rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full font-bold text-sm rounded-xl py-4 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          selectedTipo
            ? {
                backgroundColor: selectedTipo.color + "20",
                border: `1px solid ${selectedTipo.color}60`,
                color: selectedTipo.color,
              }
            : {
                backgroundColor: "#C9A96E20",
                border: "1px solid #C9A96E60",
                color: "#C9A96E",
              }
        }
      >
        {state === "loading" ? "Enviando…" : "Enviar Feedback →"}
      </button>
    </form>
  );
}

// ─── Main page client ─────────────────────────────────────────────────────────

export default function DomusBetaClient() {
  const [tab, setTab] = useState<Tab>("signup");

  return (
    <div className="min-h-screen -mx-4 -mt-4">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-6 py-16 md:py-24 text-center"
        style={{
          background:
            "linear-gradient(160deg, #1C1914 0%, #0E0C08 50%, #141210 100%)",
        }}
      >
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A96E 1px, transparent 1px), linear-gradient(90deg, #C9A96E 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* App icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] mb-6 border"
            style={{
              background: "linear-gradient(135deg, #2A2318, #1C1914)",
              borderColor: "#C9A96E40",
            }}
          >
            <span className="text-4xl">🏠</span>
          </div>

          <div
            className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border"
            style={{
              background: "#C9A96E15",
              borderColor: "#C9A96E40",
              color: "#C9A96E",
            }}
          >
            Teste Fechado — Beta
          </div>

          <h1
            className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ color: "#F5F0E8" }}
          >
            DOMUS
          </h1>
          <p
            className="text-lg md:text-xl font-semibold mb-2"
            style={{ color: "#C9A96E" }}
          >
            Finanças Pessoais & Gamificação
          </p>
          <p
            className="text-sm md:text-base leading-relaxed max-w-lg mx-auto"
            style={{ color: "#8A8070" }}
          >
            App de finanças 100% local, com scanner de NF, IA financeira,
            sincronização P2P e muito mais. Seus dados só ficam no seu
            dispositivo.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Android", "iOS", "100% Privado", "Católico", "Sem assinatura"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border"
                style={{
                  background: "#F5F0E808",
                  borderColor: "#F5F0E820",
                  color: "#8A8070",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features grid ─────────────────────────────────────── */}
      <div
        className="px-4 py-12"
        style={{ background: "#111008" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center text-xs font-bold tracking-widest uppercase mb-8"
            style={{ color: "#C9A96E" }}
          >
            O que você vai testar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-4 border transition-colors"
                style={{
                  background: "#1C1914",
                  borderColor: "#C9A96E20",
                }}
              >
                <span className="text-2xl block mb-2">{f.icon}</span>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "#F5F0E8" }}
                >
                  {f.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#8A8070" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Catholic differentiator ───────────────────────────── */}
      <div
        className="px-4 py-10"
        style={{ background: "#0E0C08", borderTop: "1px solid #C9A96E15" }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-3xl p-6 md:p-8 border flex flex-col md:flex-row items-start md:items-center gap-6"
            style={{
              background: "linear-gradient(135deg, #1C1914 0%, #1A1610 100%)",
              borderColor: "#C9A96E35",
            }}
          >
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border"
              style={{ background: "#C9A96E15", borderColor: "#C9A96E30" }}
            >
              ✝️
            </div>
            <div className="flex-1">
              <div
                className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 border"
                style={{
                  background: "#C9A96E12",
                  borderColor: "#C9A96E35",
                  color: "#C9A96E",
                }}
              >
                Diferencial Católico
              </div>
              <h3
                className="text-base md:text-lg font-bold mb-1"
                style={{ color: "#F5F0E8" }}
              >
                Troféu Surpresa do Santo do Mês
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#8A8070" }}
              >
                Todo mês o DOMUS sorteia um santo da liturgia para ser o troféu
                especial daquele período — como São Marcos Evangelista em Abril.
                A gamificação une fé e disciplina financeira, integrando o
                calendário litúrgico à sua jornada de crescimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forms ─────────────────────────────────────────────── */}
      <div
        className="px-4 py-12"
        style={{ background: "#0E0C08" }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Tab switcher */}
          <div
            className="flex rounded-2xl p-1 mb-8 gap-1"
            style={{ background: "#1C1914", border: "1px solid #C9A96E20" }}
          >
            {(
              [
                { id: "signup", label: "📋 Quero Testar" },
                { id: "feedback", label: "💬 Enviar Feedback" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                style={
                  tab === t.id
                    ? {
                        background: "#C9A96E",
                        color: "#111008",
                      }
                    : {
                        color: "#8A8070",
                      }
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div
            className="rounded-3xl p-6 md:p-8 border"
            style={{ background: "#1C1914", borderColor: "#C9A96E20" }}
          >
            {tab === "signup" ? (
              <>
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: "#F5F0E8" }}
                >
                  Inscrição para o Beta
                </h2>
                <p
                  className="text-xs mb-6 leading-relaxed"
                  style={{ color: "#8A8070" }}
                >
                  Preencha o formulário e entraremos em contato quando as vagas
                  estiverem disponíveis.
                </p>
                <SignupFormComponent />
              </>
            ) : (
              <>
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: "#F5F0E8" }}
                >
                  Feedback de Uso
                </h2>
                <p
                  className="text-xs mb-6 leading-relaxed"
                  style={{ color: "#8A8070" }}
                >
                  Já está testando? Reporte bugs, sugira melhorias ou envie um
                  elogio. Toda contribuição é muito bem-vinda!
                </p>
                <FeedbackFormComponent />
              </>
            )}
          </div>

          {/* Privacy note */}
          <p
            className="text-center text-[11px] mt-6 leading-relaxed"
            style={{ color: "#4A4035" }}
          >
            Suas informações são usadas exclusivamente para contato sobre o beta.
            Veja nossa{" "}
            <a
              href="/domus/privacy"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "#C9A96E" }}
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── Footer strip ──────────────────────────────────────── */}
      <div
        className="px-4 py-8 text-center border-t"
        style={{ background: "#0E0C08", borderColor: "#C9A96E15" }}
      >
        <p className="text-xs font-bold" style={{ color: "#C9A96E" }}>
          DOMUS · Pixel Eucarístico
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#4A4035" }}>
          Onde a Fé encontra a Tecnologia
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useId } from "react";
import dynamic from "next/dynamic";

const PhoneCarousel = dynamic(() => import("./PhoneMockup"), { ssr: false });

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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
    desc: "Consultor com Claude, ChatGPT, Gemini ou DeepSeek. Sua chave, sem rastreamento.",
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

const FEEDBACK_TIPOS: {
  value: FeedbackTipo;
  label: string;
  activeCls: string;
  btnCls: string;
}[] = [
  {
    value: "bug",
    label: "🐛 Bug",
    activeCls: "bg-error/15 border-error text-error",
    btnCls: "btn-error",
  },
  {
    value: "melhoria",
    label: "✨ Melhoria",
    activeCls: "bg-success/15 border-success text-success",
    btnCls: "btn-success",
  },
  {
    value: "sugestao",
    label: "💡 Sugestão",
    activeCls: "bg-warning/15 border-warning text-warning",
    btnCls: "btn-warning",
  },
  {
    value: "elogio",
    label: "🙌 Elogio",
    activeCls: "bg-secondary/15 border-secondary text-secondary",
    btnCls: "btn-secondary",
  },
];

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="fieldset gap-1">
      <legend className="fieldset-legend text-[10px] uppercase tracking-widest text-base-content/50 font-semibold">
        {label}
        {required && <span className="text-warning ml-1">*</span>}
      </legend>
      {children}
      {hint && (
        <p className="fieldset-label text-[10px] text-base-content/40 self-end">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

// ─── Success banner ────────────────────────────────────────────────────────────

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
      <div className="w-20 h-20 rounded-full bg-success/15 border border-success/40 flex items-center justify-center text-4xl">
        ✅
      </div>
      <div>
        <p className="text-base-content text-xl font-bold mb-2">{title}</p>
        <p className="text-base-content/60 text-sm leading-relaxed max-w-xs">
          {body}
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-warning text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        Enviar outro
      </button>
    </div>
  );
}

// ─── Device picker ─────────────────────────────────────────────────────────────

function DevicePicker({
  value,
  onChange,
  toggle,
}: {
  value: Device | "";
  onChange: (d: Device | "") => void;
  toggle?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["android", "ios"] as Device[]).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(toggle && value === d ? "" : d)}
          className={`rounded-xl py-2.5 px-3 text-sm font-medium border transition-all ${
            value === d
              ? "bg-warning/15 border-warning text-warning"
              : "bg-base-100 border-base-content/20 text-base-content/50 hover:border-warning/50 hover:text-warning"
          }`}
        >
          {d === "android" ? "🤖 Android" : "🍎 iOS"}
        </button>
      ))}
    </div>
  );
}

// ─── Signup form ───────────────────────────────────────────────────────────────

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome completo" required>
          <input
            id={`${baseId}-nome`}
            type="text"
            className="input input-bordered w-full"
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
            className="input input-bordered w-full"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Dispositivo" required>
        <DevicePicker
          value={form.dispositivo}
          onChange={(d) => set("dispositivo", d)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ocupação / Profissão">
          <input
            id={`${baseId}-ocupacao`}
            type="text"
            className="input input-bordered w-full"
            placeholder="Ex: Desenvolvedor, Estudante…"
            value={form.ocupacao}
            onChange={(e) => set("ocupacao", e.target.value)}
          />
        </Field>

        <Field label="Como soube do DOMUS">
          <input
            id={`${baseId}-como_soube`}
            type="text"
            className="input input-bordered w-full"
            placeholder="Ex: Instagram, amigo, GitHub…"
            value={form.como_soube}
            onChange={(e) => set("como_soube", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Por que quer testar o DOMUS?"
        required
        hint={`${form.motivacao.length} / 20 mín.`}
      >
        <textarea
          id={`${baseId}-motivacao`}
          className="textarea textarea-bordered w-full leading-relaxed"
          rows={4}
          placeholder="Conte um pouco sobre o que te interessa no app e o que espera do teste…"
          value={form.motivacao}
          onChange={(e) => set("motivacao", e.target.value)}
          required
          minLength={20}
        />
      </Field>

      {state === "error" && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn btn-warning w-full border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none mt-2"
      >
        {state === "loading" ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Quero Testar o DOMUS →"
        )}
      </button>

      <p className="text-center text-[10px] text-base-content/40">
        Nenhum dado financeiro é coletado. Apenas nome e e-mail para contato.
      </p>
    </form>
  );
}

// ─── Feedback form ─────────────────────────────────────────────────────────────

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Tipo de feedback" required>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEEDBACK_TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("tipo", t.value)}
              className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all ${
                form.tipo === t.value
                  ? t.activeCls
                  : "bg-base-100 border-base-content/20 text-base-content/50 hover:border-base-content/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome" required>
          <input
            id={`${baseId}-nome`}
            type="text"
            className="input input-bordered w-full"
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
            className="input input-bordered w-full"
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
          className="input input-bordered w-full"
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

      <Field
        label="Descrição detalhada"
        required
        hint={`${form.descricao.length} / 20 mín.`}
      >
        <textarea
          id={`${baseId}-descricao`}
          className="textarea textarea-bordered w-full leading-relaxed"
          rows={5}
          placeholder={
            form.tipo === "bug"
              ? "Passo a passo para reproduzir o problema, comportamento esperado e o que aconteceu…"
              : "Descreva sua ideia com o máximo de detalhes possível…"
          }
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          required
          minLength={20}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Dispositivo">
          <DevicePicker
            value={form.dispositivo}
            onChange={(d) => set("dispositivo", d)}
            toggle
          />
        </Field>

        <Field label="Versão do app">
          <input
            id={`${baseId}-versao`}
            type="text"
            className="input input-bordered w-full"
            placeholder="Ex: 1.0.3"
            value={form.versao_app}
            onChange={(e) => set("versao_app", e.target.value)}
          />
        </Field>
      </div>

      {state === "error" && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className={`btn w-full border-2 border-base-content shadow-[4px_4px_0_0_currentColor] rounded-none mt-2 ${
          selectedTipo ? selectedTipo.btnCls : "btn-warning"
        }`}
      >
        {state === "loading" ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Enviar Feedback →"
        )}
      </button>
    </form>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DomusBetaClient() {
  const [tab, setTab] = useState<Tab>("signup");

  return (
    <div className="min-h-screen -mx-4 -mt-4">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-base-300 px-6 py-16 md:py-24 text-center">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* App icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] mb-6 bg-base-200 border-4 border-base-content shadow-[6px_6px_0_0_currentColor]">
            <span className="text-4xl">🏠</span>
          </div>

          <div className="mb-4">
            <span className="badge badge-warning badge-outline font-bold tracking-widest uppercase text-xs px-3 py-3">
              Teste Fechado — Beta
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-base-content">
            DOMUS
          </h1>
          <p className="text-lg md:text-xl font-semibold mb-2 text-warning">
            Finanças Pessoais & Gamificação
          </p>
          <p className="text-sm md:text-base leading-relaxed max-w-lg mx-auto text-base-content/60">
            App de finanças 100% local, com scanner de NF, IA financeira,
            sincronização P2P e muito mais. Seus dados só ficam no seu dispositivo.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Android", "iOS", "100% Privado", "Católico", "Sem assinatura"].map(
              (tag) => (
                <span key={tag} className="badge badge-outline text-xs">
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Features grid ──────────────────────────────────────── */}
      <div className="bg-base-100 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-8 text-warning">
            O que você vai testar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-base-200 border border-base-content/15 rounded-2xl p-4 hover:border-warning/40 transition-colors"
              >
                <span className="text-2xl block mb-2">{f.icon}</span>
                <p className="text-sm font-semibold mb-1 text-base-content">
                  {f.title}
                </p>
                <p className="text-xs leading-relaxed text-base-content/55">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Screenshot carousel ────────────────────────────────── */}
      <div className="bg-base-200 px-4 py-12 border-y border-base-content/10">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-2 text-warning">
            Veja o app em ação
          </p>
          <p className="text-center text-sm text-base-content/50 mb-10">
            Clique nas telas ao lado para navegar
          </p>
          <PhoneCarousel />
        </div>
      </div>

      {/* ── Catholic differentiator ─────────────────────────────── */}
      <div className="bg-base-200 px-4 py-10 border-y border-base-content/10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-base-100 border-2 border-warning/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-warning/10 border border-warning/30">
              ✝️
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span className="badge badge-warning badge-outline text-[10px] font-bold tracking-widest uppercase">
                  Diferencial Católico
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-1 text-base-content">
                Troféu Surpresa do Santo do Mês
              </h3>
              <p className="text-xs leading-relaxed text-base-content/60">
                Todo mês o DOMUS sorteia um santo da liturgia para ser o troféu
                especial do período — como São Marcos Evangelista em Abril. A
                gamificação une fé e disciplina financeira, integrando o calendário
                litúrgico à sua jornada de crescimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forms ──────────────────────────────────────────────── */}
      <div className="bg-base-100 px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Tab switcher */}
          <div className="flex bg-base-200 border-2 border-base-content rounded-none shadow-[4px_4px_0_0_currentColor] p-1 mb-8 gap-1">
            {(
              [
                { id: "signup", label: "📋 Quero Testar" },
                { id: "feedback", label: "💬 Enviar Feedback" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-sm font-bold transition-all rounded-none ${
                  tab === t.id
                    ? "bg-warning text-warning-content border-2 border-base-content shadow-[2px_2px_0_0_currentColor]"
                    : "text-base-content/50 hover:text-base-content"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-base-200 border-4 border-base-content rounded-none shadow-[8px_8px_0_0_currentColor] p-6 md:p-8">
            {tab === "signup" ? (
              <>
                <h2 className="text-lg font-bold mb-1 text-base-content">
                  Inscrição para o Beta
                </h2>
                <p className="text-xs mb-6 leading-relaxed text-base-content/55">
                  Preencha o formulário e entraremos em contato quando as vagas
                  estiverem disponíveis.
                </p>
                <SignupFormComponent />
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-1 text-base-content">
                  Feedback de Uso
                </h2>
                <p className="text-xs mb-6 leading-relaxed text-base-content/55">
                  Já está testando? Reporte bugs, sugira melhorias ou envie um
                  elogio. Toda contribuição é muito bem-vinda!
                </p>
                <FeedbackFormComponent />
              </>
            )}
          </div>

          {/* Privacy note */}
          <p className="text-center text-[11px] mt-6 leading-relaxed text-base-content/40">
            Suas informações são usadas exclusivamente para contato sobre o beta.
            Veja nossa{" "}
            <a
              href="/domus/privacy"
              className="text-warning underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── Footer strip ───────────────────────────────────────── */}
      <div className="bg-base-200 border-t border-base-content/10 px-4 py-8 text-center">
        <p className="text-xs font-bold text-warning">DOMUS · Pixel Eucarístico</p>
        <p className="text-[11px] mt-1 text-base-content/40">
          Onde a Fé encontra a Tecnologia
        </p>
      </div>

    </div>
  );
}

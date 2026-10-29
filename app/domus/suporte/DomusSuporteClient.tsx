"use client";

import { useState, useId, useRef } from "react";
import dynamic from "next/dynamic";
import { FaGooglePlay } from "react-icons/fa";
import { DOMUS_CONTACT_EMAIL as CONTACT_EMAIL, DOMUS_PLAY_STORE_URL } from "../links";
import {
  HONEYPOT_FIELD,
  LIMITS,
  MIN_MENSAGEM,
  codePointLength,
  validateFeedback,
  type FeedbackPayload,
  type Tipo,
} from "./feedbackContract";

const PhoneCarousel = dynamic(() => import("./PhoneMockup"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────

/** Campos do formulário; o campo-armadilha (honeypot) fica escondido para pessoas. */
type SupportForm = FeedbackPayload;

type FormState = "idle" | "loading" | "success" | "error";

const EMPTY_FORM: SupportForm = {
  nome: "",
  email: "",
  tipo: "",
  mensagem: "",
  versao_app: "",
  dispositivo: "",
  [HONEYPOT_FIELD]: "",
};

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
    desc: "Consultor com Claude, ChatGPT, Gemini, DeepSeek e outros, usando a sua própria chave de API.",
  },
  {
    icon: "🏆",
    title: "Gamificação",
    desc: "XP, nível, streak, temporadas e troféus para transformar finanças em hábito.",
  },
  {
    icon: "🔄",
    title: "Sincronização",
    desc: "Opcional: sincroniza seus aparelhos por relays Nostr públicos, com um código de grupo.",
  },
  {
    icon: "🔒",
    title: "Sem servidor próprio",
    desc: "Seus registros ficam no aparelho. Backup cifrado com AES-256-GCM.",
  },
];

const TIPOS: {
  value: Tipo;
  icon: string;
  label: string;
  activeCls: string;
  btnCls: string;
}[] = [
  {
    value: "bug",
    icon: "🐛",
    label: "Relatar um bug",
    activeCls: "bg-error/15 border-error text-error",
    btnCls: "btn-error",
  },
  {
    value: "sugestao",
    icon: "💡",
    label: "Sugestão",
    activeCls: "bg-warning/15 border-warning text-warning",
    btnCls: "btn-warning",
  },
  {
    value: "contato",
    icon: "✉️",
    label: "Contato",
    activeCls: "bg-info/15 border-info text-info",
    btnCls: "btn-info",
  },
];

const MENSAGEM_PLACEHOLDER: Record<Tipo | "", string> = {
  bug: "O que aconteceu? Conte o passo a passo até o problema, o que você esperava e o que o app fez…",
  sugestao: "Qual recurso ou melhoria você gostaria de ver no DOMUS?",
  contato: "Escreva sua mensagem…",
  "": "Escreva sua mensagem…",
};

// ─── Small components ─────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fieldset gap-1">
      <label
        htmlFor={htmlFor}
        className="fieldset-legend text-[10px] uppercase tracking-widest text-base-content/50 font-semibold"
      >
        {label}
        {required ? (
          <span className="text-warning ml-1">*</span>
        ) : (
          <span className="normal-case tracking-normal font-normal ml-1">(opcional)</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="fieldset-label text-[10px] text-base-content/40 self-end">
          {hint}
        </p>
      )}
    </div>
  );
}

function PlayStoreButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={DOMUS_PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Baixar o DOMUS no Google Play"
      className={`inline-flex items-center gap-3 bg-black text-white border-2 border-base-content rounded-xl px-5 py-3 shadow-[4px_4px_0_0_currentColor] hover:translate-y-[-2px] transition-transform ${className}`}
    >
      <FaGooglePlay className="w-7 h-7 flex-shrink-0" aria-hidden="true" />
      <span className="flex flex-col items-start leading-tight text-left">
        <span className="text-[10px] uppercase tracking-wider text-white/80">
          Disponível no
        </span>
        <span className="text-lg font-semibold">Google Play</span>
      </span>
    </a>
  );
}

function SuccessBanner({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-10" role="status">
      <div className="w-20 h-20 rounded-full bg-success/15 border border-success/40 flex items-center justify-center text-4xl">
        ✅
      </div>
      <div>
        <p className="text-base-content text-xl font-bold mb-2">Mensagem enviada!</p>
        <p className="text-base-content/60 text-sm leading-relaxed max-w-xs">
          Obrigado por escrever. Se for preciso, respondemos pelo e-mail que
          você informou.
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-warning text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        Enviar outra mensagem
      </button>
    </div>
  );
}

// ─── Support form ─────────────────────────────────────────────────────────────

function SupportFormComponent() {
  const baseId = useId();
  const [form, setForm] = useState<SupportForm>(EMPTY_FORM);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  /** Trava contra envio duplo no mesmo quadro (antes de o estado "loading" renderizar). */
  const submittingRef = useRef(false);

  const selectedTipo = TIPOS.find((t) => t.value === form.tipo);
  const isBug = form.tipo === "bug";

  function set(key: keyof SupportForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;

    const trimmed: SupportForm = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      tipo: form.tipo,
      mensagem: form.mensagem.trim(),
      versao_app: isBug ? form.versao_app.trim() : "",
      dispositivo: isBug ? form.dispositivo.trim() : "",
      [HONEYPOT_FIELD]: form[HONEYPOT_FIELD],
    };
    const invalid = validateFeedback(trimmed);
    if (invalid) {
      setErrorMsg(invalid);
      setState("error");
      return;
    }

    submittingRef.current = true;
    setState("loading");
    setErrorMsg("");
    try {
      const payload = trimmed;
      const res = await fetch("/api/domus/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let json: { error?: string } = {};
      try {
        json = await res.json();
      } catch {
        // resposta sem JSON (ex.: erro do servidor); cai na mensagem padrão
      }
      if (!res.ok) {
        setErrorMsg(
          json.error ?? "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde."
        );
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Erro de rede. Verifique sua conexão e tente novamente.");
      setState("error");
    } finally {
      submittingRef.current = false;
    }
  }

  if (state === "success") {
    return (
      <SuccessBanner
        onReset={() => {
          setForm(EMPTY_FORM);
          setState("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="fieldset gap-1">
        <p
          id={`${baseId}-tipo`}
          className="fieldset-legend text-[10px] uppercase tracking-widest text-base-content/50 font-semibold"
        >
          Sobre o que você quer falar?
          <span className="text-warning ml-1">*</span>
        </p>
        <div
          role="radiogroup"
          aria-labelledby={`${baseId}-tipo`}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={form.tipo === t.value}
              onClick={() => set("tipo", t.value)}
              className={`flex sm:flex-col items-center justify-center gap-2 rounded-none border-2 transition-all p-3 ${
                form.tipo === t.value
                  ? `${t.activeCls} border-base-content shadow-[2px_2px_0_0_currentColor]`
                  : "bg-base-100 border-base-content/20 text-base-content/60 hover:border-base-content/40"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {t.icon}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome" htmlFor={`${baseId}-nome`}>
          <input
            id={`${baseId}-nome`}
            type="text"
            className="input input-bordered w-full"
            placeholder="Seu nome"
            autoComplete="name"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            maxLength={LIMITS.nome}
          />
        </Field>

        <Field label="E-mail" htmlFor={`${baseId}-email`} required>
          <input
            id={`${baseId}-email`}
            type="email"
            className="input input-bordered w-full"
            placeholder="seu@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            maxLength={LIMITS.email}
          />
        </Field>
      </div>

      <Field
        label={isBug ? "Descreva o problema" : "Mensagem"}
        htmlFor={`${baseId}-mensagem`}
        required
        hint={`${codePointLength(form.mensagem.trim())} / ${MIN_MENSAGEM} mín.`}
      >
        <textarea
          id={`${baseId}-mensagem`}
          className="textarea textarea-bordered w-full leading-relaxed"
          rows={5}
          placeholder={MENSAGEM_PLACEHOLDER[form.tipo]}
          value={form.mensagem}
          onChange={(e) => set("mensagem", e.target.value)}
          required
        />
      </Field>

      {isBug && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Versão do app" htmlFor={`${baseId}-versao`}>
            <input
              id={`${baseId}-versao`}
              type="text"
              className="input input-bordered w-full"
              placeholder="Ex.: 1.0.3 (em Sobre, no app)"
              value={form.versao_app}
              onChange={(e) => set("versao_app", e.target.value)}
              maxLength={LIMITS.versao_app}
            />
          </Field>

          <Field label="Aparelho e Android" htmlFor={`${baseId}-dispositivo`}>
            <input
              id={`${baseId}-dispositivo`}
              type="text"
              className="input input-bordered w-full"
              placeholder="Ex.: Galaxy A54, Android 14"
              value={form.dispositivo}
              onChange={(e) => set("dispositivo", e.target.value)}
              maxLength={LIMITS.dispositivo}
            />
          </Field>
        </div>
      )}

      {/* Honeypot: fora da tela para pessoas; robôs costumam preencher.
          Nome neutro e autoComplete="new-password" para o navegador não preencher sozinho. */}
      <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
        <label htmlFor={`${baseId}-${HONEYPOT_FIELD}`}>Não preencha este campo</label>
        <input
          id={`${baseId}-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          value={form[HONEYPOT_FIELD]}
          onChange={(e) => set(HONEYPOT_FIELD, e.target.value)}
        />
      </div>

      {state === "error" && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          <div>
            <p>{errorMsg}</p>
            <p className="text-xs opacity-80 mt-1">
              Se preferir, escreva para{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline break-all">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
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
          "Enviar mensagem →"
        )}
      </button>
    </form>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DomusSuporteClient() {
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
            <span className="badge badge-success badge-outline font-bold tracking-widest uppercase text-xs px-3 py-3">
              Disponível no Google Play
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-base-content">
            DOMUS
          </h1>
          <p className="text-lg md:text-xl font-semibold mb-2 text-warning">
            Finanças Pessoais & Gamificação
          </p>
          <p className="text-sm md:text-base leading-relaxed max-w-lg mx-auto text-base-content/60">
            App de finanças pessoais com scanner de NF, IA financeira,
            sincronização entre aparelhos e muito mais. Seus registros ficam no
            seu aparelho, e os recursos que enviam dados são opcionais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <PlayStoreButton />
            <a
              href="#suporte"
              className="btn btn-outline border-2 rounded-none"
            >
              Suporte e contato
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Android", "Sem servidor próprio", "Católico", "Sem assinatura"].map(
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
            O que o DOMUS faz
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

      {/* ── Support form ───────────────────────────────────────── */}
      <div id="suporte" className="bg-base-100 px-4 py-12 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-base-200 border-4 border-base-content rounded-none shadow-[8px_8px_0_0_currentColor] p-6 md:p-8">
            <h2 className="text-lg font-bold mb-1 text-base-content">
              Suporte e contato
            </h2>
            <p className="text-xs mb-6 leading-relaxed text-base-content/55">
              Encontrou um bug, tem uma sugestão ou quer falar com a gente?
              Escreva abaixo. Respondemos pelo e-mail informado.
            </p>
            <SupportFormComponent />
          </div>

          <div className="text-center text-[11px] mt-6 leading-relaxed text-base-content/40 space-y-2">
            <p>
              Também atendemos por e-mail:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-warning underline underline-offset-2 hover:opacity-70 transition-opacity break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              O que você enviar aqui é usado só para responder à sua mensagem e
              corrigir o app. Veja a{" "}
              <a
                href="/domus/privacy"
                className="text-warning underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Política de Privacidade do DOMUS
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ── Download strip ─────────────────────────────────────── */}
      <div className="bg-base-300 px-4 py-10 text-center border-t border-base-content/10">
        <p className="text-sm font-semibold mb-4 text-base-content">
          Ainda não tem o DOMUS? Baixe para Android.
        </p>
        <PlayStoreButton />
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

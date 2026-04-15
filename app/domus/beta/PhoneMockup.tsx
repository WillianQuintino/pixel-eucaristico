"use client";

import { useState } from "react";
import Image from "next/image";
import { SCREENSHOTS, type Screenshot } from "./screenshots";

// ─── Single phone frame ───────────────────────────────────────────────────────

function PhoneFrame({ shot }: { shot: Screenshot }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 w-44 sm:w-48">
      {/* Phone shell */}
      <div
        className="relative w-full rounded-[2.5rem] border-[6px] border-base-content bg-base-content overflow-hidden"
        style={{ aspectRatio: "9 / 19.5" }}
      >
        {/* Side buttons (decorative) */}
        <div className="absolute -left-[10px] top-[22%] w-[6px] h-8 bg-base-content rounded-l-sm" />
        <div className="absolute -left-[10px] top-[34%] w-[6px] h-12 bg-base-content rounded-l-sm" />
        <div className="absolute -left-[10px] top-[48%] w-[6px] h-12 bg-base-content rounded-l-sm" />
        <div className="absolute -right-[10px] top-[30%] w-[6px] h-16 bg-base-content rounded-r-sm" />

        {/* Screen area */}
        <div className="absolute inset-0 rounded-[1.9rem] overflow-hidden bg-base-300">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-5 pt-2 pb-1">
            {/* Dynamic island / pill */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-base-content rounded-full" />
          </div>

          {/* Screenshot image */}
          {!error ? (
            <Image
              src={shot.file}
              alt={shot.label}
              fill
              className={`object-cover object-top transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              sizes="192px"
            />
          ) : null}

          {/* Placeholder shown while loading or on error */}
          {(!loaded || error) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <span className="text-4xl opacity-30">📱</span>
              <p className="text-[10px] text-base-content/40 leading-relaxed">
                {error
                  ? `Adicione:\npublic${shot.file}`
                  : "Carregando…"}
              </p>
            </div>
          )}

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-base-content/30 rounded-full" />
        </div>
      </div>

      {/* Caption */}
      <div className="text-center">
        <p className="text-sm font-bold text-base-content">{shot.label}</p>
        <p className="text-[11px] text-base-content/50 leading-snug mt-0.5 max-w-[11rem]">
          {shot.desc}
        </p>
      </div>
    </div>
  );
}

// ─── Navigation dots ──────────────────────────────────────────────────────────

function Dots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Tela ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`rounded-full transition-all ${
            i === active
              ? "w-5 h-2 bg-warning"
              : "w-2 h-2 bg-base-content/20 hover:bg-base-content/40"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

export default function PhoneCarousel() {
  const [active, setActive] = useState(0);
  const total = SCREENSHOTS.length;

  function prev() {
    setActive((a) => (a - 1 + total) % total);
  }
  function next() {
    setActive((a) => (a + 1) % total);
  }

  // visible window: active-1, active, active+1, active+2
  const visible = [-1, 0, 1, 2].map((offset) => ({
    shot: SCREENSHOTS[(active + offset + total) % total],
    offset,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Phones row */}
      <div className="flex items-end justify-center gap-4 overflow-hidden py-4">
        {visible.map(({ shot, offset }) => (
          <div
            key={shot.file}
            onClick={() => {
              if (offset === -1) prev();
              else if (offset === 2) next();
              else if (offset === 1) setActive((a) => (a + 1) % total);
            }}
            className={`transition-all duration-300 ${
              offset === 0
                ? "scale-100 opacity-100 cursor-default"
                : offset === 1
                ? "scale-90 opacity-60 cursor-pointer hover:opacity-80"
                : "scale-75 opacity-30 cursor-pointer hover:opacity-50"
            }`}
          >
            <PhoneFrame shot={shot} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="btn btn-sm btn-ghost border border-base-content/20 rounded-none w-9 h-9 p-0"
        >
          ←
        </button>
        <Dots total={total} active={active} onSelect={setActive} />
        <button
          onClick={next}
          aria-label="Próximo"
          className="btn btn-sm btn-ghost border border-base-content/20 rounded-none w-9 h-9 p-0"
        >
          →
        </button>
      </div>
    </div>
  );
}

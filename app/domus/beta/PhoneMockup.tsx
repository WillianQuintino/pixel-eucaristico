"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import Image from "next/image";
import { SCREENSHOTS } from "./screenshots";

const TOTAL = SCREENSHOTS.length;
const DRAG_THRESHOLD = 60; // px to trigger navigation

// ─── Phone frame ──────────────────────────────────────────────────────────────

function PhoneFrame({
  index,
  priority = false,
}: {
  index: number;
  priority?: boolean;
}) {
  const shot = SCREENSHOTS[((index % TOTAL) + TOTAL) % TOTAL];
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex-shrink-0 w-[185px]" style={{ aspectRatio: "9/19.5" }}>
      {/* Phone body */}
      <div
        className="absolute inset-0 rounded-[2.8rem] bg-base-content"
        style={{
          boxShadow:
            "inset 0 0 0 2px color-mix(in oklab, var(--color-base-100) 20%, transparent), 0 30px 60px -10px color-mix(in oklab, var(--color-base-content) 35%, transparent)",
        }}
      />

      {/* Side buttons */}
      <div className="absolute -left-[5px] top-[20%]  w-[5px] h-7  bg-base-content rounded-l-sm opacity-80" />
      <div className="absolute -left-[5px] top-[30%]  w-[5px] h-10 bg-base-content rounded-l-sm opacity-80" />
      <div className="absolute -left-[5px] top-[43%]  w-[5px] h-10 bg-base-content rounded-l-sm opacity-80" />
      <div className="absolute -right-[5px] top-[28%] w-[5px] h-14 bg-base-content rounded-r-sm opacity-80" />

      {/* Screen */}
      <div className="absolute inset-[5px] rounded-[2.4rem] overflow-hidden bg-[#0E0C08]">
        {/* Dynamic island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 w-[52px] h-[14px] bg-base-content rounded-full" />

        {/* Screenshot */}
        {!imgError && (
          <Image
            src={shot.file}
            alt={shot.label}
            fill
            priority={priority}
            className={`object-cover object-top select-none pointer-events-none transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            sizes="185px"
            draggable={false}
          />
        )}

        {/* Placeholder */}
        {(!loaded || imgError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="text-3xl opacity-20">📱</span>
            <p className="text-[9px] text-base-content/30 leading-relaxed whitespace-pre-line">
              {imgError ? `public${shot.file}` : ""}
            </p>
          </div>
        )}

        {/* Screen glare */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[2.4rem]"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, white 8%, transparent) 0%, transparent 50%)",
          }}
        />

        {/* Home bar */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[72px] h-[4px] bg-base-content/25 rounded-full" />
      </div>
    </div>
  );
}

// ─── Caption ──────────────────────────────────────────────────────────────────

function Caption({ index }: { index: number }) {
  const shot = SCREENSHOTS[index];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="text-center h-12 flex flex-col items-center justify-center"
      >
        <p className="text-sm font-bold text-base-content">{shot.label}</p>
        <p className="text-[11px] text-base-content/50 mt-0.5 max-w-[220px] leading-snug">
          {shot.desc}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

function Dots({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex justify-center gap-1.5">
      {SCREENSHOTS.map((_, i) => (
        <motion.button
          key={i}
          aria-label={`Tela ${i + 1}`}
          onClick={() => onSelect(i)}
          animate={{ width: i === active ? 20 : 8, opacity: i === active ? 1 : 0.3 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="h-2 rounded-full bg-warning origin-left"
        />
      ))}
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

const SLIDE = {
  enter: (dir: number) => ({
    x: dir > 0 ? 320 : -320,
    scale: 0.78,
    opacity: 0,
    rotateY: dir > 0 ? 20 : -20,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      x:        { type: "spring", stiffness: 260, damping: 28 },
      scale:    { type: "spring", stiffness: 260, damping: 28 },
      rotateY:  { type: "spring", stiffness: 260, damping: 28 },
      opacity:  { duration: 0.18 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -260 : 260,
    scale: 0.78,
    opacity: 0,
    rotateY: dir > 0 ? -20 : 20,
    transition: {
      x:       { type: "spring", stiffness: 260, damping: 28 },
      scale:   { duration: 0.22 },
      opacity: { duration: 0.18 },
    },
  }),
};

export default function PhoneCarousel() {
  const [[active, dir], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (newIndex: number, direction: number) => {
      setPage([((newIndex % TOTAL) + TOTAL) % TOTAL, direction]);
    },
    []
  );

  const next = useCallback(() => go(active + 1, 1), [active, go]);
  const prev = useCallback(() => go(active - 1, -1), [active, go]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, 3200);
    return () => clearTimeout(t);
  }, [active, paused, next]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -DRAG_THRESHOLD) next();
    else if (info.offset.x > DRAG_THRESHOLD) prev();
  }

  const prevIdx = ((active - 1) + TOTAL) % TOTAL;
  const nextIdx = (active + 1) % TOTAL;

  return (
    <div
      className="flex flex-col items-center gap-6 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 430, perspective: "1000px" }}
      >
        {/* Left peek */}
        <div
          className="absolute top-0 pointer-events-none"
          style={{
            left: "calc(50% - 310px)",
            transform: "scale(0.72) rotateY(28deg)",
            transformOrigin: "right center",
            opacity: 0.25,
            filter: "blur(1px)",
          }}
        >
          <PhoneFrame index={prevIdx} />
        </div>

        {/* Right peek */}
        <div
          className="absolute top-0 pointer-events-none"
          style={{
            left: "calc(50% + 125px)",
            transform: "scale(0.72) rotateY(-28deg)",
            transformOrigin: "left center",
            opacity: 0.25,
            filter: "blur(1px)",
          }}
        >
          <PhoneFrame index={nextIdx} />
        </div>

        {/* Center — animated */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ perspective: "800px" }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={active}
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={onDragEnd}
              className="cursor-grab active:cursor-grabbing"
              style={{ willChange: "transform" }}
            >
              <PhoneFrame index={active} priority />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gradient vignette on sides */}
        <div
          className="absolute inset-y-0 left-0 w-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--color-base-200, #f2f2f0), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--color-base-200, #f2f2f0), transparent)",
          }}
        />
      </div>

      {/* Caption */}
      <Caption index={active} />

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="btn btn-xs btn-ghost border border-base-content/20 rounded-none w-8 h-8 p-0 text-base"
        >
          ←
        </button>
        <Dots active={active} onSelect={(i) => go(i, i > active ? 1 : -1)} />
        <button
          onClick={next}
          aria-label="Próximo"
          className="btn btn-xs btn-ghost border border-base-content/20 rounded-none w-8 h-8 p-0 text-base"
        >
          →
        </button>
      </div>

      <p className="text-[10px] text-base-content/30">
        Arraste ou use as setas para navegar
      </p>
    </div>
  );
}

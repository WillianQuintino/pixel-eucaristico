"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import { SCREENSHOTS } from "./screenshots";

// ─── constants ────────────────────────────────────────────────────────────────
const TOTAL      = SCREENSHOTS.length;
const PHONE_W    = 180;          // px — phone width
const PHONE_H    = PHONE_W / (9 / 19.5); // ≈ 390 px
const GAP        = 24;           // gap between phones
const SLOT       = PHONE_W + GAP;
const DRAG_VEL   = 150;          // px/s min velocity to flip
const DRAG_DIST  = 50;           // px min distance to flip
const AUTO_MS    = 3400;         // auto-advance interval

// ─── spring preset ────────────────────────────────────────────────────────────
const SPRING = { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.9 };

// ─── helpers ─────────────────────────────────────────────────────────────────
function targetX(idx: number, cw: number) {
  return cw / 2 - PHONE_W / 2 - idx * SLOT;
}

// ─── per-phone animated wrapper ───────────────────────────────────────────────
// Uses a shared displayX motion value + container width to compute
// each phone's rotateY / scale / opacity / z continuously (even during drag).
function CoverPhone({
  index,
  displayX,
  cwMV,
  onClick,
}: {
  index:    number;
  displayX: MotionValue<number>;
  cwMV:     MotionValue<number>;
  onClick:  (index: number) => void;
}) {
  const shot = SCREENSHOTS[index];
  const [loaded, setLoaded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  // distance from viewport centre, in slot-units
  const distSlots = useTransform(
    [displayX, cwMV] as MotionValue<number>[],
    ([x, cw]: number[]) => (x + index * SLOT + PHONE_W / 2 - cw / 2) / SLOT,
  );

  const rotateY = useTransform(distSlots, [-2.5, -1, 0, 1, 2.5], [40, 22,  0, -22, -40]);
  const scale   = useTransform(distSlots, [-2,   -1, 0, 1, 2  ], [0.62, 0.78, 1, 0.78, 0.62]);
  const opacity = useTransform(distSlots, [-2,   -1, 0, 1, 2  ], [0,   0.45, 1, 0.45, 0  ]);
  const zIdx    = useTransform(distSlots, (d) => Math.round(10 - Math.abs(d) * 4));

  return (
    <motion.div
      className="absolute top-0 cursor-pointer select-none"
      style={{
        left:    index * SLOT,
        width:   PHONE_W,
        rotateY,
        scale,
        opacity,
        zIndex:  zIdx,
        transformOrigin: "center center",
      }}
      onClick={() => onClick(index)}
    >
      {/* ── phone shell ── */}
      <div
        className="relative w-full rounded-[2.6rem] bg-base-content"
        style={{
          height: PHONE_H,
          boxShadow:
            "0 28px 56px -8px color-mix(in oklab,var(--color-base-content) 30%,transparent)," +
            "inset 0 0 0 2px color-mix(in oklab,white 12%,transparent)",
        }}
      >
        {/* side buttons */}
        <div className="absolute -left-[5px] top-[20%] w-[5px] h-7  bg-base-content rounded-l-sm opacity-70" />
        <div className="absolute -left-[5px] top-[30%] w-[5px] h-10 bg-base-content rounded-l-sm opacity-70" />
        <div className="absolute -left-[5px] top-[43%] w-[5px] h-10 bg-base-content rounded-l-sm opacity-70" />
        <div className="absolute -right-[5px] top-[28%] w-[5px] h-14 bg-base-content rounded-r-sm opacity-70" />

        {/* screen */}
        <div className="absolute inset-[5px] rounded-[2.2rem] overflow-hidden bg-[#0E0C08]">
          {/* dynamic island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20
                          w-[50px] h-[14px] bg-base-content rounded-full" />

          {!imgErr && (
            <Image
              src={shot.file}
              alt={shot.label}
              fill
              className={`object-cover object-top pointer-events-none select-none
                          transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              onError={() => setImgErr(true)}
              sizes={`${PHONE_W}px`}
              draggable={false}
            />
          )}

          {/* placeholder */}
          {(!loaded || imgErr) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <span className="text-3xl opacity-20">📱</span>
              {imgErr && (
                <p className="text-[9px] text-base-content/25 leading-relaxed break-all">
                  public{shot.file}
                </p>
              )}
            </div>
          )}

          {/* screen glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg,color-mix(in oklab,white 9%,transparent) 0%,transparent 45%)",
            }}
          />
          {/* home bar */}
          <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2
                          w-[68px] h-[4px] bg-base-content/25 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── caption ─────────────────────────────────────────────────────────────────
function Caption({ active }: { active: number }) {
  const shot = SCREENSHOTS[active];
  return (
    <motion.div
      key={active}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="text-center h-11 flex flex-col items-center justify-center"
    >
      <p className="text-sm font-bold text-base-content">{shot.label}</p>
      <p className="text-[11px] text-base-content/50 mt-0.5 max-w-[220px] leading-snug">
        {shot.desc}
      </p>
    </motion.div>
  );
}

// ─── dots ─────────────────────────────────────────────────────────────────────
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
          className="h-2 rounded-full bg-warning"
        />
      ))}
    </div>
  );
}

// ─── main carousel ────────────────────────────────────────────────────────────
export default function PhoneCarousel() {
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Shared motion values
  const displayX = useMotionValue(0);
  const cwMV     = useMotionValue(600);

  // Measure container width and keep cwMV in sync
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => cwMV.set(e.contentRect.width));
    ro.observe(el);
    cwMV.set(el.offsetWidth);
    return () => ro.disconnect();
  }, [cwMV]);

  // Snap displayX to a given index (with spring)
  const snapTo = useCallback(
    (idx: number) => {
      animate(displayX, targetX(idx, cwMV.get()), SPRING);
    },
    [displayX, cwMV],
  );

  // Initialise position
  useEffect(() => { snapTo(0); }, [snapTo]);

  // Navigate
  const goTo = useCallback(
    (idx: number) => {
      const next = ((idx % TOTAL) + TOTAL) % TOTAL;
      setActive(next);
      snapTo(next);
    },
    [snapTo],
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(goNext, AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, goNext]);

  // ── pan handlers (live drag, no spring lag) ──────────────────────────────────
  const baseXRef = useRef(0);

  function onPanStart() {
    setPaused(true);
    baseXRef.current = targetX(active, cwMV.get());
  }

  function onPan(_: unknown, info: PanInfo) {
    // Follow finger 1:1 — no spring during drag
    displayX.set(baseXRef.current + info.offset.x);
  }

  function onPanEnd(_: unknown, info: PanInfo) {
    const flip =
      Math.abs(info.velocity.x) > DRAG_VEL ||
      Math.abs(info.offset.x)   > DRAG_DIST;
    if (flip && info.offset.x < 0) goNext();
    else if (flip && info.offset.x > 0) goPrev();
    else snapTo(active); // snap back
    // resume auto-advance after a pause
    setTimeout(() => setPaused(false), 2000);
  }

  return (
    <div
      className="flex flex-col items-center gap-5 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── viewport ── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: PHONE_H + 8, perspective: "900px" }}
      >
        {/* draggable invisible overlay — captures pan without fighting clicks */}
        <motion.div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
        />

        {/* phones track — positioned absolutely, left=0 */}
        <div className="absolute top-0 left-0 h-full" style={{ width: TOTAL * SLOT }}>
          {SCREENSHOTS.map((_, i) => (
            <CoverPhone
              key={i}
              index={i}
              displayX={displayX}
              cwMV={cwMV}
              onClick={goTo}
            />
          ))}
        </div>

        {/* edge vignette */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none z-20"
          style={{ background: "linear-gradient(to right, var(--color-base-200,#eee) 10%, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 pointer-events-none z-20"
          style={{ background: "linear-gradient(to left, var(--color-base-200,#eee) 10%, transparent)" }}
        />
      </div>

      {/* ── caption ── */}
      <Caption active={active} />

      {/* ── controls ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="btn btn-xs btn-ghost border border-base-content/20 rounded-none w-8 h-8 p-0"
        >
          ←
        </button>
        <Dots active={active} onSelect={goTo} />
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="btn btn-xs btn-ghost border border-base-content/20 rounded-none w-8 h-8 p-0"
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

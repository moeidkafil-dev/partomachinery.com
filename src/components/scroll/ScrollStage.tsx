"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHAPTERS,
  FRAME_COUNT,
  chapterLocalProgress,
  clamp01,
  getActiveChapter,
  progressToFrameIndex,
  progressToTime,
} from "@/lib/shotMap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ScrollStage — the pinned cinematic hero.
 *
 * Media strategy (decision recorded in DECISION_LOG):
 *   Native video seeking was evaluated first; reverse scrubbing over H.264
 *   is non-deterministic in several browsers (decode jumps to nearest
 *   keyframe), so the primary renderer is a canvas frame-sequence built from
 *   the actual footage (120 frames @ 8fps, WebP, ~2.7 MB desktop / 1.4 MB
 *   mobile). A native <video> is used in the Gallery dialog where linear
 *   playback is wanted.
 *
 * Rules honoured here (SCROLL_MOTION_SPEC):
 *   - native scrolling, no wheel hijacking; single rAF loop; full cleanup
 *   - deterministic + reversible: state is a pure function of scroll position
 *   - resize re-measures; reduced motion swaps the pin for a static layout
 *   - poster + honest loading state; graceful poster fallback on failure
 */

const DESKTOP_SCROLL_VH = 520;
const MOBILE_SCROLL_VH = 430;
const DESKTOP_FRAME_BASE = "/media/frames/desktop";
const MOBILE_FRAME_BASE = "/media/frames/mobile";
const POSTER = "/media/posters/hero_poster.jpg";
const SOURCE_DURATION_S = 15.0;

function frameSrc(i: number, base: string): string {
  return `${base}/frame_${String(i).padStart(3, "0")}.webp`;
}

export function ScrollStage() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const metricsRef = useRef({ sectionTop: 0, scrollable: 1 });
  const smoothRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const cancelledRef = useRef(false);
  const activeIdxRef = useRef(0);

  const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const hudLabelRef = useRef<HTMLSpanElement | null>(null);
  const hudTimeRef = useRef<HTMLSpanElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- preload ---------------- */
  const anchorsRef = useRef([0, 30, 60, 90, 119]);

  const preload = useCallback((base: string) => {
    cancelledRef.current = false;
    const anchors = anchorsRef.current;
    const order: number[] = [...anchors];
    for (let i = 0; i < FRAME_COUNT; i++) if (!order.includes(i)) order.push(i);

    let done = 0;
    let failures = 0;
    const map = imagesRef.current;

    const loadOne = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelledRef.current) return resolve();
          map.set(i, img);
          done += 1;
          resolve();
        };
        img.onerror = () => {
          if (cancelledRef.current) return resolve();
          failures += 1;
          done += 1;
          resolve();
        };
        img.src = frameSrc(i, base);
      });

    const CONCURRENCY = 8;
    let cursor = 0;
    const pump = async () => {
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (cursor < order.length) {
          const idx = order[cursor++];
          await loadOne(idx);
          if (cancelledRef.current) return;
          setLoadPct(Math.round((done / order.length) * 100));
          if (anchors.every((a) => map.has(a))) setReady(true);
        }
      });
      await Promise.all(workers);
      if (!cancelledRef.current) {
        setReady(true);
        if (failures > FRAME_COUNT / 3) setFailed(true); // broken sequence -> poster fallback
      }
    };
    void pump();
  }, []);

  /* ---------------- variant select + preload on mount ---------------- */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setVariant(mq.matches ? "mobile" : "desktop");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setReady(false);
    setLoadPct(0);
    drawnFrameRef.current = -1;
    imagesRef.current.clear();
    preload(variant === "mobile" ? MOBILE_FRAME_BASE : DESKTOP_FRAME_BASE);
  }, [variant, preload]);

  /* ---------------- metrics ---------------- */
  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    metricsRef.current.sectionTop = rect.top + window.scrollY;
    metricsRef.current.scrollable = Math.max(1, rect.height - window.innerHeight);
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const t1 = window.setTimeout(measure, 400);
    const t2 = window.setTimeout(measure, 1600); // after fonts/layout settle
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [measure]);

  /* ---------------- canvas drawing ---------------- */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current.get(idx);
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setFailed(true);
      return;
    }
    const render = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const chh = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== cw || canvas.height !== chh) {
        canvas.width = cw;
        canvas.height = chh;
      }
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;
      const scale = Math.max(cw / iw, chh / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (chh - dh) / 2, dw, dh);
      drawnFrameRef.current = idx;
    };
    if (img.complete && img.naturalWidth > 0) {
      render();
    } else {
      img.decode().then(render).catch(() => undefined);
    }
  }, []);

  /* ---------------- rAF loop ---------------- */
  useEffect(() => {
    if (reducedMotion) return; // static layout instead of scrubbing

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = Math.min(0.05, lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0.016);
      lastTsRef.current = ts;

      const { sectionTop, scrollable } = metricsRef.current;
      const target = clamp01((window.scrollY - sectionTop) / scrollable);

      // exponential smoothing; snap when close (deterministic at both ends)
      const k = 1 - Math.exp(-dt * 9);
      const s = smoothRef.current;
      const next = Math.abs(target - s) < 0.00035 ? target : s + (target - s) * k;
      smoothRef.current = next;

      const idx = progressToFrameIndex(next);
      if (idx !== drawnFrameRef.current) drawFrame(idx);

      // chapter overlays (imperative style writes; no React re-render per frame)
      for (let i = 0; i < CHAPTERS.length; i++) {
        const el = chapterRefs.current[i];
        if (!el) continue;
        const ch = CHAPTERS[i];
        const local = chapterLocalProgress(next, ch);
        const span = ch.pEnd - ch.pStart;
        const fadeBand = Math.min(0.14, span / 2);
        const fadeIn = clamp01(local / fadeBand);
        const fadeOut = clamp01((1 - local) / fadeBand);
        const isFirst = i === 0;
        const isLast = i === CHAPTERS.length - 1;
        const vis = isFirst
          ? Math.max(fadeOut, next <= 0.0005 ? 1 : 0)
          : isLast
            ? Math.max(fadeIn, next >= 0.9995 ? 1 : 0)
            : Math.min(fadeIn, fadeOut);
        const rise = (1 - fadeIn) * 26 - (1 - fadeOut) * 26;
        el.style.opacity = vis.toFixed(3);
        el.style.transform = `translate3d(0, ${rise.toFixed(2)}px, 0)`;
        el.style.visibility = vis <= 0.01 ? "hidden" : "visible";
      }

      // HUD
      const active = getActiveChapter(next);
      if (active.index !== activeIdxRef.current) {
        activeIdxRef.current = active.index;
        setActiveIdx(active.index);
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${next.toFixed(4)})`;
      if (hudLabelRef.current)
        hudLabelRef.current.textContent = `${String(active.index).padStart(2, "0")} — ${active.label.toUpperCase()}`;
      if (hudTimeRef.current)
        hudTimeRef.current.textContent = `T+${progressToTime(next).toFixed(1).padStart(4, "0")}S`;
      // scroll hint lives only in the first chapter
      if (scrollHintRef.current)
        scrollHintRef.current.style.opacity = (next < 0.14 ? 1 - next / 0.14 : 0).toFixed(2);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [reducedMotion, drawFrame]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToProgress = useCallback((p: number) => {
    const { sectionTop, scrollable } = metricsRef.current;
    window.scrollTo({ top: sectionTop + p * scrollable, behavior: "smooth" });
  }, []);

  const scrollLenVh = variant === "mobile" ? MOBILE_SCROLL_VH : DESKTOP_SCROLL_VH;

  /* ---------------------------------------------------------------- */
  /* Reduced motion: no pin, static poster, chapters stacked in flow. */
  if (reducedMotion) {
    return (
      <section id="the-line" ref={sectionRef} aria-label="HTE75 line story">
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-24">
          <p className="eyebrow text-muted-foreground">Parto Plastic Machinery</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The line behind the material.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            This is the HTE75 twin-screw compounding and pelletizing line, filmed on the
            factory floor. Motion is disabled because your system prefers reduced motion —
            the full story continues below in plain sections.
          </p>
        </div>
        <div className="relative">
          <img
            src={POSTER}
            alt="Wide view of the HTE75 twin-screw compounding and pelletizing line in a dark production hall"
            className="h-[52vh] w-full object-cover sm:h-[64vh]"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_55%,rgba(0,15,8,0.8)_100%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-14">
          {CHAPTERS.map((ch) => (
            <div key={ch.id} className="mb-10 max-w-2xl">
              <p className="eyebrow text-[#fb3640]">{ch.eyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {ch.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{ch.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  return (
    <section
      id="the-line"
      ref={sectionRef}
      className="relative"
      style={{ height: `${scrollLenVh}vh` }}
      aria-label="HTE75 line cinematic story"
    >
      <div className="sticky top-0 h-screen overflow-hidden grain">
        {/* canvas scrub surface */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            ready && !failed ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* poster / fallback layer */}
        {(!ready || failed) && (
          <img
            src={POSTER}
            alt="Wide view of the HTE75 twin-screw compounding and pelletizing line in a dark production hall"
            className={`absolute inset-0 h-full w-full object-cover ${failed ? "opacity-100" : "opacity-90"}`}
            loading="eager"
          />
        )}

        {/* cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_15%,transparent_50%,rgba(0,15,8,0.72)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(0,15,8,0.85)] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(0,15,8,0.92)] to-transparent" />

        {/* chapter overlays */}
        <div className="absolute inset-0">
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.id}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className={`absolute inset-x-0 ${
                ch.align === "center"
                  ? "bottom-[16vh] mx-auto max-w-3xl px-6 text-center"
                  : ch.align === "right"
                    ? "bottom-[18vh] ml-auto max-w-xl px-6 text-right sm:px-12"
                    : "bottom-[18vh] mr-auto max-w-xl px-6 sm:px-12"
              }`}
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <p className="eyebrow text-glow-dim text-[#ff5560]">{ch.eyebrow}</p>
              <h1
                className={`mt-3 font-display font-semibold tracking-tight text-balance text-glow-dim ${
                  ch.align === "center" ? "text-3xl sm:text-6xl" : "text-3xl sm:text-5xl"
                }`}
              >
                {ch.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#c7d6cf] text-glow-dim sm:text-base">
                {ch.body}
              </p>
              {ch.cta && (
                <div
                  className={`mt-6 flex flex-wrap gap-3 ${
                    ch.align === "right"
                      ? "justify-end"
                      : ch.align === "center"
                        ? "justify-center"
                        : ""
                  }`}
                >
                  <a
                    href={ch.cta.href}
                    className="inline-flex h-11 items-center rounded-md bg-[#fb3640] px-5 text-sm font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
                  >
                    {ch.cta.label}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* loading indicator */}
        {!ready && !failed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[rgba(0,15,8,0.55)]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#fb3640]" aria-hidden="true" />
              <span className="text-xs font-medium tracking-[0.3em] text-[#c7d6cf]">
                LOADING LINE FOOTAGE
              </span>
            </div>
            <div
              className="h-[3px] w-44 overflow-hidden rounded-full bg-[rgba(233,241,237,0.12)]"
              role="progressbar"
              aria-label="Loading line footage"
              aria-valuenow={loadPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#fb3640] transition-[width] duration-200"
                style={{ width: `${loadPct}%` }}
              />
            </div>
          </div>
        )}

        {/* scroll hint */}
        <div
          ref={scrollHintRef}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300"
        >
          <div className="flex flex-col items-center gap-2 opacity-80">
            <span className="text-[10px] font-medium tracking-[0.34em] text-[#9db2a7]">SCROLL</span>
            <div className="h-8 w-[1px] overflow-hidden bg-[rgba(233,241,237,0.16)]">
              <div className="scrolldrip h-3 w-full bg-[#fb3640]" />
            </div>
          </div>
        </div>

        {/* chapter rail (right, desktop) */}
        <nav
          aria-label="Story chapters"
          className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
        >
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollToProgress(ch.pStart + 0.001)}
              aria-label={`Go to chapter: ${ch.label}`}
              aria-current={activeIdx === i ? "true" : undefined}
              className="group flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              <span
                className={`text-[10px] tracking-[0.22em] transition-all ${
                  activeIdx === i
                    ? "text-[#e9f1ed] opacity-100"
                    : "text-[#9db2a7] opacity-0 group-hover:opacity-100"
                }`}
              >
                {ch.label.toUpperCase()}
              </span>
              <span
                className={`block rounded-full transition-all ${
                  activeIdx === i
                    ? "h-2 w-2 bg-[#fb3640]"
                    : "h-[5px] w-[5px] bg-[rgba(233,241,237,0.35)] group-hover:bg-[rgba(233,241,237,0.7)]"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* HUD (bottom-left) */}
        <div className="absolute bottom-6 left-6 z-10 hidden items-center gap-3 sm:flex">
          <span
            ref={hudLabelRef}
            className="font-display text-[11px] tracking-[0.26em] text-[#e9f1ed]"
          >
            00 — ARRIVAL
          </span>
          <span className="h-[1px] w-10 bg-[rgba(233,241,237,0.25)]" />
          <span ref={hudTimeRef} className="font-mono text-[11px] tracking-[0.18em] text-[#9db2a7]">
            T+00.0S
          </span>
        </div>

        {/* scrub progress bar (bottom edge) */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-[rgba(233,241,237,0.08)]">
          <div
            ref={fillRef}
            className="h-full w-full origin-left bg-[#fb3640]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
      <style jsx global>{`
        @keyframes scrolldrip {
          0% {
            transform: translateY(-120%);
          }
          100% {
            transform: translateY(320%);
          }
        }
        .scrolldrip {
          animation: scrolldrip 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scrolldrip {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

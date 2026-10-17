"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSiteUi } from "@/lib/store";

/**
 * PartoBot — procedural support mascot (CHARACTER_INTERACTION_SPEC).
 *
 * The PRD supplies no 3D rig, so this is the spec-sanctioned "layered 2D /
 * procedural alternative":
 *   - eyes follow the pointer within clamped bounds, smoothed, reset on leave
 *   - left click  -> left-eye blink only
 *   - right click -> right-eye blink only; context menu suppressed ONLY here
 *   - Enter/Space/click on the dedicated control opens the support panel
 *   - right-click never opens support; reduced motion disables gaze + idle bob
 */

const GAZE_RADIUS = 260; // px — pointer distance over which gaze saturates
const GAZE_MAX = 3.4; // px — pupil translation clamp

export function PartoBot() {
  const openSupport = useSiteUi((s) => s.openSupport);
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const eyeLRef = useRef<SVGGElement | null>(null);
  const eyeRRef = useRef<SVGGElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const insideRef = useRef(false);
  const [blink, setBlink] = useState<"none" | "left" | "right">("none");
  const blinkTimer = useRef<number | undefined>(undefined);

  const isTouchOnly =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  /* ---- gaze loop ---- */
  useEffect(() => {
    if (reducedMotion || isTouchOnly) return;

    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const sat = Math.min(1, GAZE_RADIUS / dist);
      targetRef.current = { x: (dx / dist) * GAZE_MAX * sat, y: (dy / dist) * GAZE_MAX * sat };
      insideRef.current = true;
    };
    const onLeaveWindow = () => {
      insideRef.current = false;
      targetRef.current = { x: 0, y: 0 };
    };

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const c = currentRef.current;
      const t = targetRef.current;
      const nextX = c.x + (t.x - c.x) * 0.16;
      const nextY = c.y + (t.y - c.y) * 0.16;
      currentRef.current = { x: nextX, y: nextY };
      if (eyeLRef.current) eyeLRef.current.style.transform = `translate(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px)`;
      if (eyeRRef.current) eyeRRef.current.style.transform = `translate(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener("mouseleave", onLeaveWindow);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [reducedMotion, isTouchOnly]);

  /* ---- blink orchestration ---- */
  const triggerBlink = useCallback((side: "left" | "right") => {
    window.clearTimeout(blinkTimer.current);
    setBlink(side);
    blinkTimer.current = window.setTimeout(() => setBlink("none"), 170);
  }, []);

  useEffect(() => () => window.clearTimeout(blinkTimer.current), []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      // Scoped suppression: only inside the character region.
      e.preventDefault();
      triggerBlink("right");
    },
    [triggerBlink]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // right/middle click must not open support
      openSupport();
    },
    [openSupport]
  );

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {/* visual character (decorative) — sits behind the accessible control */}
      <button
        type="button"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        aria-label="Open support"
        title="Open support"
        className={`group relative block h-16 w-16 rounded-full border border-[rgba(233,241,237,0.16)] bg-[#071712] shadow-[0_10px_40px_rgba(0,0,0,0.55)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] hover:scale-[1.04] active:scale-95 ${
          reducedMotion ? "" : "animate-[botfloat_4.5s_ease-in-out_infinite]"
        }`}
      >
        <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute inset-0 h-full w-full">
          {/* head */}
          <rect x="12" y="15" width="40" height="32" rx="10" fill="#0b231b" stroke="rgba(233,241,237,0.28)" />
          {/* visor */}
          <rect x="16.5" y="23" width="31" height="15" rx="7.5" fill="#04100b" stroke="rgba(233,241,237,0.14)" />
          {/* eyes */}
          <g
            ref={eyeLRef}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transition: blink === "left" ? "transform 70ms" : "none",
            }}
          >
            <ellipse
              cx="25.5"
              cy="30.5"
              rx="2.9"
              ry={blink === "left" ? 0.55 : 3.1}
              fill="#e9f1ed"
              style={{ transition: "ry 70ms ease" }}
            />
          </g>
          <g
            ref={eyeRRef}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transition: blink === "right" ? "transform 70ms" : "none",
            }}
          >
            <ellipse
              cx="38.5"
              cy="30.5"
              rx="2.9"
              ry={blink === "right" ? 0.55 : 3.1}
              fill="#e9f1ed"
              style={{ transition: "ry 70ms ease" }}
            />
          </g>
          {/* antenna */}
          <line x1="32" y1="15" x2="32" y2="9" stroke="rgba(233,241,237,0.35)" strokeWidth="1.4" />
          <circle cx="32" cy="7.5" r="2.2" fill="#fb3640" className={reducedMotion ? "" : "bot-pulse"} />
          {/* mouth slot */}
          <rect x="27" y="41" width="10" height="2.4" rx="1.2" fill="rgba(233,241,237,0.25)" />
        </svg>
        <span className="sr-only">Open support</span>
      </button>

      {/* dedicated, redundant accessible control (spec: explicit named control) */}
      <button
        type="button"
        onClick={() => openSupport()}
        className="absolute -left-[132px] bottom-0 hidden h-8 items-center rounded-md border border-[rgba(233,241,237,0.16)] bg-[#071712] px-3 text-xs font-medium text-[#c7d6cf] transition-colors hover:text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] md:inline-flex"
      >
        Open support
      </button>

      <style jsx global>{`
        @keyframes botfloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes botpulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }
        .bot-pulse {
          animation: botpulse 2.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bot-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

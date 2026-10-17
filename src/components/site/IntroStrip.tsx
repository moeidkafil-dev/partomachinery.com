"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDS = [
  "TWIN-SCREW COMPOUNDING",
  "PELLETIZING",
  "LINE ENGINEERING",
  "FACTORY-FLOOR FOOTAGE",
  "HTE75",
];

/**
 * Quiet capability strip between the cinematic hero and the product section.
 * Static under reduced motion; a slow, respectful drift otherwise.
 */
export function IntroStrip() {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[rgba(233,241,237,0.07)] bg-[#020a07] py-5"
    >
      <div
        className={`flex w-max items-center gap-10 whitespace-nowrap px-6 ${
          reduced ? "" : "introdrift"
        }`}
      >
        {[0, 1].map((rep) => (
          <div key={rep} className="flex items-center gap-10">
            {WORDS.map((w) => (
              <span key={`${rep}-${w}`} className="flex items-center gap-10">
                <span className="font-display text-xs font-medium tracking-[0.3em] text-[#5c7168]">
                  {w}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#fb3640]/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes introdrift {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .introdrift {
          animation: introdrift 36s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .introdrift {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

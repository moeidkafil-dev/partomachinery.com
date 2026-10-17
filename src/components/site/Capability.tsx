"use client";

import Image from "next/image";

/**
 * Capability — how a compounding & pelletizing line works, step by step.
 * Descriptions stay at the level of the machine category (twin-screw
 * compounding & pelletizing) and what is visible in the supplied footage —
 * no invented performance claims.
 */

const STEPS = [
  {
    n: "01",
    title: "Feeding",
    body: "Formulated material is dosed into the feed hopper at the head of the line. The footage shows the feeder section and the elevated dosing station above it.",
    src: "/media/gallery/still_feed.jpg",
    alt: "Feed hopper and dosing station of the compounding line — footage still",
    caption: "Feed section — footage still",
  },
  {
    n: "02",
    title: "Compounding",
    body: "Along the twin-screw barrel sections the material is plasticated, mixed and homogenized. Modular barrels let a line be configured for different duties.",
    src: "/media/gallery/still_barrels.jpg",
    alt: "Twin-screw barrel sections and control cabinets — footage still",
    caption: "Barrel sections — footage still",
  },
  {
    n: "03",
    title: "Venting",
    body: "Before discharge, volatiles can be extracted through vent openings in the barrel sequence — visible as the piping and stacks on the upper platform.",
    src: "/media/gallery/render_03.jpg",
    alt: "Upper platform with hoppers and piping of the compounding line — concept render",
    caption: "Platform & venting — concept render",
  },
  {
    n: "04",
    title: "Pelletizing & collection",
    body: "The compound is cut into pellets and carried away on the discharge conveyor, as seen in the opening seconds of the line footage.",
    src: "/media/gallery/still_pellets.jpg",
    alt: "Pellet discharge conveyor in the foreground of the line — footage still",
    caption: "Pellet discharge — footage still",
  },
];

export function Capability() {
  return (
    <section id="capability" className="relative border-t border-[rgba(233,241,237,0.07)] bg-[#03120c]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-[#ff5560]">Capability</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From formulated feed to finished pellets.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#c7d6cf]">
            A compounding and pelletizing line is a chain of stations along one axis. The
            steps below describe that chain as it appears on the HTE75 — in the footage and
            in the supplied line studies.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="group overflow-hidden rounded-xl border border-[rgba(233,241,237,0.1)] bg-[#071712] transition-colors hover:border-[rgba(233,241,237,0.2)]"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={640}
                  height={384}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071712] via-transparent to-transparent" />
                <span className="absolute left-4 top-3 font-display text-2xl font-semibold text-[rgba(233,241,237,0.85)]">
                  {s.n}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9db2a7]">{s.body}</p>
                <p className="mt-3 text-[11px] tracking-[0.14em] text-[#5c7168]">
                  {s.caption.toUpperCase()}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

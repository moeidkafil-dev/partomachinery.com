"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { product } from "@/lib/content";
import { useSiteUi } from "@/lib/store";

/**
 * Machinery — the HTE75 product section. Product data comes exclusively from
 * `content.ts` (FR-015). Specifications with `verified: false` are rendered
 * as "Provided on request" — never as claimed values.
 */
export function Machinery() {
  const openSupport = useSiteUi((s) => s.openSupport);

  return (
    <section id="machinery" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        {/* visual */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl border border-[rgba(233,241,237,0.1)]">
            <Image
              src={product.gallery[1].src}
              alt={product.gallery[1].alt}
              width={1280}
              height={768}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_60%,rgba(0,15,8,0.5)_100%)]" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[rgba(233,241,237,0.16)] bg-[rgba(0,15,8,0.72)] px-3 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fb3640]" aria-hidden="true" />
              <span className="text-[10px] font-medium tracking-[0.22em] text-[#c7d6cf]">
                FOOTAGE STILL — ACTUAL LINE
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {product.gallery.slice(2, 5).map((g) => (
              <div key={g.src} className="overflow-hidden rounded-lg border border-[rgba(233,241,237,0.1)]">
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={480}
                  height={288}
                  className="h-24 w-full object-cover transition-transform duration-500 hover:scale-[1.04] sm:h-28"
                  sizes="200px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* copy */}
        <div>
          <p className="eyebrow text-[#ff5560]">Featured machine</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {product.displayName}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#c7d6cf]">{product.summary}</p>

          <ul className="mt-7 space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f57]" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-[#c7d6cf]">{f}</span>
              </li>
            ))}
          </ul>

          {/* specification request table */}
          <div className="mt-9 overflow-hidden rounded-xl border border-[rgba(233,241,237,0.1)]">
            <div className="flex items-center justify-between border-b border-[rgba(233,241,237,0.1)] bg-[rgba(233,241,237,0.03)] px-5 py-3">
              <h3 className="font-display text-sm font-semibold tracking-[0.12em]">SPECIFICATIONS</h3>
              <span className="text-[10px] tracking-[0.18em] text-muted-foreground">
                CERTIFIED SHEET IN FINAL VERIFICATION
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((s, i) => (
                  <tr
                    key={s.id}
                    className={i % 2 === 0 ? "bg-transparent" : "bg-[rgba(233,241,237,0.02)]"}
                  >
                    <th scope="row" className="px-5 py-3 text-left font-normal text-[#c7d6cf]">
                      {s.label}
                    </th>
                    <td className="px-5 py-3 text-right text-[#9db2a7]">
                      {s.verified ? (
                        `${s.value}${s.unit ? ` ${s.unit}` : ""}`
                      ) : (
                        <span className="italic text-[#7f948b]">{s.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[rgba(233,241,237,0.1)] px-5 py-3 text-xs leading-relaxed text-muted-foreground">
              We publish only data we can verify. Request the certified HTE75 datasheet and
              the team will send confirmed values for your configuration.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openSupport(`HTE75 — datasheet request`)}
              className="inline-flex h-11 items-center rounded-md bg-[#fb3640] px-5 text-sm font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              Request the datasheet
            </button>
            <a
              href="#gallery"
              className="inline-flex h-11 items-center rounded-md border border-[rgba(233,241,237,0.18)] px-5 text-sm font-semibold text-[#e9f1ed] transition-colors hover:border-[rgba(233,241,237,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              See the gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

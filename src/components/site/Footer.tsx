"use client";

import Image from "next/image";
import { company, navLinks } from "@/lib/content";
import { useSiteUi } from "@/lib/store";

export function Footer() {
  const openSupport = useSiteUi((s) => s.openSupport);

  return (
    <footer className="relative mt-auto border-t border-[rgba(233,241,237,0.07)] bg-[#020a07]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src={company.logoSrc}
                alt={company.logoAlt}
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-sm font-semibold tracking-[0.08em]">
                  PARTO PLASTIC
                </span>
                <span className="text-[10px] tracking-[0.34em] text-muted-foreground">
                  MACHINERY
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {company.tagline}. Engineered, filmed and presented from the factory floor.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#9db2a7] transition-colors hover:text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => openSupport()}
              className="text-left text-sm text-[#9db2a7] transition-colors hover:text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              Support
            </button>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[rgba(233,241,237,0.07)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#5c7168]">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-[#5c7168]">
            Product data on this site is shown conservatively: numeric specifications are
            provided on request until the certified datasheet is published. Imagery
            combines real line footage and clearly labeled concept renders.
          </p>
        </div>
      </div>
    </footer>
  );
}

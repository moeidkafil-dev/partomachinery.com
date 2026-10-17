"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { company, navLinks } from "@/lib/content";
import { useSiteUi } from "@/lib/store";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openSupport = useSiteUi((s) => s.openSupport);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-[rgba(233,241,237,0.08)] bg-[rgba(0,15,8,0.82)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fb3640]"
          aria-label="Parto Plastic Machinery — back to top"
        >
          <Image
            src={company.logoSrc}
            alt={company.logoAlt}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-sm font-semibold tracking-[0.08em]">
              PARTO PLASTIC
            </span>
            <span className="text-[10px] tracking-[0.34em] text-muted-foreground">MACHINERY</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium tracking-wide text-[#c7d6cf] transition-colors hover:text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fb3640]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSupport()}
            className="hidden h-9 items-center rounded-md border border-[rgba(233,241,237,0.18)] px-4 text-[13px] font-semibold text-[#e9f1ed] transition-colors hover:border-[rgba(233,241,237,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] sm:inline-flex"
          >
            Support
          </button>
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-md bg-[#fb3640] px-4 text-[13px] font-semibold text-[#160409] transition-colors hover:bg-[#ff4d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
          >
            Request datasheet
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#e9f1ed] transition-colors hover:bg-[rgba(233,241,237,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-[rgba(233,241,237,0.08)] lg:hidden">
          <nav aria-label="Mobile" className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-[#c7d6cf] transition-colors hover:bg-[rgba(233,241,237,0.06)] hover:text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openSupport();
              }}
              className="mt-2 rounded-md border border-[rgba(233,241,237,0.18)] px-3 py-3 text-left text-sm font-semibold text-[#e9f1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
            >
              Open support
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

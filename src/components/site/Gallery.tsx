"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { product } from "@/lib/content";

/**
 * Gallery — supplied concept renders + real footage stills, honestly labeled.
 * Includes the "line, uncut" native-video dialog (user-gesture initiated, so
 * browser autoplay policies are respected; muted + playsInline + controls).
 */
export function Gallery() {
  const reducedMotion = useReducedMotion();
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openVideo = () => {
    setVideoOpen(true);
    window.setTimeout(() => {
      videoRef.current?.play().catch(() => undefined);
    }, 120);
  };

  return (
    <section id="gallery" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-[#ff5560]">Gallery</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            The machine, from every angle.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#c7d6cf]">
            Stills taken from the HTE75 factory footage sit next to supplied concept renders.
            Every image is labeled for what it is — nothing on this page pretends to be a
            photograph.
          </p>
        </div>
        <button
          type="button"
          onClick={openVideo}
          className="group inline-flex h-12 items-center gap-3 rounded-md border border-[rgba(233,241,237,0.18)] px-5 text-sm font-semibold text-[#e9f1ed] transition-colors hover:border-[rgba(233,241,237,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb3640]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fb3640] text-[#160409] transition-transform group-hover:scale-105">
            <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3 fill-current" aria-hidden="true">
              <path d="M2 1l9 5-9 5V1z" />
            </svg>
          </span>
          Play the full clip
          <span className="text-[11px] font-normal tracking-[0.14em] text-muted-foreground">
            0:15
          </span>
        </button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {product.gallery.map((g, i) => (
          <figure
            key={g.src}
            className={`group relative overflow-hidden rounded-xl border border-[rgba(233,241,237,0.1)] ${
              i === 0 ? "col-span-2 row-span-2 lg:col-span-2" : ""
            }`}
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover transition-transform duration-700 ${
                reducedMotion ? "" : "group-hover:scale-[1.03]"
              } ${i === 0 ? "h-full min-h-[260px]" : "h-44 lg:h-52"}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,15,8,0.85)] via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
              <span className="text-xs font-medium text-[#e9f1ed] text-glow-dim">{g.caption}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] ${
                  g.kind === "footage-still"
                    ? "bg-[rgba(251,54,64,0.16)] text-[#ff8a91]"
                    : "bg-[rgba(233,241,237,0.12)] text-[#c7d6cf]"
                }`}
              >
                {g.kind === "footage-still" ? "FOOTAGE" : "RENDER"}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl border-[rgba(233,241,237,0.12)] bg-[#06120e]">
          <DialogTitle className="font-display text-lg">HTE75 line — full clip</DialogTitle>
          <video
            ref={videoRef}
            src="/media/video/hte75_hero_cropped.mp4"
            poster="/media/posters/hero_poster.jpg"
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="mt-3 w-full rounded-lg border border-[rgba(233,241,237,0.1)]"
            aria-label="HTE75 compounding and pelletizing line, fifteen-second factory clip"
          />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            The complete fifteen-second source clip, cropped of the generator watermark.
            The original file remains untouched in the project media archive.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}

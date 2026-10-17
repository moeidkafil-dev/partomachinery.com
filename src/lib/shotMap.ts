/**
 * Shot map — maps normalized scroll progress p ∈ [0,1] onto the actual
 * HTE75 source footage (15.0417 s, 24 fps) and onto chapter overlay state.
 *
 * Chapter time windows below were chosen AFTER inspecting the real clip
 * (contact sheets + frame probes), per VIDEO_INTEGRATION_AND_SCROLL_STORY.md:
 *
 *   t 0.0 – 2.4s   wide establishing view, pellet conveyor in foreground
 *   t 2.4 – 6.3s   dolly travel along barrels + control cabinets
 *   t 6.3 – 9.3s   closest approach: gear side, red status light
 *   t 9.3 – 12.6s  elevated platform / stair / hopper structure
 *   t 12.6 – 15.04s settled wide composition (stable end frame)
 *
 * All functions are pure so they can be unit-tested and shared between the
 * scroll engine and tests.
 */

export const SOURCE_FPS = 24;
export const SOURCE_DURATION = 15.0417;
/** Scrub sequence: 8 fps extraction -> 120 frames, step 0.125 s. */
export const SCRUB_FPS = 8;
export const FRAME_COUNT = 120;
export const FRAME_STEP = 1 / SCRUB_FPS;

export interface Chapter {
  id: string;
  /** Chapter index, used by the HUD/rail. */
  index: number;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Scroll progress window [start, end], start inclusive. */
  pStart: number;
  pEnd: number;
  /** Source time window in the footage [start, end] seconds. */
  tStart: number;
  tEnd: number;
  /** Overlay alignment variant. */
  align: "left" | "center" | "right";
  cta?: { label: string; href: string; kind: "anchor" | "support" | "datasheet" };
}

export const CHAPTERS: Chapter[] = [
  {
    id: "arrival",
    index: 0,
    label: "Arrival",
    eyebrow: "Parto Plastic Machinery",
    title: "The line behind the material.",
    body: "This is the HTE75 twin-screw compounding and pelletizing line — filmed on the factory floor, in one continuous take. Scroll to travel along it.",
    pStart: 0,
    pEnd: 0.16,
    tStart: 0,
    tEnd: 2.4,
    align: "left",
    cta: { label: "Explore the line", href: "#machinery", kind: "anchor" },
  },
  {
    id: "reveal",
    index: 1,
    label: "Reveal",
    eyebrow: "Chapter 01 — Reveal",
    title: "One continuous production axis.",
    body: "From the feed section to pellet discharge, the line reads as a single machine train: feeder, barrel sections, drives and controls arranged along one axis.",
    pStart: 0.16,
    pEnd: 0.42,
    tStart: 2.4,
    tEnd: 6.3,
    align: "left",
  },
  {
    id: "detail",
    index: 2,
    label: "Detail",
    eyebrow: "Chapter 02 — Detail",
    title: "Status you can read at a glance.",
    body: "Line-side control cabinets and stack status lights face the operator aisle. The process stays observable while the screws do the work.",
    pStart: 0.42,
    pEnd: 0.62,
    tStart: 6.3,
    tEnd: 9.3,
    align: "right",
  },
  {
    id: "capability",
    index: 3,
    label: "Capability",
    eyebrow: "Chapter 03 — Capability",
    title: "Feed. Compound. Pelletize.",
    body: "Formulated feed enters through the hopper section, compounds along the twin-screw axis, and leaves as dischargeable pellets — a continuous industrial duty.",
    pStart: 0.62,
    pEnd: 0.85,
    tStart: 9.3,
    tEnd: 12.6,
    align: "right",
  },
  {
    id: "action",
    index: 4,
    label: "Your line",
    eyebrow: "Chapter 04 — Action",
    title: "See it run. Then spec yours.",
    body: "The verified HTE75 datasheet is issued through our team, not guessed on a webpage. Tell us your material and target output — we will answer with numbers we can stand behind.",
    pStart: 0.85,
    pEnd: 1.0001,
    tStart: 12.6,
    tEnd: 15.0,
    align: "center",
    cta: { label: "Request the datasheet", href: "#contact", kind: "datasheet" },
  },
];

export function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

/** Active chapter for progress p (pStart inclusive, pEnd exclusive). */
export function getActiveChapter(p: number): Chapter {
  const c = clamp01(p);
  for (const ch of CHAPTERS) {
    if (c >= ch.pStart && c < ch.pEnd) return ch;
  }
  return CHAPTERS[CHAPTERS.length - 1];
}

/** Chapter-local progress 0..1 (clamped) for overlay animation. */
export function chapterLocalProgress(p: number, ch: Chapter): number {
  return clamp01((p - ch.pStart) / (ch.pEnd - ch.pStart));
}

/**
 * Deterministic monotonic map from scroll progress to source time.
 * Inside a chapter, time advances linearly through that chapter's
 * footage window. Reverse scroll reproduces the exact same time.
 */
export function progressToTime(p: number, chapters: Chapter[] = CHAPTERS): number {
  const c = clamp01(p);
  const ch = getActiveChapter(c);
  const local = chapterLocalProgress(c, ch);
  const found = chapters.find((x) => x.id === ch.id) ?? ch;
  return found.tStart + local * (found.tEnd - found.tStart);
}

export function timeToFrameIndex(t: number): number {
  const idx = Math.floor(t * SCRUB_FPS);
  return Math.min(FRAME_COUNT - 1, Math.max(0, idx));
}

export function progressToFrameIndex(p: number): number {
  return timeToFrameIndex(progressToTime(p));
}

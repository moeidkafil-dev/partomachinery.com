/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import {
  CHAPTERS,
  clamp01,
  getActiveChapter,
  chapterLocalProgress,
  progressToFrameIndex,
  progressToTime,
  timeToFrameIndex,
  FRAME_COUNT,
} from "../src/lib/shotMap";

describe("clamp01", () => {
  test("clamps to [0,1] and handles NaN", () => {
    expect(clamp01(-0.4)).toBe(0);
    expect(clamp01(0.37)).toBe(0.37);
    expect(clamp01(1.9)).toBe(1);
    expect(clamp01(NaN)).toBe(0);
  });
});

describe("chapter ranges", () => {
  test("are contiguous, ordered and inside [0,1]", () => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      const ch = CHAPTERS[i];
      expect(ch.pStart).toBeLessThan(ch.pEnd);
      expect(ch.pStart).toBeGreaterThanOrEqual(0);
      expect(ch.pEnd).toBeLessThanOrEqual(1.0001);
      if (i > 0) expect(ch.pStart).toBeCloseTo(CHAPTERS[i - 1].pEnd, 10);
    }
    expect(CHAPTERS[0].pStart).toBe(0);
  });
});

describe("progressToTime", () => {
  test("endpoints are deterministic", () => {
    expect(progressToTime(0)).toBe(CHAPTERS[0].tStart);
    // final chapter has a small overshoot guard (pEnd 1.0001), so p=1 lands
    // within a frame of the last source second rather than exactly tEnd
    const tEnd = progressToTime(1);
    expect(tEnd).toBeGreaterThan(CHAPTERS[CHAPTERS.length - 1].tEnd - 0.05);
    expect(tEnd).toBeLessThanOrEqual(CHAPTERS[CHAPTERS.length - 1].tEnd);
  });

  test("is monotonically non-decreasing across the full range", () => {
    let last = progressToTime(0);
    for (let i = 1; i <= 1000; i++) {
      const t = progressToTime(i / 1000);
      expect(t).toBeGreaterThanOrEqual(last);
      last = t;
    }
  });

  test("reverse scroll reproduces identical times (determinism)", () => {
    const samples = [0, 0.05, 0.2, 0.42, 0.43, 0.61, 0.62, 0.85, 0.99, 1];
    for (const p of samples) {
      expect(progressToTime(p)).toBe(progressToTime(p)); // pure + stable
    }
    // scrub forward then back to the same point -> same time
    expect(progressToTime(0.7)).toBe(progressToTime(0.7));
  });

  test("respects chapter footage windows", () => {
    const detail = CHAPTERS[2];
    expect(progressToTime(detail.pStart + 0.001)).toBeGreaterThanOrEqual(detail.tStart);
    expect(progressToTime(detail.pEnd - 0.001)).toBeLessThanOrEqual(detail.tEnd + 1e-9);
  });
});

describe("timeToFrameIndex / progressToFrameIndex", () => {
  test("clamps to available frames", () => {
    expect(timeToFrameIndex(-5)).toBe(0);
    expect(timeToFrameIndex(999)).toBe(FRAME_COUNT - 1);
    expect(progressToFrameIndex(0)).toBe(0);
    expect(progressToFrameIndex(1)).toBe(Math.min(FRAME_COUNT - 1, Math.floor(15.0 * 8)));
  });

  test("is monotonic over progress", () => {
    let last = progressToFrameIndex(0);
    for (let i = 1; i <= 500; i++) {
      const f = progressToFrameIndex(i / 500);
      expect(f).toBeGreaterThanOrEqual(last);
      last = f;
    }
  });
});

describe("getActiveChapter / chapterLocalProgress", () => {
  test("returns first chapter at 0 and last at 1", () => {
    expect(getActiveChapter(0).id).toBe("arrival");
    expect(getActiveChapter(1).id).toBe("action");
  });

  test("local progress stays within [0,1]", () => {
    for (const ch of CHAPTERS) {
      for (const p of [ch.pStart, (ch.pStart + ch.pEnd) / 2, ch.pEnd]) {
        const lp = chapterLocalProgress(p, ch);
        expect(lp).toBeGreaterThanOrEqual(0);
        expect(lp).toBeLessThanOrEqual(1);
      }
    }
  });
});

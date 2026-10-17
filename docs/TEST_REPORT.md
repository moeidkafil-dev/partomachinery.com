# Test Report — actual executed commands and outcomes

Environment: Linux sandbox, Node v24.21.0, bun 1.3.14, Next.js 16.1.1 (dev server,
port 3000), Chromium via agent-browser (1440×900 and 390×844 viewports).
All results below were actually executed in this workspace. Nothing is reported
as passed without having run.

## Static checks

| Command | Outcome |
| --- | --- |
| `bun run lint` | ✅ 0 errors, 0 warnings (after fixing 1 `react-hooks` error + 3 unused directives found in the first run) |
| `bunx tsc --noEmit` | ✅ clean (after excluding the sandbox's unrelated `examples/` + `skills/` folders and fixing `bun:test` type refs) |

## Unit tests (`bun test tests/`)

```
19 pass, 0 fail (1597 expect calls)
```

Covers: `clamp01` bounds/NaN; chapter range validity + contiguity; `progressToTime`
monotonicity over 1000 samples; determinism (pure/reversible); footage-window
respects; frame-index clamps + monotonicity; support validation (trim, email,
category enum, message length limits, name limits, optional fields, non-object input).

## API checks (browser-driven, real requests)

| Action | Expected | Actual |
| --- | --- | --- |
| `POST /api/support` (empty form) | field errors, no delivery | ✅ inline accessible field errors shown |
| `POST /api/support` (valid payload, no webhook configured) | `{status:"unconfigured"}` | ✅ honest banner "your message was NOT sent — and we will not pretend it was"; input preserved |
| Server log | request logged | ✅ `POST /api/support 200` |

## Browser QA (agent-browser, Chromium)

| # | Check | Result |
| --- | --- | --- |
| 1 | Home loads, hero canvas draws real footage frames | ✅ screenshot `work/qa_01_hero.png` |
| 2 | Scroll forward 30% / 55% / 95% | ✅ frame + chapter + HUD advance (t+5.6s → t+10.2s → end) |
| 3 | Reverse scroll back to 30% | ✅ deterministic — identical frame/chapter/HUD as forward pass |
| 4 | Chapter rail navigation, HUD timecode, progress bar | ✅ visually verified |
| 5 | Left-click PartoBot opens support | ✅ dialog opens, focus moves to first field |
| 6 | Escape closes dialog | ✅ `[role=dialog]` removed |
| 7 | Right-click on bot: context menu suppressed + right-eye blink only | ✅ `defaultPrevented=true`; right eye ry 3.1→0.55, left eye stays 3.1 |
| 8 | Right-click on header: native menu preserved | ✅ `defaultPrevented=false` |
| 9 | Support form validation (blank submit) | ✅ field-specific errors, non-color indicators |
| 10 | Support form valid submit → unconfigured truth state | ✅ no fake success |
| 11 | Gallery "Play the full clip" dialog | ✅ `<video>` playing real MP4 (`paused:false, readyState:4`) |
| 12 | FAQ keyboard: focus + Enter | ✅ accordion opens (`data-state=open`) |
| 13 | Contact form valid submit → honest unconfigured state | ✅ input preserved |
| 14 | Mobile 390×844: no horizontal overflow (`scrollWidth==clientWidth`) | ✅ |
| 15 | Mobile scrub mid-story + hamburger menu | ✅ |
| 16 | Reduced motion (`?motion=static`): no pin, poster + stacked readable sections | ✅ |
| 17 | Console errors / page errors | ✅ none |
| 18 | Network sweep: all media 200/206 (206 = video range requests, normal) | ✅ |
| 19 | Frame preload priority (anchors 0/30/60/90/119 first) | ✅ confirmed in network log order |
| 20 | Resize behaviour | ✅ layout re-measures; no broken state at 1440↔390 switches |

## Performance observations (measured, not fabricated)

- Desktop frame sequence total transfer: **2.71 MB** (120 WebP); mobile variant **1.36 MB**.
- Hero MP4 derivative: **1.6 MB**, loaded only on demand (gallery dialog, `preload="metadata"`).
- Frame preloading is progressive (8 concurrent, anchor-priority); the scrub works
  as soon as anchors land; the rest fills in the background.
- Single rAF loop for the whole stage; DOM overlay updates are imperative
  (no React re-render per frame); full listener/observer cleanup on unmount.

## Not executed (environment restrictions, reported honestly)

- `bun run build` / `bun run start` — the managed sandbox dev server owns `.next`
  and the platform disables production builds here. Type/lint/unit/browser checks
  substitute in this environment. Run `bun run build` in a normal checkout before deploying.
- WebGL-failure simulation (AT-06): the site uses **no WebGL** anywhere (canvas 2D
  only), so a WebGL failure cannot affect content; the canvas-2D failure path falls
  back to the poster `<img>`.
- Autoplay-with-sound policies: the site never autoplays audio (all video muted).

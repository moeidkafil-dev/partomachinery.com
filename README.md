# Parto Plastic Machinery — Immersive Industrial Website

Production-quality cinematic website for **Parto Plastic Machinery**, centred on the
**HTE75 Twin-Screw Compounding & Pelletizing Line**, built from real factory-floor
footage supplied by the client.

## Quick start

```bash
bun install          # dependencies (lockfile: bun.lock)
bun run dev          # development server on port 3000 (auto-managed in this workspace)
bun run lint         # ESLint (Next.js rules)
bunx tsc --noEmit    # TypeScript strict check
bun test tests/      # unit tests (progress mapping + support validation)
```

Production build in a standard environment:

```bash
bun run build        # next build + standalone output
bun run start        # serve the production build
```

> Note (sandbox environment): the workspace's managed dev server occupies `.next`;
> `bun run build` is disabled by the platform here. Lint, typecheck, unit tests and
> full browser QA were executed instead — see `docs/TEST_REPORT.md`.

## What is inside

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Page composition (single cinematic route) |
| `src/app/api/support/route.ts` | Support/inquiry endpoint (typed, server-validated) |
| `src/components/scroll/ScrollStage.tsx` | Pinned scroll-driven frame-sequence hero |
| `src/components/character/PartoBot.tsx` | Procedural mascot: gaze, left/right blinks, support trigger |
| `src/components/support/SupportPanel.tsx` | Accessible support dialog with honest state machine |
| `src/lib/content.ts` | **Central content source** — edit copy/product data here |
| `src/lib/shotMap.ts` | Chapter/progress/time mapping (pure, unit-tested) |
| `src/lib/supportValidation.ts` | Shared zod validation + typed API client |
| `media/` | Source media archive (originals never modified) |
| `public/media/` | Web derivatives (frames, video, posters, logo) |
| `scripts/media_pipeline.sh` | Regenerates all derivatives from source media |
| `scripts/process_logo.py` | Transparent logo/favicon derivatives |
| `docs/` | Shot map, test report, media guide, PRD archive |

## The scroll experience

The hero pins for ~520vh of native scroll (no wheel hijacking). Scroll progress maps
deterministically onto the 15.04s source clip through a 120-frame WebP sequence
(8 fps extraction, ~2.7 MB desktop / 1.4 MB mobile). Reverse scroll reverses the
scene exactly — state is a pure function of scroll position. Chapters: Arrival →
Reveal → Detail → Capability → Your line, each mapped to inspected footage windows
(see `docs/SHOT_MAP.md`).

Fallbacks: poster while loading → progressive frame preload → canvas scrub.
Reduced motion (`prefers-reduced-motion` or `?motion=static`) replaces the pin with
a static poster and stacked chapters.

## Support / inquiry truth policy

`POST /api/support` always answers truthfully:

- No `SUPPORT_WEBHOOK_URL` configured (default): `{status:"unconfigured"}` — the UI
  explicitly says the message was **not** sent. No fake success, no invented ticket IDs.
- With `SUPPORT_WEBHOOK_URL` set (server-side env only), the validated payload is
  forwarded; `accepted` is shown only on a real 2xx from that endpoint.

## Editing content

All public copy, product fields, FAQ and nav live in `src/lib/content.ts`.
Product specifications carry `verified: false` until the certified datasheet exists;
unverified rows render as "Provided on request" — never as claimed values.

## Media workflow

See `MEDIA_GUIDE.md` (root) for uploading replacement videos and regenerating all
assets with one command. Originals in `media/` are never modified by the pipeline.

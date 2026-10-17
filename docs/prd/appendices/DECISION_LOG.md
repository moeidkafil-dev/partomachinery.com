# Decision Log — Parto Plastic Machinery website

Entries appended by the implementing agent. Statuses are factual, not aspirational.

---

## D-01 — Framework / build system

- **Context**: Empty workspace (no existing site source in the PRD archive). PRD
  suggests React+TS+Vite as a candidate; sandbox provides a managed Next.js 16 +
  TypeScript + Tailwind 4 + shadcn/ui environment.
- **Choice**: Next.js 16 App Router (established sandbox stack, bun lockfile).
- **Rationale**: The archive contains no code to preserve; using the environment's
  maintained stack avoids migrations and gives SSR shell + typed API routes.
- **Trade-offs**: Dev-server-only in this sandbox (platform blocks `next build`);
  production build must be run in a normal checkout.
- **Verification**: lint/tsc/tests/browser QA executed (see `docs/TEST_REPORT.md`).

## D-02 — Media strategy for the cinematic hero

- **Context**: One real 15.04s clip (640×432@24, no audio). PRD requires
  deterministic, reversible, native-scroll scrubbing; prefers native video seeking
  if smooth enough.
- **Options**: (a) native `<video>` seek mapping; (b) canvas frame sequence;
  (c) WebGL/Three.js 3D scene.
- **Choice**: **(b) canvas frame sequence** — 120 WebP frames (8 fps extraction),
  cover-fit on `<canvas>`, exponential-smoothing rAF loop.
- **Rationale**: H.264 reverse seeking is keyframe-quantised and non-deterministic
  across browsers; a 360p source makes frames tiny (~23 KB each), so the sequence
  (2.7 MB desktop / 1.4 MB mobile) is comparable to the video itself while giving
  exact forward/reverse scrubbing, no buffering stalls, no autoplay restrictions,
  and a trivial poster fallback. WebGL (c) was rejected: no 3D model asset exists
  and fabricating machine geometry is forbidden.
- **Native video kept** for linear playback (gallery dialog, muted, user-gesture).
- **Verification**: forward/backward scrub browser-tested; determinism unit-tested.

## D-03 — Watermark handling

- **Context**: Source clip carries an intermittent top-right generator watermark.
- **Choice**: Crop top 48 px on all derivatives (640×432 → 640×384); originals untouched.
- **Verification**: crop checked against multiple frames (0 s, 4.5 s) — watermark
  gone, machine fully in frame.

## D-04 — Scroll architecture

- **Choice**: One section with `height: 520vh (desktop) / 430vh (mobile)` +
  `position: sticky` stage; progress = pure function of `scrollY` (no wheel
  hijacking, no scroll libraries). One rAF loop owns canvas + overlay/HUD writes;
  full cleanup on unmount; re-measure on resize/orientation + delayed settle.
- **Reduced motion**: replaces the pin entirely with poster + stacked chapters;
  `?motion=static` forces the same path for QA.

## D-05 — Character implementation

- **Context**: No 3D rig supplied. CHARACTER_INTERACTION_SPEC allows a layered
  2D/procedural alternative.
- **Choice**: Procedural SVG bot: pointer gaze (clamped ±3.4 px, smoothed, reset on
  leave, disabled on touch-only + reduced motion), left-click → left blink,
  right-click → right blink with context-menu suppression scoped to the control,
  dedicated accessible activation (Enter/Space/click) opening support.
- **Verification**: browser-tested eye-state transitions and context-menu scoping.

## D-06 — Support endpoint truth policy

- **Choice**: `/api/support` validates server-side (zod, shared schema with the
  client) and returns `unconfigured` unless `SUPPORT_WEBHOOK_URL` is set. The UI
  states plainly that nothing was sent. No invented ticket IDs, no fake success.
- **Verification**: real browser submissions exercised; banner text verified.

## D-07 — Content truth policy

- **Choice**: Company name/tagline taken only from the supplied logo ("MACHINERY /
  PARTO PLASTIC"); product identity from the PRD package (HTE75 twin-screw
  compounding & pelletizing line). All numeric specs render as "Provided on
  request" (`verified: false`) until the certified datasheet exists. Gallery images
  are labeled "FOOTAGE" vs "RENDER". No invented certifications, customers, history.

## D-08 — Visual system

- **Palette**: `#000F08` base, `#E9F1ED` text (≈16:1), `#9DB2A7` muted (≈7.4:1),
  `#FB3640` accent reserved for status/CTAs (≈5.2:1 — large text/UI only;
  button text `#160409` on `#FB3640` ≈5.3:1, AA-passing).
- **Typography**: Space Grotesk (display) + Inter (body) via `next/font`.
- **Motion**: 200–700 ms transitions, single-loop scrub, `prefers-reduced-motion`
  respected globally.

# Shot Map — HTE75 source footage → scroll chapters

## Source inspection (verified with ffprobe + contact sheets)

| Property | Value |
| --- | --- |
| File | `PixVerse_Pixverse-c1_Image_Text_360P_Create_a_.mp4` (identical MD5 in `reference_videos/` and `videos_to_upload/`) |
| Duration | 15.041667 s |
| Resolution | 640×432 (cropped to 640×384 for derivatives — top 48 px removes the intermittent generator watermark) |
| Frame rate | 24 fps (361 frames), progressive |
| Codec | H.264 High, yuv420p, bt709 |
| Audio | none |
| Content | One continuous slow dolly along the twin-screw compounding line in a dark hall: wide view with pellet conveyor → travel along barrels + control cabinets → closest approach (gear side, red status lights) → elevated platform/stairs/hopper → settled wide composition |

**Honesty note:** the "previous" and "new" supplied videos are byte-identical
(same MD5 `db29e18137ad71d4c96d2476169c5103`). The site is therefore built around
one unique clip; a second, distinct clip can be added via `media/videos_to_upload/`
(see MEDIA_GUIDE.md) and slotted into the chapter table below.

## Chapter table (implemented in `src/lib/shotMap.ts`)

| Chapter | Scroll p | Footage window | What is on screen (verified) | Overlay |
| --- | --- | --- | --- | --- |
| C0 Arrival | 0.00–0.16 | t 0.0–2.4 s | Wide establishing view; pellet conveyor in foreground | Proposition + "Explore the line" |
| C1 Reveal | 0.16–0.42 | t 2.4–6.3 s | Dolly travel: barrels, control cabinets, drives | "One continuous production axis." |
| C2 Detail | 0.42–0.62 | t 6.3–9.3 s | Closest approach: gear side, red stack lights | "Status you can read at a glance." |
| C3 Capability | 0.62–0.85 | t 9.3–12.6 s | Elevated platform, stairs, hopper structure | "Feed. Compound. Pelletize." |
| C4 Your line | 0.85–1.00 | t 12.6–15.0 s | Settled wide composition (stable end frame) | CTA "Request the datasheet" |

Mapping is piecewise-linear and monotonic; reverse scroll reproduces identical
frames (unit-tested; browser-verified forward and backward).

## Derivatives

| Asset | Spec | Size |
| --- | --- | --- |
| `public/media/frames/desktop/frame_000–119.webp` | 640×384, 8 fps steps (0.125 s), q78 | 2.71 MB total |
| `public/media/frames/mobile/frame_000–119.webp` | 416×250, q70 | 1.36 MB total |
| `public/media/video/hte75_hero_cropped.mp4` | H.264 CRF21, faststart, 640×384, 15.04 s | 1.6 MB |
| `public/media/posters/hero_poster.jpg` | frame t=0, q2 | 86 KB |
| `public/media/posters/og_image.jpg` | 1200×720 | — |

Frame n corresponds to source time `n × 0.125 s`.

## Sections deliberately NOT used / notes

- No camera-morph transitions were invented — the source is one continuous take,
  so chapter boundaries are simple progress windows (no geometry morphing risk).
- The PixVerse watermark is removed by the top-48px crop on all derivatives; the
  original file remains untouched.
- If a second clip is supplied later, prefer an intentional hard cut at a chapter
  boundary (per VIDEO_INTEGRATION_AND_SCROLL_STORY.md) rather than a forced blend.

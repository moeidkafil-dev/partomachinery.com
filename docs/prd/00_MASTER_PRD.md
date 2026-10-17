# Master PRD — Immersive Industrial Machinery Website

## Product summary
Build a premium, original, complete website for an industrial company focused on extrusion/plastic-processing machinery. Its signature experience is a cinematic scroll-controlled 3D narrative inspired by the interaction quality of Organimo, paired with credible product discovery, technical content, and a virtual character that opens support. It is not just a landing hero.

## Goals
- Communicate industrial purpose in the first meaningful viewport.
- Make scroll feel like progress through one continuous, carefully art-directed sequence.
- Present machine categories and verified specs clearly.
- Provide support/contact journeys and conventional navigation.
- Deliver maintainable code, responsive behavior, graceful fallbacks, and actual QA.

## Non-goals
- Exact cloning of Organimo or copying its assets, branding, copy, or proprietary models.
- Inventing specifications, certifications, customer logos, history, or performance claims.
- Building a full CRM unless a real backend is supplied.
- Requiring 3D to access key content.

## Users
1. Technical buyer: discovers machines, evaluates fit, requests information.
2. Engineer: checks specifications, applications, documents, and support.
3. Existing customer: opens support and submits a request.
4. Mobile visitor: accesses the same core content without hover or high-end GPU.

## Product principles
- Motion serves comprehension.
- Native scrolling remains in control.
- Scene state is deterministic and reversible.
- All core content survives WebGL failure and reduced motion.
- Unknown company/product facts remain explicitly unknown.
- Heavy assets load progressively; performance is measured, not fabricated.
- No inert controls.

## Information architecture
Home/cinematic introduction; machinery portfolio; category/product detail; applications; engineering/company; services/support; FAQ; contact/inquiry; footer. Use routes or sections based on real user journeys, but all navigation must work.

## Required features
### F-01 Full website shell
Responsive header, mobile navigation, footer, product/category navigation, company/services content, FAQ, contact and functional CTAs.

### F-02 Scroll-driven cinematic scene
Progress-linked camera, object, environment and text transitions; chapter boundaries; reverse scroll; resize handling; no scroll hijacking; loading and WebGL fallback; mobile and reduced-motion modes.

### F-03 Product experience
Data-driven catalog and specs, optional GLB/glTF viewer, sensible camera framing, optional drag/rotate/reset, honest missing-model fallback, inquiry CTA with product context.

### F-04 Character
Eyes follow pointer within safe bounds; left click blinks left eye; right click blinks right eye; support activation via explicit accessible control/tap/keyboard; context menu suppressed only inside character region; neutral fallback if rig assets are absent.

### F-05 Support panel
Accessible dialog/drawer; open/close/Escape; focus handling; required-field validation; loading/success/failure/unconfigured states. “Success” is allowed only after a real endpoint confirms acceptance.

### F-06 Content
Product categories, verified specifications, company/services/FAQ/contact; central content data; placeholders cannot be presented as verified facts.

### F-07 Accessibility and resilience
Semantic HTML, visible keyboard focus, reduced motion, touch-friendly controls, useful non-WebGL path, no hover-only information.

## Narrative baseline
1. Arrival: establish identity and proposition.
2. Reveal: make machine form legible.
3. Detail: focus on a verified feature.
4. Capability: connect machine to process.
5. Portfolio: introduce categories.
6. Engineering/service: verified facts only.
7. Action: inquiry/support.

These are narrative roles, not a requirement to fabricate product geometry. Use a replaceable scene adapter if assets are missing.

## Art direction
Initial colors: `#000F08` and `#FB3640`; test actual text/background contrast and add supporting neutrals. Use precise typography, purposeful negative space, tactile lighting, disciplined accent color, and a coherent spacing/motion system. Avoid generic SaaS templates, random parallax, excessive glassmorphism, and motion that hides text.

## Data truth policy
Company/product facts must live in a central content source. Use explicit placeholders such as `[COMPANY_NAME]`, `[PRODUCT_NAME]`, `[VERIFIED_SPEC_REQUIRED]`. Draft/unverified specifications must not be shown as factual public claims.

## Success criteria
- Industrial focus is clear quickly.
- Scene transitions work down and up without jumps.
- Product facts remain available outside the 3D canvas.
- Character event behavior matches specification.
- Support outcome reflects actual backend status.
- Desktop/tablet/mobile and reduced motion work.
- Build/type/lint/tests pass where configured and results are reported honestly.
- No critical console errors or dead controls.

## Inputs still needed
Official company identity/logo; real product list/specifications; machine and character assets/licenses; approved contact details; support endpoint; languages/RTL needs; deployment target. Build reversible interfaces rather than blocking on missing optional inputs.

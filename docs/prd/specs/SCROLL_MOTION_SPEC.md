# Scroll Motion Specification

## Model
Normalize narrative progress to `p ∈ [0,1]`. Scene state must be reproducible from the current scroll position, independent of scroll direction/history. GSAP ScrollTrigger or an existing equivalent may be used where appropriate.

## Each chapter must define
`id`, start/end progress, purpose, camera position/target, object transforms, environment/background, lighting/material, DOM content/CTA, easing, responsive variant, reduced-motion behavior, fallback, and asset dependencies.

## Motion rules
- Native scroll remains in control; no wheel hijacking.
- Reverse scroll returns to prior states without jumps.
- Pinning is selective and tested on mobile.
- Avoid abrupt camera roll/FOV changes and transitions that obscure the machine.
- Keep text contrast stable while backgrounds change.
- Use one coordinated scene timeline/controller, clean up on unmount, recalculate after resize.
- Reduced motion should switch to a simpler linear/static presentation, not just shorten every animation.

## Choose media strategy based on actual assets
Real-time 3D if suitable model/materials exist; image sequence if art direction and optimized frames justify it; hybrid if it is measurably better. Do not assume video/frame assets were supplied. Record decision and trade-offs.

## Loading/failure
Show meaningful DOM content immediately, use poster while model loads, load chapter assets progressively, show progress only if measurable, and preserve all navigation/content after asset or WebGL failure.

## QA
Test slow/fast scroll, repeated reverse direction at every chapter boundary, scrollbar jumps, deep-link/reload, resize mid-scene, mobile, reduced motion, WebGL failure, and text readability.

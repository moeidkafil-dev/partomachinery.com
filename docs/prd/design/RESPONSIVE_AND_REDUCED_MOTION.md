# Responsive and Reduced Motion

Test narrow mobile (~320–390 CSS px), larger mobile, tablet, desktop, and wide screens. Treat values as test targets, not device assumptions.

Mobile: reframe camera rather than shrink desktop composition; no hover-only information; touch-friendly controls; reduce quality only when justified; avoid long pinned sequences; static poster is acceptable if full scene is unstable.

With `prefers-reduced-motion: reduce`: remove/simplify scroll-linked camera travel, disable continuous idle/auto-rotation, use short/immediate transitions, restore normal content flow, and do not require a pinned scene to reach content.

All essential content is semantic DOM. Maintain visible focus, correct heading order, text resizing, keyboard access, and an equivalent path to every product fact/support action.

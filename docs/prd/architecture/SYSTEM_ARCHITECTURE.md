# System Architecture

Use a modular frontend architecture. React + TypeScript + Vite or an equivalent stack is a candidate, not an excuse to replace an existing working project without reason.

Suggested modules:
- `app/`: entry, routing, providers, error boundaries
- `components/layout/`: header, footer, navigation
- `components/ui/`: buttons, fields, dialog, loading
- `features/scene/`: controller, chapter config, timeline, fallback
- `features/products/`: catalog, detail, specs, viewer
- `features/character/`: gaze/blink/controller
- `features/support/`: panel, validation, API client, state machine
- `content/`: products, company, FAQ, nav
- `config/`: public configuration and flags
- `assets/`: licensed models, images, fonts
- `tests/`: unit/component/integration/e2e where available

One scene controller owns renderer/canvas, camera, scene graph, loading/disposal, scroll integration, resize, reduced-motion, and quality policy. Avoid duplicate render loops. Use semantic DOM for text/forms/specs; canvas is visual enhancement only.

Product catalog, scene progress, character state, and support state have clear boundaries. Errors should degrade locally: scene failure must not crash product content; support failure must preserve input. Review every dependency for overlap, maintenance, and necessity.

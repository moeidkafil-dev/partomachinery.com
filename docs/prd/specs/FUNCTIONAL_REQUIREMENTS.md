# Functional and Non-functional Requirements

| ID | Priority | Requirement | Evidence |
|---|---|---|---|
| FR-001 | P0 | App starts from documented commands | Fresh run succeeds |
| FR-002 | P0 | Navigation reaches real destinations | Pointer and keyboard work |
| FR-003 | P0 | Scroll progress deterministically drives scene | Down/up states match |
| FR-004 | P0 | Useful content exists without WebGL | Forced fallback works |
| FR-005 | P0 | Eye gaze follows pointer within clamps | No inversion/jitter |
| FR-006 | P0 | Left click triggers left blink | Isolated reproducible blink |
| FR-007 | P0 | Right click triggers right blink | Isolated reproducible blink |
| FR-008 | P0 | Accessible character activation opens support | Mouse/touch/keyboard |
| FR-009 | P0 | Context-menu suppression is scoped | Native menu elsewhere |
| FR-010 | P0 | Support form validates required data | Field errors shown |
| FR-011 | P0 | Support state reflects real backend | No false success |
| FR-012 | P0 | Responsive layout has no critical overflow | Mobile QA |
| FR-013 | P0 | Reduced motion offers coherent content flow | No forced cinematic pin |
| FR-014 | P0 | Keyboard focus and Escape behavior work | Keyboard test |
| FR-015 | P0 | Product data is separate from visual components | Edit data without component changes |
| FR-016 | P0 | Missing model has fallback | No fatal exception |
| FR-017 | P0 | Heavy asset loading has a usable state | Content visible during load |
| FR-018 | P0 | All CTAs have meaningful behavior | No dead controls |
| FR-019 | P1 | Viewer supports drag rotation | Mouse/touch |
| FR-020 | P1 | Viewer can reset framing | Reset returns to default |
| FR-021 | P1 | FAQ works by keyboard | Expanded state announced |
| FR-022 | P1 | Inquiry can include selected product | Context passed safely |
| FR-023 | P1 | Quality adapts to device constraints | Documented policy |
| FR-024 | P1 | Content is localization-ready | Copy separated from layout |

NFR: typed maintainable modules; no client secrets; server-side validation if backend exists; semantic accessibility; modern browser support with fallback; no unnecessary personal-data collection; no fabricated facts or test results.

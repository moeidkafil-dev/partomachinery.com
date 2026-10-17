# Test Strategy

Layers: static checks; unit tests for progress mapping, validation and state transitions; component tests for navigation/dialog/forms; integration tests for scene lifecycle and support states; browser journeys where tooling exists; manual visual QA.

Unit cases: progress clamps to [0,1]; chapter ranges are valid; support handles blank/whitespace/invalid email/length limits; unverified product facts are hidden or marked; gaze is clamped; invalid state transitions fail safely.

Browser smoke: home loads; nav works; products/specs/FAQ work; support opens/closes and restores focus; character keyboard activation opens support; context-menu scope is correct; scene reverses; resize mid-scene is safe; reduced-motion and WebGL fallback work; all CTAs have behavior; no critical console/network failures.

For each check record command/action, environment, expected/actual result, status, issue and fix. Never report unrun tests as passed.

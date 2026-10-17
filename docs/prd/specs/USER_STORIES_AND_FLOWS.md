# User Stories and Flows

1. First-time visitor understands industrial focus immediately; if 3D is delayed, poster and text appear first.
2. Visitor scrolls through coherent chapters; reversing scroll returns to matching prior states.
3. Buyer selects a product, reads verified specs, and opens inquiry; missing model does not hide specs.
4. Existing customer opens support from character or navigation and receives truthful submission status.
5. Character tracks pointer and responds to left/right clicks without breaking normal context menus elsewhere.
6. Mobile visitor accesses every core feature without hover.
7. Reduced-motion visitor gets a clear, non-cinematic content flow.

Support states: CLOSED → OPEN → VALIDATING → SUBMITTING → SUCCESS. Validation returns to OPEN with errors; request failure becomes FAILURE; no configured endpoint becomes UNCONFIGURED. SUCCESS must never be client-invented.

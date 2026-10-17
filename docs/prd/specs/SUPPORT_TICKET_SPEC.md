# Support / Ticket Panel

## Entry points
Character control, navigation support link, and optionally product inquiry CTA with product context.

## Dialog behavior
Move focus into panel on open; restore focus on close; Escape closes safely; modal background is not keyboard-interactive; backdrop behavior is consistent; panel fits short screens and software keyboards; avoid irreversible scroll-lock bugs.

## Fields
Required: full name, email/approved reply channel, category, message. Optional: company, product/model, reference number only if actually used. Attachments only if secure upload is implemented. Do not request unnecessary sensitive data.

## Validation
Trim whitespace; enforce sensible length limits; validate email reasonably; show field-specific errors and overall status; preserve valid input after recoverable failure; never use color alone.

## State machine
CLOSED → OPEN → VALIDATING → SUBMITTING → SUCCESS | FAILURE | UNCONFIGURED.
SUCCESS requires an actual positive backend response. UNCONFIGURED explains that online submission is inactive and shows only approved contact alternatives. Never invent ticket IDs.

## API boundary
Use a typed service independent of UI. Distinguish accepted, validation rejection, rate limit, server/network failure, and unconfigured endpoint. Server-side validation, rate limiting, spam controls, privacy retention, and safe logging are required before public deployment.

## QA
Dialog semantics/title, focus trap if modal, Escape, tab order, screen-reader status, invalid form, slow request, server rejection, endpoint absent, and actual accepted response.

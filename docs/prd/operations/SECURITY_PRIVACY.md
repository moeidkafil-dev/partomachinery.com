# Security and Privacy

Frontend: no private keys in client bundles; safe env separation; do not inject user input as HTML; validate external URLs; avoid unjustified third-party scripts; minimize/review dependencies.

If backend exists: server-side validation, request/field limits, rate limiting, spam protection, structured errors without stack traces, minimal personal-data logging, defined retention/deletion policy, HTTPS, server-only credentials. Uploads require secure storage, validation, limits and malware considerations.

Default to no analytics/tracking unless explicitly configured. Request only data needed for support. Privacy/legal text must be based on approved policy. Local/demo mode must clearly disclose when submissions are not sent.

Exclude `.env` and credentials from version control; provide safe `.env.example`; scan for secrets before release.

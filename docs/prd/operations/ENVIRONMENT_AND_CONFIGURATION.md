# Environment and Configuration

Public config may contain non-secret display settings, locale, asset paths and feature flags. Private credentials remain server-side. Never overwrite an existing `.env`; use `.env.example` with safe placeholders.

Optional missing 3D assets or support endpoint must not prevent app startup. Missing production-critical configuration should generate a clear diagnostic, not silent failure or false success.

Suggested public config: company name, logo, product data source, asset base path, default locale, 3D feature flag. Suggested private server config only if backend exists: support/email credentials, spam controls, database credentials, signing secrets.

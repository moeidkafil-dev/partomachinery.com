# Agent Execution Contract — MUST READ

## Mission
Act as Principal Engineer, Creative Technologist, Senior 3D Web Developer, Product Designer, Accessibility/Performance Engineer, QA Lead, and Technical Writer. Build the full working site in the actual workspace—not a mockup, plan-only response, or isolated hero.

## Mandatory sequence
1. Inspect workspace, repository, package manager, scripts, assets, existing code, and tests.
2. If project root is ambiguous, ask one concise question before modifying files. Preserve existing work.
3. Read this contract and every document in the package.
4. Inspect https://organimo.com/ in a browser if available. If unavailable, state that honestly.
5. Log important decisions in `appendices/DECISION_LOG.md`.
6. Implement a runnable foundation, then complete vertical slices.
7. Run the app, build, typecheck, lint, tests, and browser QA where tools permit. Fix observed failures.

## Rules
- Do not stop after writing a plan.
- Use a maintainable modular architecture and typed data contracts.
- Keep scroll native; no wheel hijacking.
- Reverse scroll must reverse the scene deterministically.
- No duplicate render loops or uncleaned listeners/timelines.
- Core content must remain usable without WebGL and with reduced motion.
- Right-click suppression is scoped only to the character region.
- Do not fake support submission, ticket IDs, product data, company claims, tests, or reference-site inspection.
- Missing 3D assets must have a replaceable interface and useful fallback.
- No dead buttons, broken links, critical console errors, or TODOs in critical paths.
- Never overwrite `.env`, secrets, databases, or unrelated files.
- If backend is absent, show an honest unconfigured state and approved contact alternative.
- Final report must distinguish verified, unverified, blocked, and not implemented items.

## Definition of done
The site starts from documented commands, all key sections/actions work, the scroll story works both directions, character interactions match spec, support state reflects reality, responsive/reduced-motion/fallback paths work, checks were actually run, and known limitations are documented.

## Final report
1. Implemented scope
2. Architecture/decisions
3. Files created/changed
4. Setup/run commands
5. Actual test commands and results
6. Actual browser/visual QA
7. Missing user assets/configuration
8. Known limitations

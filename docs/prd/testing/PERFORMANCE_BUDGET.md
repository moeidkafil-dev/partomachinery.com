# Performance Budget and Measurement

Do not fabricate numeric performance claims. Measure initial HTML/CSS/JS, largest chunks, model/texture/sequence downloads, first meaningful content under repeatable conditions, long tasks, layout shift, scene frame pacing and memory where tools permit.

Rules: show useful DOM before optional 3D; lazy-load models and later chapters; do not download every model initially; compress textures; cap device pixel ratio when appropriate; avoid unnecessary post-processing; dispose GPU resources/listeners; prefer static fallback over unstable rendering.

Report device/browser, network, build mode, tool, transfer sizes, largest asset, scene behavior, errors and before/after evidence.

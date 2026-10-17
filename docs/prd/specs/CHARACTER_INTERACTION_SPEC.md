# Virtual Character Interaction Specification

## Asset/rig
Preferred 3D asset has separate left/right eye controls and independent eyelid/blink controls, known scale/orientation, optimized textures and documented license. If the rig cannot support independent blinks, do not claim it does; use a layered 2D/procedural alternative or document the limitation.

## Gaze
Map pointer position relative to character bounds to normalized coordinates; clamp yaw/pitch; smooth with time-based interpolation; return to neutral on pointer leave; reduce/disable motion under reduced-motion; use neutral gaze on touch-only devices unless touch tracking is intentional.

## Event contract
- Left mouse button on character: left-eye blink.
- Right mouse button on character: right-eye blink and suppress context menu only inside that region.
- Normal click/tap/keyboard activation of the dedicated accessible support control: open support.
- A right-click used for blinking must not accidentally open support.
- Provide an explicit accessible control named “Open support”.
- Do not disable context menus globally or long-press on touch devices.

## States
IDLE, TRACKING, BLINK_LEFT, BLINK_RIGHT, SUPPORT_OPEN, REDUCED_MOTION, FALLBACK. Transitions must not leave eyelids closed or transforms invalid.

## Tests
Right-click character suppresses menu; right-click header/product text/background preserves native menu. Enter/Space opens support. Pointer leave resets gaze. Missing rig does not break support access.

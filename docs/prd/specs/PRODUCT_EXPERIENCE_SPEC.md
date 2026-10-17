# Product Discovery and 3D Presentation

Product data: id, slug, name, category, summary, verified applications/features, specifications with units, model/poster paths, gallery, documentation, inquiry subject, publication status.

Viewer: sensible initial framing, optional drag-to-rotate with touch support, optional controlled zoom, reset view, loading/failure state, poster fallback, reduced-motion/low-power support. Auto-rotation is optional and must stop on interaction and respect reduced motion.

Do not let the viewer replace technical information. Essential facts and CTAs remain in semantic DOM and work with keyboard. Hide empty specs; never show unverified values as factual.

Asset pipeline: prefer GLB/glTF; record source/license, scale/orientation, geometry/material/texture cost, compression, expected memory, fallback poster and attribution. Hotspots are optional and only allowed with verified positions and explanatory copy.

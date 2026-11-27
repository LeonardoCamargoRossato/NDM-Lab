# NDM Lab V1.1 — release in progress

Branch: feat/ndm-lab-v1-1-visual-navigation. Base: 98e6099fb850aecf8e577abf37d80cb73addca98.

Implemented in development: scientific navigation, visual tokens, Home card layout, WebSeer approved editorial content and nine screenshot pairs, local gallery, image viewer, course institutional mark, template explanatory diagrams. No research results or private academic documents added.

Asset verification: 18 WebSeer copies have matching Git blob SHA values. The source WebSeer repository and the portfolio catalog enumerate capa1, 2, 3, 4, 6, 7, 8, 9 and 10. The source repository also has application-guides.png; it is not in the approved gallery. No capa5 was found. The actual published portfolio card WebP cover is now used: additionalWorkSnapshot provides the cover, projectEditorial preserves enriched.coverImage, and ProjectCard selects coverImage.cardUrl. The WebP hash matches the source. Original cover PNG remains in the portfolio; the connector returned empty content for that blob, so its transfer is pending.

Release blockers: original Home hero and TE-279 emblem not located; exact RPD original recovered but binary handoff from local environment to GitHub remains pending; real template screenshots and official WebSeer/LCR marks still pending. Do not substitute fabricated assets. Viewer only enabled for available WebSeer images. Do not merge until release blockers and quality gates are cleared.

Tests and visual evidence: GitHub Actions results must be checked on the final candidate; no approval is implied by committing files.

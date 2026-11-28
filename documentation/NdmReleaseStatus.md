# NDM Lab V1.1 — asset intake organized

Branch: fix/ndm-lab-v1-1-final-assets.

All six incoming PNG originals validated against the uploaded SHA-256 manifest and copied without alteration. Five new WebP derivatives were produced; the existing approved WebSeer cover WebP was preserved. The WebSeer graphic is a candidate, not a confirmed official logo. The three intake metadata files were removed from the temporary folder after their provenance was recorded in the inventory; Git history retains them.

Hero, RPD and TE-279 emblem are already present and wired in the development branch; functional validation is pending. Next: integrate dropdown marks, real template gallery and cover viewer; confirm WebSeer mark; validate ImageViewer and final CI, PR, merge and publication. No final release claim.

Frontend integration: LCR mark and existing WebSeer candidate graphic in dropdown; template reference screenshots available via reusable viewer; original WebSeer cover linked to viewer. Official WebSeer mark remains unconfirmed. Full functional tests and publication must be verified on final SHA.

Home background hotfix: full-bleed independent decorative layer prepared. Final artwork selection is reserved for the Planner; no invented image or invalid file URL. Neutral CSS fallback is used until the approved WebP is registered and activated. Hero, navigation, cards and RPD remain unchanged.

Decision Landscape integration: approved uploaded PNG and WebP preserved byte-for-byte; Home uses WebP at 35% over a white base with no secondary overlay. Original and derivative registered, mapped to Home, and guarded by hash tests. Hero/cards/navigation/RPD untouched. Visual evidence and release status are recorded by the PR and Actions runs.

Organic Home Hero: exact Drawer SVG is now the active image; PNG and WebP predecessors are retained unchanged for rollback. The SVG is displayed as an external image element, at full opacity without border, clipping or background. Desktop right column enlarged; mobile retains intrinsic aspect ratio. Decision Landscape remains at 35%. Visual approval pending.

Home viewport hotfix: removed research laboratory eyebrow; cards share a two-column row at approximately half previous width, maintaining 56/44 image/text desktop split and mobile image-above-copy. Home viewport shell measures its available content height and scales only if needed, with an accessibility escape for extreme/zoomed viewports. Other routes remain scrollable. No asset changes.

Short mobile landscape uses a compact image-first card layout to preserve readable copy without triggering overflow (568 × 320).
Author interactive portfolio release: compact author profile, independent reusable 1440 × 810 iframe with external action, stacked Home cards, natural scroll on compact devices, light footer, optimized transparent Hero derivative. Assets and performance evidence registered separately by controlled preparation workflow.

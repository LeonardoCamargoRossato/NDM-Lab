# Home background — Decision Landscape

Approved by Planner and project owner. Source: Drawer (AI-generated artwork), manually uploaded. Both files are 1672 × 941. Do not modify the approved binaries.

| File | Purpose | Bytes | SHA-256 |
|---|---|---:|---|
| HomeBackground.png | Original archive | 2471826 | `33701e034858e1eb3d45da0b41f7c25abc8a7c54a5ba48a49bca7b2fe48c0371` |
| HomeBackground.webp | Optimized Home delivery | 112512 | `78e6b2558229b7babbab34c5212209a7f2ebf149e37fc9b179aad3d0b43dbe02` |

Layer 1: white base; layer 2: this WebP at 35% opacity, covering the entire main area with responsive center positioning; layer 3: existing content at full opacity. Adjust only `homeBackground.opacity` in `code/src/lib/Assets.ts`. No second overlay, no mobile derivative, no runtime PNG request. Other routes do not render the background. Paths resolve through Vite BASE_URL. See AssetInventory and ProductStructure for references.

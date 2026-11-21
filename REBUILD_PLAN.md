# Gully Labs — Scroll-Cinematic Rebuild Plan

Reference: tradetash.com scroll-through (66 MB screen recording, 1:11.59, 30 fps).
Target: same scroll grammar, same "one persistent product" storytelling, but every
claim, number, product and image 100% real Gully Labs.

## Reference teardown (final, all keyframes read)

| t | Scene | Grammar |
|---|-------|---------|
| 0–5s | Hero | Card floats centre-right, soft shadow, headline left, waitlist card bottom-left, "Scroll to explore", 3 hairline columns, grain |
| 6–13s | Rotation | Card rotates edge-on → front on scroll (scrub), "Graded. Tracked. Investable." lines light up one by one |
| 14–15s | Annotation | "$550K" huge + "POP 124 · PSA 10" mono + hand-drawn line draws in |
| 16–24s | Colour wipe → navy | S&P line chart animates, "Quietly outperforming the S&P 500." / "For two decades." |
| 25–31s | Diagonal wipe | Card fan tumbles on green felt |
| 32–35s | Blurred wall | Perspective card carousel, centre card sharp + name caption in mono |
| 36–40s | Light editorial | Thin animated chart, "The Investment Case for Trading Cards." / "Ownership, not merchandise." |
| 41–42s | Word pairs | Cart→Position, Listing→Portfolio, Checkout→Trade, Shipping→Vaulted custody |
| 43–49s | Dark pinned | "tash brings the structure of modern investing to trading cards." card falls over text, 00→48 scroll counter bottom-right |
| 50–55s | Gold index | "Across every segment, the trend is clear." segment rows with counting numbers ($23,632→$10,085), topo-line pattern |
| 56–64s | Bezier journey | "From card selection to your portfolio." card flies dotted→solid curve through STEP 1–4 milestones |
| 65s | FAQ | "Questions, answered." |
| 66–71s | Dark closing | "The world's most iconic cards, within reach." + tickets ("SEC qualification in progress", "Backed by Y Combinator") + footer |

## Gully mapping — 12 scenes (all real)

Persistent anchor: **Baaz Oud Brown, ₹9,490** (hero product photo cutout).

1. **Hero** — sticky pin. Shoe floats centre-right with shadow + slow float; "Hand-built sneakers from the streets of Delhi." left; drop chip "Baaz Oud Brown · ₹9,490"; "Scroll to explore" bottom-right; hairline columns; grain. CTA card links to the real Baaz product page (no fake cart).
2. **Rotation scrub** — shoe tilts/turns (CSS 3D rotateY + scale + blur) tied to scroll. Lines light up in sequence: "Hand-lasted." / "Hand-painted." / "Numbered." (real: lasting, hand-painted crust leather, numbered pairs).
3. **Price annotation** — "₹9,490" huge beside shoe + mono "GULLY No. 001 · CRUST LEATHER" + drawn craft callout lines to shoe parts (hand-painted upper, vulcanised midsole, honey gum outsole).
4. **Cobalt wipe** — background wipes to #003bd0. Real growth chart 2023→2025: Aug 2023 founded (Delhi) → Apr 2024 Sector-10 workshop, 6 karigars → Jan 2025 Sector-4 HQ, 10,000 sq ft. Counter 06→50+ karigars. Headline: "Quietly building India's sneaker workshop." / "Three years, one last."
5. **Diagonal wipe fan** — colourway photos tumble/fan across the wipe (Baaz Oud Brown, Ebony, Magic Carpet + Sprinter, Dvaita, Amra, Suva).
6. **Blurred wall carousel** — perspective wall of real colourway photos, centre spotlight + mono caption "Baaz Oud Brown — No. 001 · Crust leather". Headline: "Every pair, built by hand."
7. **Light editorial** — thin animated timeline Aug 2023 → Apr 2024 → Jan 2025. Headline: "The case for Indian craft." / "Made, not licensed."
8. **Word pairs** — Retail → Release · Bulk → Batch of 6 · Made in China → Made in Noida · Season-less → 60-day drops · Logistics → Lasting bench. (all factual)
9. **Dark pinned** — "Gully Labs brings the discipline of craft to Indian sneakers." shoe falls over text; mono counter bottom-right "Pairs per drop" 00→48 (real: batch-of-6 numbering → 50+ karigar capacity).
10. **Model index (sand/ink)** — "Across every model, the price is honest." Real model rows with counting numbers: Baaz ₹9,490 · Sprinter ₹5,490 · Dvaita ₹5,990 · Amra ₹7,990 · Suva ₹3,790 · Magic Carpet ₹4,490, each linking to its live page. Topo-line pattern = stitched seam pattern SVG.
11. **Bezier journey** — "From the cutting table to your street." shoe flies the curve through real construction milestones: STEP 1 Pattern cutting → STEP 2 Lasting → STEP 3 Hand-painting → STEP 4 Vulcanising → STEP 5 Numbering.
12. **FAQ + dark closing + footer** — "Questions, answered." (sizing, shipping, drops, stockists — answers link to real policy pages). Closing: "From the streets, into the future." + tickets "50+ karigars · Noida" / "Every 60 days". Footer = real site.js links.

## Technique decisions

- **Photo-first, no GLB on the scroll path.** The hero anchor is the real Oud Brown photo cut out to transparent PNG (flood-fill keying on the uniform cream background — shoe pixels never regenerated). three.js/Glb removed from the main scroll experience; bundle drops from ~864 kB.
- **Scroll engine:** GSAP ScrollTrigger, one timeline per pinned section, `scrub: true` everywhere, all motion disabled under `prefers-reduced-motion`.
- **Product motion = CSS 3D transforms + filters on real photos** (rotateY tilt with blur at extremes, scale, translate), exactly tash's card treatment.
- **Charts/paths = SVG** with `getPointAtLength` for the shoe flying the bezier; stroke-dashoffset for "drawn" lines.
- **Counters** driven by ScrollTrigger progress, monospace IBM Plex Mono labels.
- **Colour wipes** via pinned sections with animated background + rounded seam overlaps.
- **Grain:** existing CSS grain overlay kept on every scene.
- **Assets:** `public/img/*-1400.webp` (21 real products) + generated cutouts `public/img/cutouts/`. Workshop photos only if provided (real); atmosphere plates only as background texture, never the product.

## Asset checklist

- [x] 21 real product photos 700/1400 (local, live-feed verified)
- [x] Cutouts: Oud Brown, Ebony, Magic Carpet, Udaan, Amra, Suva — `tools/cutout.mjs`
- [x] Live product feed fully verified (201 products, `tools/products-flat.json`)
- [ ] **From you:** multi-angle Baaz shots — drop in `public/img/angles/oud-brown/`
      as `01.webp … 08.webp` (turntable order), then uncomment the list in
      `src/data/assets.js`. Cream-background originals: run
      `node tools/cutout.mjs public/img/angles/oud-brown/01.png` first.
      Until then the Rotator uses a 3D-tilt simulation of the real side photo.
- [x] **Workshop photos — delivered from the brand's making-of reel (57s, 720p):**
      29 frames sampled at 2s, five step-matching moments cut with ffmpeg and
      encoded to WebP in `public/img/workshop/` (cutting, lasting, painting,
      vulcanising, numbering + `bench.webp`). Journey renders them as
      cover-cropped milestone cards via `workshopPhotos`; the Fan scene uses
      the bench shot as a dimmed full-bleed layer. See ASSETS.md for the
      encode command.

## Build status (2026-11-19, final pass)

- 13 scenes, ordered: Hero → **Teardown (2nd)** → Make → Detail → Workshop →
  Fan → Wall → Swap → Claim → Index → Journey → FAQ → Closing. Scene labels
  renumbered 01–13.
- Teardown moved to the start per user request; GLB preloaded and ScrollTrigger
  refreshed on lazy mount so early positions are never stale.
- Small fixes: removed invented "drop 018" copy (both Hero and Annotation),
  "One last" → "One pair", added missing section labels, capped product images
  at 62vh so they never clip short viewports.
- ROOT CAUSE of "things appear after passing a section" fixed: `overflow-x:
  hidden` on html/body made the root a scroll container, which silently
  disabled every `position: sticky` stage — scenes scrolled away instead of
  pinning, so scrubbed content activated too late. Root overflow removed;
  the only genuine overflow source (FAQ's `.grain::after` at `inset: -50%`)
  clipped to `inset: 0`. Verified: stage holds at `top: 0` across all runways,
  horizontal scroll impossible, docW 985 < vw 1000.
- 13 scenes: hero, rotation, annotation, growth, fan, wall, **3D teardown**,
  word pairs, dark statement, price index, bezier journey, FAQ, closing.
- Scroll retune: scrub lag 0.55 → 0.15; runways varied 150vh–340vh to create
  rhythm instead of one uniform draggy pace.
- Teardown restored (it had been wrongly deleted in the first pass): the real
  `sneaker.glb` separates into six layers on scroll, with the real construction
  notes as callouts, per-layer dimming and camera pull-back. three.js is
  code-split: 315 kB initial + 569 kB lazy chunk.
- Empty beats filled with real photography: thumbnails on all six index rows,
  an Ebony product card in FAQ, ghosted cutouts behind WordPairs and Closing,
  five real milestone cards on the bezier path.
- Browser verification: 13 sections, 12 triggers, zero console errors, zero
  broken images, no overflow; teardown scrub verified (spread 0.014→0.286,
  layer counter 01→06). Lighthouse 100 / 100 / 100.
- Reveal timing fix (final pass): all scene text now starts at 0.8 opacity on
  arrival and reaches 1 by 10% of its runway. Previously key headlines sat at
  0 opacity until 50% scroll (measured in-browser). Scroll motion is reserved
  for the product, charts, counters and layer separation. Scrub lag 0.15.
- Still pending from the user: AI material plates, multi-angle Baaz frames,
  real workshop photos — each has a drop-in path documented above.

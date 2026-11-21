# Gully Labs — Sneaker Exploded-View Video Pipeline

A 7-second photoreal exploded-view video of the Baaz Oud Brown sneaker, built frame-by-frame using `@napi-rs/canvas` and encoded via ffmpeg. The pipeline decomposes the shoe into 10 masked parts (10 eyelet rings, sole, lining, 6 lace ribbons, brass chain) and renders each of 210 frames (7s × 30fps) with deep focus, warm matte paper background, and cobalt rim glow per part.

## Project Structure

```
gully-labs/
├─ tools/shoe/              ← full mask/render/ffmpeg pipeline
│  ├─ sneaker-ref.jpg       2000×2000 reference image
│  ├─ build.mjs             all constants + exported masks
│  ├─ render.mjs            per-frame renderer + render-all script
│  ├─ timeline.json         ffmpeg timeline reference
│  ├─ sneaker-exploded.mp4  final 7s MP4 output
│  └─ frames/               210 PNG sequence (frame_001.png … frame_210.png)
│
├─ src/                     ← Vite + React single-page app
│  ├─ App.jsx               13-scene router (mobile-first)
│  ├─ sections/             Teardown, Rotator, Hero, Journey, etc.
│  ├─ data/assets.js        workshopPhotos, angleFrames (pending)
│  └─ ...
│
├─ public/                  ── website assets (WebP, images, etc.)
│
├─ AI_ASSET_PROMPT.md       master prompt for AI material plates
├─ ASSETS.md                site assets inventory
├─ REBUILD_PLAN.md          rebuild timeline + decisions
├─ vite.config.js           Vite 5 + React config
└─ README.md                ← this file
```

## Video Pipeline (How It Was Built)

1. **Ring set discovery** — 10 eyelet centers found via dark-hole (hole<52) + bronze-rim (bright gold) diagnostics on `sneaker-ref.jpg`. 3 far-row rings: (886,1034), (1143,1094), (1209,1121).

2. **Mask authoring** — 6 part masks generated from image analysis:
   - `SOLE_POLY` — brown canvas + cream stitched cupsole
   - `LINING_POLY` — dark interior between upper + sole/chain
   - `LACE_POLY` — 6 mid-brown ribbons (r>g>b, lum 95–175)
   - `CHAIN_PATH` — brass ghungroo chain at heel
   - `RINGS` — 10 discs at confirmed centers

3. **Frame rendering** — `render.mjs` generates 210 PNGs (7s × 30fps) using `@napi-rs/canvas`. Timeline:
   - 0–1s: assembled (camera locked)
   - 1–3.5s: separate in order (cupsole → lining+tongue → upper+stitching → laces → brass eyelets → chain off heel)
   - 3.5–5s: hold separated parts
   - 5–6.5s: reassemble (reverse stagger)
   - 6.5–7s: final hold

4. **FFmpeg encode** — `sneaker-exploded.mp4`: H.264, yuv420p, 30fps, exactly 7.0s (210 frames @ ~110kB).

5. **Visual style** — photoreal macro: 35mm slightly top-down, deep focus, warm matte paper `#EFECE5` bg, soft front-left key + gentle right fill, cobalt `#003BD0` rim glow per part, faint film grain, real fabric weave/matte rubber. No hard shadows, no invented text, no watermark.

## Running the Site locally

```bash
# 1. Install deps (Node v26)
npm install

# 2. Start dev server (port 5173)
npm run dev

# 3. Open http://localhost:5173
```

The site has 13 scenes in order: Loader → Hero → Teardown (references the exploded-view MP4) → Rotator → Annotation → Growth → Fan → Wall → WordPairs → Statement → Index → Journey → Faq → Closing.

`prefers-reduced-motion` is handled — scroll/animation intensity reduces when enabled.

## Key Decisions (Recorded in REBUILD_PLAN.md)

- Video production: **"Build it locally, render MP4 myself"** — no video-gen tool exists
- `browser` namespace removed from tool catalog — whole pipeline runs Node via `@napi-rs/canvas`
- Explosion axis: 32° down-left, positions `(i-2.5)*u`; staggered starts 1.0s + i×0.28s, duration 1.1s; reverse stagger 5.0+(5-i)×0.1s, duration 1.0s
- Style: photo-first scenes; three.js only for Teardown; reveal rule (text readable at entry 0.8, full by ~10% scroll); scrub lag 0.15
- AI generation only for background material plates (prompt in `AI_ASSET_PROMPT.md`)
- Layer decomposition: overlapping silhouettes allowed; inpaint vacated sub-regions; eyelet layer = discs r≈22 at confirmed ring centers ONLY

## AI Material Plates (Prompt in `AI_ASSET_PROMPT.md`)

Paste the block verbatim to generate ONE 2×3 contact sheet (six equal tiles, no gutters, no text). Tiles cover: warm off-white paper, warm sand cork-paper, electric cobalt acrylic-paper, matte near-black plaster, out-of-focus vertical panels, and a soft periwinkle diagonal band. If your model also produces video, a 4-second dust-mote loop is included.

Run `node tools/cutout.mjs <path-to-image>` on any Baaz frames before adding to `angleFrames` in `src/data/assets.js`.

## Git Operations (already logged in)

```bash
# Stage all changed files
git add -A

# Commit
git commit -m "feat: rebuilt sneaker exploded-view pipeline — 7s MP4, 10 masks, 210 frames, 13-scene site"

# Push to main
git push origin main
```

## Outputs

- `tools/shoe/sneaker-exploded.mp4` — 7s final MP4, exactly matching spec
- `tools/shoe/frames/` — 210 PNG sequence for frame-accurate review
- `src/App.jsx` — 13-scene site, mobile-first, `prefers-reduced-motion` ready
- `public/img/workshop/*.webp` — 5 workshop frames (1278×720, ~22KB each)
- All mask constants live in `tools/shoe/build.mjs` for reproducibility
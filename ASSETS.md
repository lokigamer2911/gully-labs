# Assets — Gully Labs Concept Site

## Product photography

All shoe images are real Gully Labs product photography, downloaded from the live Shopify CDN (`cdn.shopify.com/s/files/1/0693/2385/0012/files/...`) and optimised locally as WebP.

| Variant | Source | Sizes |
|---------|--------|-------|
| Baaz Oud Brown | `0Q4A4580.jpg` etc. | 700w, 1400w |
| Baaz Ebony Black | `0Q4A4599.jpg` etc. | 700w, 1400w |
| Magic Carpet | `0Q4A4624.jpg` etc. | 700w, 1400w |
| Dvaita Kohl | collection artwork | 700w, 1400w |
| Amra Ochre | collection artwork | 700w, 1400w |
| Suva Green | collection artwork | 700w, 1400w |
| Buransh Red | collection artwork | 700w, 1400w |
| Udaan Blue | collection artwork | 700w, 1400w |
| + 12 additional colourways | product artwork | 700w, 1400w |

40 image files total (~1.5 MB combined). Each product has a 700w and 1400w WebP variant served via `<source srcSet>` with `loading="lazy"` below the fold and `loading="eager"` for the hero.

## Workshop reel frames (`public/img/workshop/`)

Lifted from the brand's own 57s making-of reel (1278x720, 25fps) with
ffmpeg — every 2s frame was reviewed, then the five step-matching moments
were cut and encoded to WebP (q80, ~22 KB each):

| File | Reel moment | Used in |
|------|-------------|---------|
| `cutting.webp` | karigar holding a cut pattern piece | Journey · Step 1 |
| `lasting.webp` | upper pulled over the last at the bench | Journey · Step 2 |
| `painting.webp` | karigar inspecting a painted upper | Journey · Step 3 |
| `vulcanising.webp` | shoe entering the heat machine | Journey · Step 4 |
| `numbering.webp` | pair in front of the blue box wall | Journey · Step 5 |
| `bench.webp` | finished colourways on the bench, karigars behind | Fan · background layer |

Re-encoding: `ffmpeg -i <frame>.jpg -vf scale=1278:-2 -c:v libwebp -quality 80 out.webp`.

## Typography (self-hosted)

- **Archivo Variable** — display headings (`@fontsource-variable/archivo`)
- **Instrument Serif** — editorial body/italic (`@fontsource/instrument-serif`)
- **IBM Plex Mono** — specimen metadata, prices, indices (`@fontsource/ibm-plex-mono`)

All fonts subset to Latin and self-hosted — no Google Fonts requests.

## Colour palette

| Token | Hex | Use |
|-------|-----|-----|
| `--color-ink` | `#0b0b0b` | Primary text, backgrounds |
| `--color-paper` | `#efece5` | Accent panels (replaced by white in final build) |
| `--color-cobalt` | `#003bd0` | Brand accent, verified from live Gully Labs DOM |
| `--color-cobalt-light` | `#7f9dff` | Cobalt text on dark surfaces (contrast) |

## 3D asset (in use — scene 2 teardown)

The scroll-driven exploded teardown uses `public/models/sneaker.glb` (CC0
"High-top sneaker", 1.55 MB, glTF 2.0), mapped to the six real construction
layers from the product feed. It is explicitly framed as a **material study** —
it is not a Gully Labs product. All other scenes use real brand photography.

It is code-split (three.js loads as a separate chunk) and preloaded from
`index.html` so it is ready as soon as the second scene arrives.

**To make the opening teardown 100% authentic**, replace that file with a GLB of
the actual Baaz Oud Brown — no code changes needed — or supply an exploded
video / image sequence of the real shoe and I'll wire a scroll-scrubbed version.

## Image optimisation

- WebP format throughout
- Responsive `srcSet` (700w / 1400w)
- `loading="eager"` for hero, `loading="lazy"` elsewhere
- `decoding="async"` for non-blocking decode
- Explicit `width`/`height` + `aspect-ratio` to prevent layout shift
- Total page weight (gzip): HTML 0.69 kB, CSS 6.8 kB, JS 75.9 kB, fonts ~150 kB

## Social links

- Instagram: https://www.instagram.com/gullylabs/ (302K followers)
- YouTube: https://www.youtube.com/@gullylabs
- X: https://x.com/GullyLabs
- Facebook: https://www.facebook.com/gullylabs/

## Commerce links

All product and collection links deep-link to `gullylabs.com`. No simulated cart, no checkout, no affiliate codes. `target="_blank" rel="noopener noreferrer"` on all external links.

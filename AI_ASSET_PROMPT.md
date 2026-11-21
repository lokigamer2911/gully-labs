# Single master prompt for the AI generator

Paste the block below verbatim. It produces ONE image — a six-tile material board —
which I slice into six background plates with `sharp` (cropping by math, so any
canvas size works). If the model also does video, the same prompt asks for one
short atmosphere loop at the end.

## Attach as style reference (optional but helpful)

`C:\Users\HP\AppData\Local\Temp\opencode\ref-grain-background.png`

This is a pure grain crop from the reference video — no product, no text.

## Attach NOTHING else

Do **not** attach any sneaker photo, product shot, turntable frame or workshop
photo to this generation. Those are for me, not the AI. Feeding them in risks the
model drawing a shoe into the plates, which breaks the whole authenticity rule.

## Prompt

```text
Create ONE image: a clean material-board contact sheet divided into a precise
2-column by 3-row grid of six equal rectangular tiles, edge to edge, no gutters,
no borders, no text, no labels, no numbers, no objects, no people, no footwear,
no logos, no watermarks. Flat material-scan aesthetic, fine 35mm film grain,
editorial minimalism, no 3D rendering, no glossy CGI.

Use only this palette: warm off-white #efece5, warm sand #e4ded3, electric cobalt
#003bd0 with #1f52de and #002a94, near-black #0b0b0b, a trace of pale periwinkle
#7f9dff.

Tile 1 (top left): warm off-white #efece5 uncoated paper, extremely fine natural
fibre grain, flat neutral light.
Tile 2 (top right): warm sand #e4ded3 cork and paper, subtle mottling and fibre,
flat even light.
Tile 3 (middle left): electric cobalt #003bd0 seamless acrylic-paper backdrop,
very fine grain, faint radial lift at the centre toward #1f52de, falling to
#002a94 at the edges.
Tile 4 (middle right): matte near-black #0b0b0b plaster and concrete, fine grit,
soft directional light from upper left falling off darker toward lower right,
completely empty surface.
Tile 5 (bottom left): abstract dark corridor of out-of-focus vertical panels,
heavy cinematic bokeh, near-black with a faint cobalt #003bd0 edge light, no
readable shapes.
Tile 6 (bottom right): matte near-black plaster with an almost imperceptible soft
diagonal band of pale periwinkle #7f9dff light sweeping across it, fine grain,
very subtle.

If your model also produces video, additionally output one 4-second seamless
loop: slow drifting dust motes in a dark charcoal space catching a faint cobalt
edge light, empty space, no objects, no people, no text.

Negative prompt: shoes, sneakers, footwear, bags, products, product photography,
hands, people, faces, text, letters, numbers, typography, logos, brand marks, UI,
borders, labels, watermarks, 3D render, glossy CGI, illustration, cartoon.
```

## Fallback

If your tool refuses a contact sheet, generate **tile 4 alone** (the matte
near-black plaster) using its sentence above. I can derive the paper, sand and
cobalt variants from that single grain plate with colour overlays — enough to
move forward.

## Handoff

Save the output(s), tell me the path(s), and I will: slice six plates, key them
to WebP, extract frames from any loop with ffmpeg, wire them into the matching
scenes, rebuild and re-run the verification + Lighthouse pass.

/**
 * Produce a SAFE style reference: a pure background crop from the reference
 * video keyframe — no product, no text, no people. Attach this to the AI
 * generator alongside the master prompt in AI_ASSET_PROMPT.md.
 */
import sharp from 'sharp'

const src = 'C:/Users/HP/AppData/Local/Temp/opencode/vidframes/k07.jpg'
const out = 'C:/Users/HP/AppData/Local/Temp/opencode/ref-grain-background.png'

const meta = await sharp(src).metadata()
// Bottom-left patch of the dark scene: grain only — clear of the logo,
// the centred headline and the bottom-right counter.
const left = Math.round(meta.width * 0.02)
const top = Math.round(meta.height * 0.79)
const width = Math.round(meta.width * 0.24)
const height = Math.round(meta.height * 0.16)

await sharp(src).extract({ left, top, width, height }).png().toFile(out)
console.log(`${out}  ${width}x${height}`)

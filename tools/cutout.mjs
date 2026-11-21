/**
 * Cutout tool: turns Gully Labs product photos (uniform cream background)
 * into transparent cutouts. The shoe pixels are never regenerated — this is
 * pure keying: flood-fill from the borders + soft matte + defringe.
 *
 * Usage:
 *   node tools/cutout.mjs                     — all known colourways
 *   node tools/cutout.mjs oud-brown           — one known colourway
 *   node tools/cutout.mjs public/img/angles/oud-brown/01.png
 *                                             — explicit brand photo ->
 *                                               same folder/01-cut.webp
 *
 * Output: public/img/cutouts/<name>-{700,1400}.webp for known colourways,
 * or <input-folder>/<basename>-cut.webp for explicit paths.
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const ALL = [
  'oud-brown', 'ebony-black', 'magic-carpet',
  'dvaita-kohl', 'dvaita-calico', 'amra-ochre', 'suva-green', 'udaan-blue',
  'buransh-red', 'koyar-black', 'megh-white', 'maska-yellow', 'loam-java',
  'laakh-red', 'kulfi-rabri', 'aangan-blue', 'aandhi-kobicha',
  'kharif-green', 'gati-beige', 'xoloni-orange',
]

const TOL_OUT = 30 // flood-fill join distance from background colour
const TOL_IN = 16  // fully transparent below this distance
const SIZES = [1400, 700]

const fileTargets = (name) => {
  if (/[\\/]|\.(png|jpe?g|webp)$/i.test(name)) {
    const clean = name.replace(/\\/g, '/')
    const base = clean.split('/').pop().replace(/\.[^.]+$/, '')
    const dir = dirname(clean)
    return [{ src: clean, dst: `${dir}/${base}-cut.webp` }]
  }
  return SIZES.map((size) => ({
    src: `public/img/${name}-${size}.webp`,
    dst: `public/img/cutouts/${name}-${size}.webp`,
  }))
}

const dist2 = (r, g, b, c) => {
  const dr = r - c[0], dg = g - c[1], db = b - c[2]
  return dr * dr + dg * dg + db * db
}

async function cutout(name) {
  for (const { src, dst } of fileTargets(name)) {
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const W = info.width, H = info.height, C = info.channels
    const px = (x, y) => (y * W + x) * C

    // Background reference: average of the four corner patches (24px squares).
    const patch = 24
    const samples = []
    for (const [cx, cy] of [[0, 0], [W - patch, 0], [0, H - patch], [W - patch, H - patch]]) {
      let r = 0, g = 0, b = 0, n = 0
      for (let y = cy; y < cy + patch; y++) {
        for (let x = cx; x < cx + patch; x++) {
          const i = px(x, y)
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++
        }
      }
      samples.push([r / n, g / n, b / n])
    }

    const isBg = (i) => {
      const r = data[i], g = data[i + 1], b = data[i + 2]
      for (const c of samples) if (dist2(r, g, b, c) < TOL_OUT * TOL_OUT) return true
      return false
    }

    // Flood fill background from every border pixel.
    const bgMask = new Uint8Array(W * H)
    const stack = []
    for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1) }
    for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y) }
    while (stack.length) {
      const y = stack.pop(), x = stack.pop()
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      const k = y * W + x
      if (bgMask[k]) continue
      if (!isBg(k * C)) continue
      bgMask[k] = 1
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1)
    }

    // Alpha: bg -> 0, subject -> 255. Then erode 1px and box-blur twice for a soft matte.
    let alpha = new Uint8Array(W * H)
    for (let k = 0; k < W * H; k++) alpha[k] = bgMask[k] ? 0 : 255

    const erode = (a) => {
      const out = new Uint8Array(W * H)
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const k = y * W + x
          if (!a[k]) { out[k] = 0; continue }
          let min = 255
          if (x > 0) min = Math.min(min, a[k - 1])
          if (x < W - 1) min = Math.min(min, a[k + 1])
          if (y > 0) min = Math.min(min, a[k - W])
          if (y < H - 1) min = Math.min(min, a[k + W])
          out[k] = min
        }
      }
      return out
    }
    const blur = (a) => {
      const out = new Uint8Array(W * H)
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const k = y * W + x
          let sum = a[k] * 4, n = 4
          if (x > 0) { sum += a[k - 1]; n++ }
          if (x < W - 1) { sum += a[k + 1]; n++ }
          if (y > 0) { sum += a[k - W]; n++ }
          if (y < H - 1) { sum += a[k + W]; n++ }
          out[k] = Math.round(sum / n)
        }
      }
      return out
    }
    alpha = blur(blur(erode(alpha)))

    // Defringe: pixels with partial alpha take the colour of nearby opaque pixels.
    const out = Buffer.from(data)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const k = y * W + x
        const a = alpha[k]
        if (a === 255 || a === 0) continue
        // sample nearest opaque pixel in a small ring
        let r = 0, g = 0, b = 0, n = 0
        for (let dy = -3; dy <= 3 && n < 6; dy++) {
          for (let dx = -3; dx <= 3 && n < 6; dx++) {
            const nx = x + dx, ny = y + dy
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
            const nk = ny * W + nx
            if (alpha[nk] < 200) continue
            const ni = nk * C
            r += out[ni]; g += out[ni + 1]; b += out[ni + 2]; n++
          }
        }
        if (n) {
          const i = k * C
          out[i] = r / n; out[i + 1] = g / n; out[i + 2] = b / n
        }
      }
    }

    // Neutralise soft grey contact shadow remnants under the shoe: anything
    // outside the shoe that survived the flood but is near-neutral and midtone
    // is faded out (keeps the shoe, drops the baked shadow).
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const k = y * W + x
        if (alpha[k] === 0) continue
        if (bgMask[k]) { alpha[k] = 0; continue }
        const i = k * C
        const r = out[i], g = out[i + 1], b = out[i + 2]
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        const sat = max - min
        const lum = (r + g + b) / 3
        // cream shadow: lowish saturation, bright, clearly not the dark shoe
        if (sat < 26 && lum > 168 && bgNear(k, bgMask, W, H)) {
          const t = (lum - 168) / 60 // further from shoe = more transparent
          alpha[k] = Math.round(alpha[k] * Math.max(0, 1 - t))
        }
      }
    }

    for (let k = 0; k < W * H; k++) out[k * C + 3] = alpha[k]

    mkdirSync(dirname(dst), { recursive: true })
    await sharp(out, { raw: { width: W, height: H, channels: C } })
      .webp({ quality: 88, alphaQuality: 90 })
      .toFile(dst)
    console.log(`${dst}  ok`)
  }
}

function bgNear(k, bgMask, W, H) {
  const y0 = Math.floor(k / W)
  const x0 = k % W
  let near = false
  outer: for (let r = 1; r <= 40 && !near; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
        const x = x0 + dx, y = y0 + dy
        if (x < 0 || y < 0 || x >= W || y >= H) continue
        if (bgMask[y * W + x]) { near = true; break outer }
      }
    }
  }
  return near
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : ALL
for (const name of targets) {
  try { await cutout(name) } catch (e) { console.error(`${name}: ${e.message}`) }
}

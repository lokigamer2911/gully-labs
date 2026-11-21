// probe.mjs — numeric colour probes & brass blob detection (no eyeballing)
// usage: node probe.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'

const img = await loadImage('sneaker-ref.jpg')
const W = img.width, H = img.height
const base = createCanvas(W, H)
const bg = base.getContext('2d')
bg.drawImage(img, 0, 0)
const px = bg.getImageData(0, 0, W, H).data

export const sample = (x, y) => {
  const i = (y * W + x) * 4
  return [px[i], px[i + 1], px[i + 2]]
}

// brass-ish predicate: warm metallic gold
export const isBrass = (r, g, b) => r > 145 && g > 115 && g > b + 25 && r > g

// connected components of brass pixels inside rect (8-conn, after dilate r)
export function brassBlobs(x0, y0, x1, y1, { dilate = 6, minN = 150, pred = isBrass } = {}) {
  const rw = x1 - x0, rh = y1 - y0
  const m = new Uint8Array(rw * rh)
  for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
    const i = ((y0 + y) * W + (x0 + x)) * 4
    if (pred(px[i], px[i + 1], px[i + 2])) m[y * rw + x] = 1
  }
  // dilate
  let a = m, b = new Uint8Array(m.length)
  for (let p = 0; p < dilate; p++) {
    for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
      let v = 0
      for (let dy = -1; dy <= 1 && !v; dy++) for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy, nx = x + dx
        if (ny >= 0 && ny < rh && nx >= 0 && nx < rw && a[ny * rw + nx]) { v = 1; break }
      }
      b[y * rw + x] = v
    }
    ;[a, b] = [b, a]
  }
  const dm = a
  const lab = new Int32Array(rw * rh).fill(-1)
  const blobs = []
  const stack = []
  for (let i = 0; i < rw * rh; i++) {
    if (!dm[i] || lab[i] >= 0) continue
    const id = blobs.length
    lab[i] = id
    stack.push(i)
    let sx = 0, sy = 0, n = 0, ax0 = 1e9, ay0 = 1e9, ax1 = -1, ay1 = -1
    while (stack.length) {
      const j = stack.pop()
      const jx = j % rw, jy = (j / rw) | 0
      sx += jx; sy += jy; n++
      if (jx < ax0) ax0 = jx; if (jx > ax1) ax1 = jx
      if (jy < ay0) ay0 = jy; if (jy > ay1) ay1 = jy
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = jx + dx, ny = jy + dy
        if (nx < 0 || ny < 0 || nx >= rw || ny >= rh) continue
        const k = ny * rw + nx
        if (dm[k] && lab[k] < 0) { lab[k] = id; stack.push(k) }
      }
    }
    if (n >= minN) blobs.push({ cx: x0 + Math.round(sx / n), cy: y0 + Math.round(sy / n), w: ax1 - ax0 + 1, h: ay1 - ay0 + 1, n })
    else lab.forEach((v, k) => { if (v === id) lab[k] = -1 }) // discard small
  }
  return blobs
}

// mean colour of brass-ish pixels in rect
export function brassMean(x0, y0, x1, y1) {
  let r = 0, g = 0, b = 0, n = 0
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * 4
    if (isBrass(px[i], px[i + 1], px[i + 2])) { r += px[i]; g += px[i + 1]; b += px[i + 2]; n++ }
  }
  return n ? { mean: [Math.round(r / n), Math.round(g / n), Math.round(b / n)], n } : null
}

// histogram of quantised colours in rect (top N by count)
export function hist(x0, y0, x1, y1, q = 24, top = 12) {
  const m = new Map()
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * 4
    const k = `${Math.round(px[i] / q) * q},${Math.round(px[i + 1] / q) * q},${Math.round(px[i + 2] / q) * q}`
    m.set(k, (m.get(k) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, top)
}

// --- CLI probes -------------------------------------------------------
if (process.argv[1] && process.argv[1].endsWith('probe.mjs')) {
  const mode = process.argv[2] || 'all'
  if (mode === 'all' || mode === 'blobs') {
    console.log('THROAT blobs:', JSON.stringify(brassBlobs(760, 950, 1540, 1370)))
    console.log('CHAIN blobs:', JSON.stringify(brassBlobs(280, 1000, 880, 1360, { minN: 300 })))
  }
  if (mode === 'all' || mode === 'mean') {
    console.log('throat mean:', JSON.stringify(brassMean(760, 950, 1540, 1370)))
    console.log('chain mean:', JSON.stringify(brassMean(280, 1000, 880, 1360)))
  }
  if (mode === 'all' || mode === 'hist') {
    console.log('throat hist:', JSON.stringify(hist(760, 950, 1540, 1370)))
    console.log('chain hist:', JSON.stringify(hist(280, 1000, 880, 1360)))
  }
  if (mode === 'pts') {
    const pts = process.argv.slice(3)
    for (const p of pts) {
      const [x, y] = p.split(',').map(Number)
      console.log(`(${x},${y}) =`, sample(x, y))
    }
  }
}

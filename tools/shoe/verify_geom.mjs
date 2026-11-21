// verify_geom.mjs — numeric check: green line vs SOLE_TOP/BOTTOM, cyan circles vs RINGS
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { SOLE_TOP, SOLE_BOTTOM, RINGS, RING_R } from './build.mjs'

const img = await loadImage('verify_sole.png')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const isGreen = (x, y) => { const i = (y * W + x) * 4; return d[i + 1] > 200 && d[i] < 120 && d[i + 2] < 100 }
const isCyan = (x, y) => { const i = (y * W + x) * 4; return d[i + 2] > 180 && d[i + 1] > 150 && d[i] < 100 }

const interp = (pts, x) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return null
}

console.log('--- sole TOP: expected vs green pixels found ---')
for (const x of [400, 600, 800, 1000, 1200, 1400, 1600]) {
  const exp = interp(SOLE_TOP, x)
  const found = []
  for (let y = Math.round(exp) - 25; y <= Math.round(exp) + 25; y++) if (isGreen(x, y)) found.push(y)
  console.log(`x=${x} exp=${Math.round(exp)} green=[${found}] delta=${found.length ? found[0] - Math.round(exp) : 'NONE'}`)
}
console.log('--- sole BOTTOM: expected vs green ---')
for (const x of [500, 900, 1300, 1650]) {
  const exp = interp(SOLE_BOTTOM, x)
  const found = []
  for (let y = Math.round(exp) - 25; y <= Math.round(exp) + 25; y++) if (isGreen(x, y)) found.push(y)
  console.log(`x=${x} exp=${Math.round(exp)} green=[${found}] delta=${found.length ? found[0] - Math.round(exp) : 'NONE'}`)
}
console.log('--- rings: cyan pixels in annulus r 18..26 ---')
for (const [cx, cy] of RINGS) {
  let n = 0
  for (let a = 0; a < 360; a += 5) {
    const rad = (a * Math.PI) / 180
    for (let r = 18; r <= 26; r++) if (isCyan(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r))) n++
  }
  console.log(`  (${cx},${cy}) cyan=${n}${n < 30 ? '  <-- WEAK' : ''}`)
}

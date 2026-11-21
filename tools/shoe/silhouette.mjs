// silhouette.mjs — topmost non-bg pixel per column + leftmost/rightmost
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }
const isBg = ([r, gg, b]) => r > 205 && gg > 203 && b > 198 && r - b < 16 && Math.max(r, gg, b) - Math.min(r, gg, b) < 16

const tops = []
for (let x = 290; x <= 1740; x += 10) {
  let top = -1
  for (let y = 700; y < 1600; y++) { if (!isBg(RGB(x, y))) { top = y; break } }
  tops.push([x, top])
}
console.log('TOP EDGE (x,y):')
console.log(tops.filter(([x]) => x % 30 === 0).map(([x, y]) => `${x}:${y}`).join('  '))

// left/right extremes between y 900-1560
let lx = 9999, lxY = 0, rx = 0, rxY = 0
for (let y = 900; y <= 1560; y += 4) {
  for (let x = 250; x < 1000; x++) { if (!isBg(RGB(x, y))) { if (x < lx) { lx = x; lxY = y } break } }
  for (let x = 1800; x > 1000; x--) { if (!isBg(RGB(x, y))) { if (x > rx) { rx = x; rxY = y } break } }
}
console.log(`LEFT extreme x=${lx} @y=${lxY}; RIGHT extreme x=${rx} @y=${rxY}`)

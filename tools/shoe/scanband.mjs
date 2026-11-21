// scanband.mjs — dense ring-candidate scan over a band, filtered by dark hole + bronze annulus
import { loadImage, createCanvas } from '@napi-rs/canvas'

const [x0, x1, y0, y1, step, holeMax, annMin] = process.argv.slice(2).map(Number)

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

function diag (cx, cy) {
  let hole = 0, hn = 0, ann = 0, an = 0
  for (let a = 0; a < 360; a += 12) {
    const co = Math.cos(a * Math.PI / 180), si = Math.sin(a * Math.PI / 180)
    let x = Math.round(cx + co * 6), y = Math.round(cy + si * 6)
    let [r, gg, b] = px(x, y)
    hole += Math.max(r, gg, b); hn++
    x = Math.round(cx + co * 17); y = Math.round(cy + si * 17)
    ;[r, gg, b] = px(x, y); an++
    if (b < 75 && r - b > 28 && gg > b + 10 && r > gg) ann++
  }
  return { hole: Math.round(hole / hn), ann: +(ann / an).toFixed(2) }
}

const cands = []
for (let y = y0; y <= y1; y += step) {
  for (let x = x0; x <= x1; x += step) {
    const s = diag(x, y)
    if (s.hole < holeMax && s.ann >= annMin) cands.push({ x, y, ...s })
  }
}
cands.sort((a, b) => a.x - b.x)
console.log(JSON.stringify(cands))

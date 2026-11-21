// fargap.mjs — dark-hole scan restricted to far-row band, report candidates
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const L = (x, y) => { const i = (y * W + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] }
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

const hits = []
for (let cy = 1025; cy <= 1115; cy += 2) {
  for (let cx = 940; cx <= 1145; cx += 2) {
    const hole = []
    for (let a = 0; a < 360; a += 20) {
      const rad = (a * Math.PI) / 180
      for (let r = 4; r <= 12; r++) hole.push(L(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r)))
    }
    hole.sort((a, b) => a - b)
    const med = hole[hole.length >> 1]
    if (med >= 50) continue
    // any bright gold in annulus?
    let gold = 0, tot = 0
    for (let a = 0; a < 360; a += 10) {
      const rad = (a * Math.PI) / 180
      for (let r = 14; r <= 22; r++) {
        const [R, G, B] = RGB(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r))
        const lum = 0.299 * R + 0.587 * G + 0.114 * B
        tot++
        if (lum > 130 && R > G && G > B && R - B > 30) gold++
      }
    }
    hits.push({ cx, cy, med, gold: gold / tot })
  }
}
// cluster, keep best-med per cluster
const cl = []
for (const h of hits) {
  const c0 = cl.find(c => Math.hypot(c.x - h.cx, c.y - h.cy) < 24)
  if (c0) { c0.n++; c0.sx += h.cx; c0.sy += h.cy; if (h.med < c0.med) { c0.med = h.med; c0.gold = h.gold; c0.bx = h.cx; c0.by = h.cy } }
  else cl.push({ x: h.cx, y: h.cy, sx: h.cx, sy: h.cy, n: 1, med: h.med, gold: h.gold, bx: h.cx, by: h.cy })
}
console.log('far-gap clusters n>=8:')
for (const c0 of cl.filter(c => c.n >= 8).sort((a, b) => a.x - b.x)) {
  console.log(`  darkest=(${c0.bx},${c0.by}) avg=(${Math.round(c0.sx / c0.n)},${Math.round(c0.sy / c0.n)}) n=${c0.n} med=${Math.round(c0.med)} gold=${c0.gold.toFixed(3)}`)
}

// scan3.mjs — dense dark-hole scan in zone3 region
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const L = (x, y) => { const i = (y * W + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] }

const x0 = 1130, y0 = 1075, x1 = 1350, y1 = 1265
const hits = []
for (let cy = y0; cy <= y1; cy += 3) {
  for (let cx = x0; cx <= x1; cx += 3) {
    const hole = []
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180
      for (let r = 4; r <= 12; r++) hole.push(L(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r)))
    }
    hole.sort((a, b) => a - b)
    const med = hole[hole.length >> 1]
    if (med < 52) hits.push({ cx, cy, med: Math.round(med) })
  }
}
// cluster hits
const clusters = []
for (const h of hits) {
  const cl = clusters.find(c => Math.hypot(c.x - h.cx, c.y - h.cy) < 26)
  if (cl) { cl.n++; cl.sx += h.cx; cl.sy += h.cy; cl.med = Math.min(cl.med, h.med) }
  else clusters.push({ x: h.cx, y: h.cy, sx: h.cx, sy: h.cy, n: 1, med: h.med })
}
console.log('clusters (n>=6):')
for (const cl of clusters.filter(c => c.n >= 6).sort((a, b) => a.x - b.x)) {
  console.log(`  center≈(${Math.round(cl.sx / cl.n)},${Math.round(cl.sy / cl.n)}) n=${cl.n} bestMed=${cl.med}`)
}

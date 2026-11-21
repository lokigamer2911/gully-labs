// scan4.mjs — combined dark-hole + bronze-rim scan over lace zone
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const L = (x, y) => { const i = (y * W + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] }
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

// full lace zone: x 760-1400, y 990-1280
const hits = []
for (let cy = 1000; cy <= 1275; cy += 3) {
  for (let cx = 770; cx <= 1390; cx += 3) {
    const hole = []
    for (let a = 0; a < 360; a += 20) {
      const rad = (a * Math.PI) / 180
      for (let r = 3; r <= 10; r++) hole.push(L(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r)))
    }
    hole.sort((a, b) => a - b)
    const med = hole[hole.length >> 1]
    if (med >= 52) continue
    let bronze = 0, tot = 0
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180
      let rowB = false
      for (let r = 13; r <= 20; r++) {
        const [R, G, B] = RGB(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r))
        tot++
        if (R > G && G > B && R - B > 28 && R > 90) rowB = true
      }
      if (rowB) bronze++
    }
    if (bronze / 24 >= 0.45) hits.push({ cx, cy, med, bronze: bronze / 24 })
  }
}
const clusters = []
for (const h of hits) {
  const cl = clusters.find(c => Math.hypot(c.x - h.cx, c.y - h.cy) < 30)
  if (cl) { cl.n++; cl.sx += h.cx; cl.sy += h.cy; if (h.med < cl.med) { cl.med = h.med; cl.bx = h.cx; cl.by = h.cy } }
  else clusters.push({ x: h.cx, y: h.cy, sx: h.cx, sy: h.cy, n: 1, med: h.med, bronze: h.bronze, bx: h.cx, by: h.cy })
}
console.log(`total hits=${hits.length} clusters=${clusters.length}`)
console.log('eyelet-like clusters (n>=4), sorted by x:')
for (const cl of clusters.filter(c => c.n >= 4).sort((a, b) => a.x - b.x)) {
  console.log(`  avg=(${Math.round(cl.sx / cl.n)},${Math.round(cl.sy / cl.n)}) darkest=(${cl.bx},${cl.by}) n=${cl.n} med=${Math.round(cl.med)} bronze=${cl.bronze.toFixed(2)}`)
}

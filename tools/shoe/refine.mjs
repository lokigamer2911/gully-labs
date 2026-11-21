// refine.mjs — find true dark-hole center near (1215,1123) + brass rim check
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const L = (x, y) => { const i = (y * W + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] }
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

const results = []
for (let cy = 1105; cy <= 1145; cy += 2) {
  for (let cx = 1195; cx <= 1240; cx += 2) {
    const hole = []
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180
      for (let r = 3; r <= 10; r++) hole.push(L(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r)))
    }
    hole.sort((a, b) => a - b)
    results.push({ cx, cy, med: hole[hole.length >> 1] })
  }
}
results.sort((a, b) => a.med - b.med)
console.log('darkest centers:')
for (const r of results.slice(0, 8)) console.log(`  (${r.cx},${r.cy}) med=${Math.round(r.med)}`)

// brass rim check at best center: annulus r 13-20, bronze fraction + brightness vs hole
const best = results[0]
let bronze = 0, n = 0, annLum = 0
const rim = []
for (let a = 0; a < 360; a += 6) {
  const rad = (a * Math.PI) / 180
  let rowBronze = false, rowLum = 0
  for (let r = 13; r <= 20; r++) {
    const [R, G, B] = RGB(Math.round(best.cx + Math.cos(rad) * r), Math.round(best.cy + Math.sin(rad) * r))
    const l = 0.299 * R + 0.587 * G + 0.114 * B
    rowLum += l; n++
    if (R > G && G > B && R - B > 28 && R > 90) rowBronze = true
  }
  annLum += rowLum / 8
  if (rowBronze) bronze++
  rim.push(rowBronze ? 'B' : '.')
}
console.log(`best (${best.cx},${best.cy}) holeMed=${Math.round(best.med)} annLum=${Math.round(annLum / 60)} bronze=${bronze}/60`)
console.log('rim:', rim.join(''))

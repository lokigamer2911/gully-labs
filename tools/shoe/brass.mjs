// brass.mjs — bright-gold rim test: distinguishes brass (bright, lum>135) from canvas (dull ~95)
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

const pts = [
  ['B-cand', 1209, 1121],
  ['A-cand', 1188, 1152],
  ['far-real', 1143, 1094],
  ['far-real2', 886, 1034],
  ['near-real', 1221, 1213],
  ['near-real2', 1159, 1167],
  ['canvas-blank', 1180, 1190],
  ['canvas-blank2', 1260, 1140]
]
console.log('name        cx    cy  goldFrac goldMaxLum  holeMed')
for (const [name, cx, cy] of pts) {
  let gold = 0, tot = 0, goldMax = 0
  const hole = []
  for (let a = 0; a < 360; a += 6) {
    const rad = (a * Math.PI) / 180
    for (let r = 13; r <= 21; r++) {
      const [R, G, B] = RGB(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r))
      const lum = 0.299 * R + 0.587 * G + 0.114 * B
      tot++
      if (lum > 135 && R > G && G > B && R - B > 35) { gold++; if (lum > goldMax) goldMax = lum }
    }
    for (let r = 3; r <= 11; r++) {
      const [R, G, B] = RGB(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r))
      hole.push(0.299 * R + 0.587 * G + 0.114 * B)
    }
  }
  hole.sort((a, b) => a - b)
  console.log(name.padEnd(11), String(cx).padStart(4), String(cy).padStart(4),
    (gold / tot).toFixed(3).padStart(8), String(Math.round(goldMax)).padStart(11),
    String(Math.round(hole[hole.length >> 1])).padStart(8))
}

// diag4.mjs — hole/annulus/bronze diagnostics for zone3 candidates
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

const cands = [
  ['4', 1188, 1152], ['5', 1218, 1113], ['6', 1297, 1152], ['7', 1205, 1135],
  // controls: known real + known fake
  ['real-near', 1221, 1213], ['real-far', 1143, 1094], ['fake-canvas', 1300, 1162]
]
console.log('name      cx    cy  holeMin holeMed  annMax  bronzeFrac')
for (const [name, cx, cy] of cands) {
  const hole = [], ann = []
  let bronze = 0, annN = 0
  for (let a = 0; a < 360; a += 6) {
    const rad = (a * Math.PI) / 180
    const co = Math.cos(rad), si = Math.sin(rad)
    for (let r = 4; r <= 13; r++) {
      const [R, G, B] = px(Math.round(cx + co * r), Math.round(cy + si * r))
      hole.push(0.299 * R + 0.587 * G + 0.114 * B)
    }
    for (let r = 16; r <= 24; r++) {
      const [R, G, B] = px(Math.round(cx + co * r), Math.round(cy + si * r))
      const L = 0.299 * R + 0.587 * G + 0.114 * B
      ann.push(L); annN++
      if (R > G && G > B && R - B > 28 && R > 90) bronze++
    }
  }
  hole.sort((a, b) => a - b); ann.sort((a, b) => a - b)
  const med = a => a[Math.floor(a.length / 2)]
  console.log(name.padEnd(10), String(cx).padStart(4), String(cy).padStart(4),
    String(Math.round(hole[0])).padStart(7), String(med(hole)).padStart(7),
    String(Math.round(ann[ann.length - 1])).padStart(7), (bronze / annN).toFixed(2).padStart(10))
}

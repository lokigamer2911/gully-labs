// rings.mjs — find eyelet rings: dark hole + bronze annulus, geometric scoring
import { loadImage, createCanvas } from '@napi-rs/canvas'

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

function score(cx, cy) {
  // interior darkness (hole)
  let inSum = 0, inN = 0
  for (let a = 0; a < 360; a += 30) {
    const x = Math.round(cx + Math.cos(a * Math.PI / 180) * 5)
    const y = Math.round(cy + Math.sin(a * Math.PI / 180) * 5)
    if (x < 0 || y < 0 || x >= W || y >= H) return 0
    const [r, gg, b] = px(x, y)
    inSum += Math.max(r, gg, b); inN++
  }
  const inDark = inSum / inN
  // annulus bronze quality at radius R
  let good = 0, tot = 0
  for (let R = 13; R <= 21; R += 2) for (let a = 0; a < 360; a += 15) {
    const x = Math.round(cx + Math.cos(a * Math.PI / 180) * R)
    const y = Math.round(cy + Math.sin(a * Math.PI / 180) * R)
    if (x < 0 || y < 0 || x >= W || y >= H) continue
    const [r, gg, b] = px(x, y)
    tot++
    if (b < 75 && r - b > 28 && gg > b + 10 && r > gg && r < 210) good++
  }
  const ann = tot ? good / tot : 0
  return (inDark < 70 ? (70 - inDark) / 70 : 0) * 0.5 + ann * 0.5
}

// scan grid, keep local maxima above threshold
const cands = []
for (let y = 1000; y <= 1330; y += 4) {
  for (let x = 790; x <= 1550; x += 4) {
    const s = score(x, y)
    if (s > 0.62) cands.push({ x, y, s: +s.toFixed(2) })
  }
}
// non-max suppression (rings ~45px apart)
cands.sort((a, b) => b.s - a.s)
const keep = []
for (const cd of cands) {
  if (keep.every(k => Math.hypot(k.x - cd.x, k.y - cd.y) > 34)) keep.push(cd)
}
console.log(JSON.stringify(keep))

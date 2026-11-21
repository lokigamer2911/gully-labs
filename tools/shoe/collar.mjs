// collar.mjs — per-column cream-collar runs in collar zone + tongue zone
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const RGB = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }
// cream terry/linen: bright, warm (r-b>=14), not too saturated
const isCream = ([r, gg, b]) => r > 150 && gg > 140 && b > 118 && r - b >= 14 && r - b < 75 && r - gg < 45
const isBg = ([r, gg, b]) => r > 205 && gg > 203 && b > 198 && r - b < 14

console.log('=== collar zone x330-770, y930-1140: cream runs per column ===')
for (let x = 330; x <= 770; x += 20) {
  const runs = []
  let start = -1
  for (let y = 930; y <= 1140; y++) {
    const px = RGB(x, y)
    const cr = isCream(px) && !isBg(px)
    if (cr && start < 0) start = y
    if (!cr && start >= 0) { if (y - start >= 6) runs.push([start, y - 1]); start = -1 }
  }
  if (start >= 0) runs.push([start, 1140])
  console.log(`x=${x} runs=${JSON.stringify(runs)}`)
}
console.log('=== tongue zone x700-970, y830-1040: cream runs per column ===')
for (let x = 700; x <= 970; x += 20) {
  const runs = []
  let start = -1
  for (let y = 830; y <= 1040; y++) {
    const px = RGB(x, y)
    const cr = isCream(px) && !isBg(px)
    if (cr && start < 0) start = y
    if (!cr && start >= 0) { if (y - start >= 6) runs.push([start, y - 1]); start = -1 }
  }
  if (start >= 0) runs.push([start, 1040])
  console.log(`x=${x} runs=${JSON.stringify(runs)}`)
}
console.log('=== tongue zone rows y840-1030 step20: cream x-extent ===')
for (let y = 840; y <= 1030; y += 20) {
  let x0 = -1, x1 = -1, s = -1
  const runs = []
  for (let x = 660; x <= 1000; x++) {
    const px = RGB(x, y)
    const cr = isCream(px) && !isBg(px)
    if (cr && s < 0) s = x
    if (!cr && s >= 0) { if (x - s >= 8) runs.push([s, x - 1]); s = -1 }
  }
  if (s >= 0) runs.push([s, 1000])
  console.log(`y=${y} runs=${JSON.stringify(runs)}`)
}

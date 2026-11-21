// solebottom.mjs — full bottom silhouette of shoe (strict neutral-bg test)
import { loadImage, createCanvas } from '@napi-rs/canvas'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }
const isBg = ([r, gg, b]) => {
  const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b)
  return mx - mn < 14 && (r + gg + b) / 3 > 212   // neutral bright paper
}
const pts = []
for (let x = 300; x <= 1720; x += 20) {
  let bottom = -1
  for (let y = H - 100; y > 1300; y--) {
    if (!isBg(px(x, y))) { bottom = y; break }
  }
  pts.push([x, bottom])
}
console.log(JSON.stringify(pts))

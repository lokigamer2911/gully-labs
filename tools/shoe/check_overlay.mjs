// check_overlay.mjs — count green/cyan pixels in verify_sole.png
import { loadImage, createCanvas } from '@napi-rs/canvas'
const f = process.argv[2] || 'verify_sole.png'
const img = await loadImage(f)
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const d = g.getImageData(0, 0, img.width, img.height).data
let green = 0, cyan = 0
const gx = [], gy = []
for (let y = 0; y < img.height; y += 2) {
  for (let x = 0; x < img.width; x += 2) {
    const i = (y * img.width + x) * 4
    const [r, gg, b] = [d[i], d[i + 1], d[i + 2]]
    if (gg > 200 && r < 120 && b < 100) { green++; if (gx.length < 5) { gx.push(x); gy.push(y) } }
    if (b > 180 && gg > 150 && r < 100) cyan++
  }
}
console.log(`${f}: ${img.width}x${img.height} green=${green} cyan=${cyan} firstGreen=(${gx},${gy})`)

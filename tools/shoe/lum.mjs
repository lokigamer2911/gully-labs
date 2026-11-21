// lum.mjs — luminance ASCII of a region to see lace ribbon structure
import { loadImage, createCanvas } from '@napi-rs/canvas'
const [x0, y0, w, h, step] = process.argv.slice(2, 7).map(Number)
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const lum = (x, y) => { const i = (y * W + x) * 4; return Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) }
const ramp = ' .:-=+*#%@'
let head = '     '
for (let x = x0; x <= x0 + w; x += step) head += (x % (step * 10) === 0 ? '|' : ' ')
console.log(head)
for (let y = y0; y <= y0 + h; y += step) {
  let row = String(y).padStart(4) + ' '
  for (let x = x0; x <= x0 + w; x += step) {
    const L = lum(x, y)
    row += ramp[Math.min(9, Math.floor(L / 26))]
  }
  console.log(row)
}

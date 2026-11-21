// crop.mjs — render a zoomed region of sneaker-ref.jpg with a coordinate grid
// usage: node crop.mjs x y w h scale [step] [outfile]
import { loadImage, createCanvas } from '@napi-rs/canvas'

const [x, y, w, h, scale, stepArg, outArg] = process.argv.slice(2)
const cx = Number(x), cy = Number(y), cw = Number(w), ch = Number(h)
const s = Number(scale || 2), step = Number(stepArg || 50)
const out = outArg || 'crop.png'

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(Math.round(cw * s), Math.round(ch * s))
const g = c.getContext('2d')
g.imageSmoothingEnabled = false
g.drawImage(img, cx, cy, cw, ch, 0, 0, c.width, c.height)

g.save()
g.scale(s, s)
g.translate(-cx, -cy)
g.strokeStyle = 'rgba(0,180,255,0.45)'
g.fillStyle = 'rgba(0,140,255,0.95)'
g.font = '14px sans-serif'
g.lineWidth = 1 / s
for (let i = Math.floor(cx / step) * step; i <= cx + cw; i += step) {
  g.beginPath(); g.moveTo(i, cy); g.lineTo(i, cy + ch); g.stroke()
  if (i % (step * 2) === 0) g.fillText(String(i), i + 3, cy + 16)
}
for (let i = Math.floor(cy / step) * step; i <= cy + ch; i += step) {
  g.beginPath(); g.moveTo(cx, i); g.lineTo(cx + cw, i); g.stroke()
  if (i % (step * 2) === 0) g.fillText(String(i), cx + 3, i + 15)
}
g.restore()

const { writeFileSync } = await import('node:fs')
writeFileSync(out, c.toBuffer('image/png'))
console.log(`wrote ${out} (${c.width}x${c.height}) region ${cx},${cy} ${cw}x${ch} @${s}`)

// ringmap.mjs — fine ASCII of eyestay: G=gold ring, k=dark hole, l=lace, c=cream, b=brown, .=bg
import { loadImage, createCanvas } from '@napi-rs/canvas'

const [x, y, w, h, colsArg] = process.argv.slice(2).map(Number)
const x0 = x, y0 = y, w0 = w, h0 = h
const cols = colsArg || 160

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data

const cls = (r, gg, b) => {
  const mx = Math.max(r, gg, b)
  if (r > 205 && gg > 205 && b > 198) return '.'
  if (mx < 64) return 'k'
  if (r > 150 && r - gg > 22 && r - b > 58 && gg - b > 32 && b < 145) return 'G'
  if (r > 175 && gg > 165 && b > 145) return 'c'
  if (r > 135 && r - b < 62 && gg > b && r > gg) return 'l'
  if (r > gg && gg > b) return 'b'
  return '?'
}

const rows = Math.max(1, Math.round((h0 / w0) * cols * 0.5))
const cw = w0 / cols, ch = h0 / rows
let out = `region ${x0},${y0} ${w0}x${h0} cols=${cols} cell=${cw.toFixed(1)}x${ch.toFixed(1)}\n`
out += '      ' + Array.from({ length: cols }, (_, i) => {
  const sx = Math.round(x0 + i * cw)
  return sx % 100 === 0 ? String(Math.floor(sx / 100) % 10) : ' '
}).join('') + '\n'
for (let r = 0; r < rows; r++) {
  const sy = Math.round(y0 + r * ch + ch / 2)
  let line = ''
  for (let cc = 0; cc < cols; cc++) {
    const sx = Math.min(W - 1, Math.round(x0 + cc * cw + cw / 2))
    const yy = Math.min(H - 1, sy)
    const i = (yy * W + sx) * 4
    line += cls(d[i], d[i + 1], d[i + 2])
  }
  out += String(sy).padStart(5) + ' ' + line + '\n'
}
console.log(out)

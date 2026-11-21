// dump.mjs — ASCII colour-class map of a region of sneaker-ref.jpg
// usage: node dump.mjs x y w h [cols]
// classes: .=paper bg, k=dark, G=brass/gold, c=cream, R=red/maroon, l=lace(light brown), b=brown, ?=other
import { loadImage, createCanvas } from '@napi-rs/canvas'

const [x, y, w, h, colsArg] = process.argv.slice(2).map(Number)
const cols = colsArg || 128

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data

const cls = (r, gg, b) => {
  const mx = Math.max(r, gg, b)
  if (r > 200 && gg > 197 && b > 190 && mx - Math.min(r, gg, b) < 42) return '.'
  if (mx < 62) return 'k'
  if (r > 118 && r - b > 52 && gg - b > 28 && b < 150 && r < 246) return 'G'
  if (r > 170 && gg > 158 && b > 135 && mx - Math.min(r, gg, b) < 55) return 'c'
  if (r - gg > 62 && r - b > 60 && r > 85) return 'R'
  if (r > 130 && r - gg < 70 && gg > b && r > b + 18) return 'l'
  if (r > gg && gg > b) return 'b'
  return '?'
}

const rows = Math.max(1, Math.round((h / w) * cols * 0.5))
const cw = w / cols, ch = h / rows
let out = `${x},${y} ${w}x${h} cols=${cols} cell=${cw.toFixed(1)}x${ch.toFixed(1)}\n`
out += '      ' + Array.from({ length: cols }, (_, i) => {
  const sx = Math.round(x + i * cw)
  return sx % 100 === 0 ? String(Math.floor(sx / 100) % 10) : ' '
}).join('') + '\n'
for (let r = 0; r < rows; r++) {
  const sy = Math.min(H - 1, Math.round(y + r * ch + ch / 2))
  let line = ''
  for (let cc = 0; cc < cols; cc++) {
    const sx = Math.min(W - 1, Math.round(x + cc * cw + cw / 2))
    const i = (sy * W + sx) * 4
    line += cls(d[i], d[i + 1], d[i + 2])
  }
  out += String(sy).padStart(5) + ' ' + line + '\n'
}
console.log(out)

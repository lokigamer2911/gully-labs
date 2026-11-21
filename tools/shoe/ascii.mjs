// ascii.mjs — colour-class grid view of a region (reliable, no image display needed)
// usage: node ascii.mjs [x y w h] [cols]
// classes: '.'=paper bg  'c'=cream  'b'=brown canvas  'k'=dark  'R'=maroon/red
//          'G'=gold/brass  'B'=blue  'l'=lace(light brown)  's'=shadow
import { loadImage, createCanvas } from '@napi-rs/canvas'

const args = process.argv.slice(2).map(Number)
const [x, y, w, h] = args.length >= 4 ? args : [0, 0, 2000, 2000]
const cols = args.length >= 5 ? args[4] : 100

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data

const classify = (r, gg, b) => {
  const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b)
  if (r > 205 && gg > 205 && b > 198 && mx - mn < 40) return mx - mn < 14 && b > 200 ? ' ' : '.' // paper bg
  if (r > 175 && gg > 165 && b > 145 && r - b < 60) return 'c' // cream/white
  if (r - gg > 38 && b > gg && r > 60 && r < 185 && gg < 100) return 'R' // maroon/red
  if (r > 150 && gg > 118 && gg > b + 18 && r >= gg && b < 160) return 'G' // brass/gold
  if (b > r + 35) return 'B' // blue
  if (mx < 70) return 'k' // near-black
  if (r > gg && gg > b) {
    if (r - b < 45 && r > 120) return 'l' // light warm brown (lace/edge)
    if (mx < 130) return 's' // dark brown shadow
    return 'b' // brown canvas
  }
  return '?'
}

const rows = Math.round((h / w) * cols * 0.5) // terminal cells ~2:1
const cw = w / cols, ch = h / rows
let out = `region ${x},${y} ${w}x${h}  cols=${cols}\n`
const header = '     ' + Array.from({ length: cols }, (_, i) => {
  const sx = Math.round(x + i * cw)
  return (sx % 200 === 0 && sx % 1000 < cw) ? '|' : (sx % 100 === 0 && sx % 500 < cw ? '+' : ' ')
}).join('')
out += header + '\n'
for (let r = 0; r < rows; r++) {
  const sy = Math.round(y + r * ch)
  let line = ''
  for (let cc = 0; cc < cols; cc++) {
    // sample cell centre (2x2 avg)
    const sx = Math.round(x + cc * cw + cw / 2)
    const yy = Math.min(H - 1, Math.round(y + r * ch + ch / 2))
    const xx = Math.min(W - 1, sx)
    const i = (yy * W + xx) * 4
    line += classify(d[i], d[i + 1], d[i + 2])
  }
  out += String(sy).padStart(4) + ' ' + line + '\n'
}
console.log(out)

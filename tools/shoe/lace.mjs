// lace.mjs — sample colors along lace/upper/tongue, then ASCII-classify throat
import { loadImage, createCanvas } from '@napi-rs/canvas'

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width
const d = g.getImageData(0, 0, W, img.height).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

// probe known-ish lace spots (display coords from throat.png: orig=700+dx/2.6, 830+dy/2.6)
console.log('--- spot samples ---')
const spots = [
  ['lace1', 815, 926], ['lace2', 860, 940], ['lace3', 950, 970],
  ['lace4', 830, 1000], ['lace5', 980, 1030], ['lace6', 760, 950],
  ['upper', 900, 1100], ['upper2', 1000, 1130], ['tongue', 900, 860],
  ['interior', 850, 890], ['cream', 760, 1060]
]
for (const [n, x, y] of spots) console.log(n, x, y, px(x, y).join(','))

// classify grid over throat
console.log('--- ascii region 700,830 340x320 step10 ---')
const cls = (r, gg, b) => {
  const lum = 0.299 * r + 0.587 * gg + 0.114 * b
  if (lum < 62) return 'D'            // dark interior/shadow
  if (r > 175 && gg > 158 && b > 128 && Math.max(r, gg, b) - Math.min(r, gg, b) < 70) return 'C' // cream
  if (r > gg && gg > b && lum > 95 && lum < 175 && r - b > 45) return 'L' // mid brown = lace-ish
  return 'U'
}
let head = '     '
for (let x = 700; x <= 1040; x += 10) head += (x % 50 === 0 ? '|' : ' ')
console.log(head)
for (let y = 830; y <= 1150; y += 10) {
  let row = String(y).padStart(4) + ' '
  for (let x = 700; x <= 1040; x += 10) row += cls(...px(x, y))
  console.log(row)
}

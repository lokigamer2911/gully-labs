// sole.mjs — per-column silhouette bottom + sole top edge scan
import { loadImage, createCanvas } from '@napi-rs/canvas'

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(img.width, img.height)
const g = c.getContext('2d')
g.drawImage(img, 0, 0)
const W = img.width, H = img.height
const d = g.getImageData(0, 0, W, H).data
const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]] }

// sample row of pixels below shoe to see shadow gradient
console.log('--- bg/shadow samples (y) ---')
for (const y of [1560, 1590, 1620, 1650, 1700]) {
  const row = [500, 700, 900, 1100, 1300, 1500].map(x => `${x}:${px(x, y).join(',')}`)
  console.log(y, row.join('  '))
}

// per column: bottom silhouette (last y where pixel differs from local bg), sole top (cream band start)
console.log('--- column scan ---')
for (let x = 320; x <= 1700; x += 40) {
  // bottom: scan from y=1700 up, find first pixel that's clearly shoe/shadow-free-bg
  let bottom = -1
  for (let y = 1720; y > 1300; y--) {
    const [r, gg, b] = px(x, y)
    if (Math.abs(r - 235) + Math.abs(gg - 234) + Math.abs(b - 230) > 42) { bottom = y; break }
  }
  // sole top: from bottom going up, while cream-ish; find first y where dark-ish (upper) begins
  let soleTop = -1, bottomSole = -1
  if (bottom > 0) {
    bottomSole = bottom
    for (let y = bottom; y > bottom - 320 && y > 800; y--) {
      const [r, gg, b] = px(x, y)
      const cream = r > 168 && gg > 156 && b > 132 && Math.max(r, gg, b) - Math.min(r, gg, b) < 58
      if (!cream) {
        // confirm: next 10px up should be upper (not cream)
        let ok = true
        for (let k = 1; k <= 10; k++) {
          const [r2, g2, b2] = px(x, y - k)
          const cr2 = r2 > 168 && g2 > 156 && b2 > 132 && Math.max(r2, g2, b2) - Math.min(r2, g2, b2) < 58
          if (cr2) { ok = false; break }
        }
        if (ok) { soleTop = y; break }
      }
    }
  }
  console.log(`x=${x} bottom=${bottom} soleTop=${soleTop}`)
}

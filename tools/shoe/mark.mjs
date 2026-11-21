// mark.mjs — draw markers (circles/points/polygons) over a region of sneaker-ref.jpg
// usage: node mark.mjs x y w h scale outfile marks.json
// marks.json: [{x,y,r,label,color}] circles, or [{pts:[[x,y]...],label,color}] polygons
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { writeFileSync, readFileSync } from 'node:fs'

const [x, y, w, h, scale, out, marksFile] = process.argv.slice(2)
const cx = Number(x), cy = Number(y), cw = Number(w), ch = Number(h), s = Number(scale)
const marks = JSON.parse(readFileSync(marksFile, 'utf8'))

const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(Math.round(cw * s), Math.round(ch * s))
const g = c.getContext('2d')
g.drawImage(img, cx, cy, cw, ch, 0, 0, c.width, c.height)

g.save()
g.scale(s, s)
g.translate(-cx, -cy)
// grid every 100px
g.strokeStyle = 'rgba(0,160,255,0.4)'
g.fillStyle = 'rgba(0,120,255,0.95)'
g.font = '15px sans-serif'
g.lineWidth = 1 / s
for (let i = Math.floor(cx / 100) * 100; i <= cx + cw; i += 100) {
  g.beginPath(); g.moveTo(i, cy); g.lineTo(i, cy + ch); g.stroke()
  g.fillText(String(i), i + 3, cy + 16)
}
for (let i = Math.floor(cy / 100) * 100; i <= cy + ch; i += 100) {
  g.beginPath(); g.moveTo(cx, i); g.lineTo(cx + cw, i); g.stroke()
  g.fillText(String(i), cx + 3, i + 15)
}
for (const m of marks) {
  const col = m.color || 'lime'
  g.strokeStyle = col
  g.fillStyle = col
  g.lineWidth = 2 / s
  if (m.pts) {
    g.beginPath()
    m.pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py))
    g.closePath()
    g.stroke()
    if (m.fill) { g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1 }
  } else {
    g.beginPath(); g.arc(m.x, m.y, m.r || 20, 0, Math.PI * 2); g.stroke()
    g.beginPath(); g.moveTo(m.x - 6, m.y); g.lineTo(m.x + 6, m.y); g.moveTo(m.x, m.y - 6); g.lineTo(m.x, m.y + 6); g.stroke()
  }
  if (m.label) g.fillText(m.label, (m.x || m.pts[0][0]) + (m.r || 0) + 3, (m.y || m.pts[0][1]) - (m.r || 0))
}
g.restore()

writeFileSync(out, c.toBuffer('image/png'))
console.log(`wrote ${out} (${c.width}x${c.height}) region ${cx},${cy} ${cw}x${ch} @${s}`)

// marker test: draw region center X + text so we can verify what's actually in the PNG
import { loadImage, createCanvas } from '@napi-rs/canvas'
const cx = Number(process.argv[2]), cy = Number(process.argv[3])
const cw = Number(process.argv[4]), ch = Number(process.argv[5])
const s = Number(process.argv[6] || 2)
const out = process.argv[7] || 'marker.png'
const img = await loadImage('sneaker-ref.jpg')
const c = createCanvas(Math.round(cw * s), Math.round(ch * s))
const g = c.getContext('2d')
g.drawImage(img, cx, cy, cw, ch, 0, 0, c.width, c.height)
// red X at region centre
g.strokeStyle = 'red'; g.lineWidth = 12
const mx = (cw / 2) * s, my = (ch / 2) * s
g.beginPath(); g.moveTo(mx - 80, my - 80); g.lineTo(mx + 80, my + 80)
g.moveTo(mx + 80, my - 80); g.lineTo(mx - 80, my + 80); g.stroke()
g.fillStyle = 'red'; g.font = 'bold 64px sans-serif'
g.fillText(`X:${cx},${cy}`, 30, 80)
const { writeFileSync } = await import('node:fs')
writeFileSync(out, c.toBuffer('image/png'))
console.log(`wrote ${out} ${c.width}x${c.height} marker at centre ${cx + cw / 2},${cy + ch / 2}`)

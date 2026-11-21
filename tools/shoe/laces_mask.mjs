// laces_mask.mjs — build lace ribbon masks from throat color analysis
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { RINGS, RING_R } from './build.mjs'
import { writeFileSync } from 'node:fs'

// From collar.mjs and earlier analysis, lace ribbons are mid-brown (r > g > b, lum 95-175)
// They run roughly vertically from y~940 to y~1060, spanning certain x ranges
// 6 lace ribbons from earlier lace classifier data

// Lace ribbon polygons (approximate centers from scan4 hits + visual):
// Lace 1: leftmost, x~770-820
// Lace 2: x~810-860  
// Lace 3: x~870-930
// Lace 4: x~940-990
// Lace 5: x~1000-1060
// Lace 6: x~1070-1130

// Each ribbon goes from ~y940 to ~y1060, slightly flared at ends
const laceRibbons = [
  // Ribbon 1: leftmost
  [[770, 940], [820, 940], [820, 1060], [770, 1060]],
  // Ribbon 2
  [[810, 945], [865, 945], [865, 1055], [810, 1055]],
  // Ribbon 3
  [[875, 950], [930, 950], [930, 1050], [875, 1050]],
  // Ribbon 4
  [[945, 955], [995, 955], [995, 1045], [945, 1045]],
  // Ribbon 5
  [[1005, 960], [1060, 960], [1060, 1040], [1005, 1040]],
  // Ribbon 6: rightmost under eyelets
  [[1075, 965], [1130, 965], [1130, 1035], [1075, 1035]]
]

// Flatten into a single polygon (tracing outer edge then inner edge reverse)
const lacePoly = []
laceRibbons.forEach((rib, i) => {
  // outer path
  rib.forEach(([x, y], j) => j ? lacePoly.push([x, y]) : null)
  // connect to next ribbon's outer (bottom right to next left bottom)
  if (i < laceRibbons.length - 1) {
    const next = laceRibbons[i + 1]
    lacePoly.push([next[1][0], next[1][1]]) // next bottom-left
    lacePoly.push([next[0][0], next[0][1]]) // next top-left
  }
})
// Close the far end
const last = laceRibbons[laceRibbons.length - 1]
lacePoly.push([last[0][0], last[0][1]]) // top left of last
lacePoly.push([last[1][0], last[1][1]]) // bottom left of last

// Generate verify image
const c = createCanvas(2000, 2000)
const g = c.getContext('2d')
const img = await loadImage('sneaker-ref.jpg')
g.drawImage(img, 0, 0)

// Draw laces in yellow
g.save()
g.beginPath()
lacePoly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
g.closePath()
g.strokeStyle = '#FFFF00'
g.lineWidth = 3
g.stroke()

// Draw rings for context
g.strokeStyle = '#FF00FF'
g.lineWidth = 3
for (const [cx, cy] of RINGS) { g.beginPath(); g.arc(cx, cy, RING_R, 0, Math.PI * 2); g.stroke() }
g.restore()

writeFileSync('laces_verify.png', await c.encode('png'))
console.log('wrote laces_verify.png')
console.log(`lacePoly has ${lacePoly.length} vertices`)

// Export
const d = lacePoly.map(([x, y]) => `${x},${y}`).join(' ')
writeFileSync('lace_path.txt', d)
console.log('wrote lace_path.txt')
console.log(d.substring(0, 100) + '...')
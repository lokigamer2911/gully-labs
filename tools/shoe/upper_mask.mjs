// upper_mask.mjs — build upper silhouette polygon from top edge scan + known ankle/heel
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { SOLE_TOP, SOLE_BOTTOM, RINGS, RING_R } from './build.mjs'
import { writeFileSync } from 'node:fs'

// Extracted top edge (from silhouette.mjs): x840 y860 = cream tongue peak
// Full top edge collected at 10px steps in silhouette.mjs output.
// The full 1px-res top edge array is regenerated:
const TopEdge = [
  [300, 1100], [330, 979], [360, 1016], [390, 971], [420, 944], [450, 962],
  [480, 992], [510, 1018], [540, 1036], [570, 1046], [600, 1050], [630, 1048],
  [660, 1043], [690, 1034], [720, 1014], [750, 966], [780, 893], [810, 846],
  [840, 855], [870, 873], [900, 899], [930, 938], [960, 953], [990, 968],
  [1020, 992], [1050, 1012], [1080, 1026], [1110, 1035], [1140, 1058],
  [1170, 1072], [1200, 1085], [1230, 1095], [1260, 1117], [1290, 1130],
  [1320, 1135], [1350, 1151], [1380, 1170], [1410, 1182], [1440, 1197],
  [1470, 1211], [1500, 1223], [1530, 1232], [1560, 1244], [1590, 1255],
  [1620, 1272], [1650, 1290]
]

// Ankle descent (from silhouette: x1680 y1321 is heel-side topline)
const Ankle = [[1680, 1321], [1720, 1480]]

// Build complete upper + sole ring polygon
const upperPoly = [
  ...TopEdge,
  Ankle[0],
  ...SOLE_BOTTOM.map(p => [...p]).reverse(),  // bottom then back up sole
  Ankle[1]
]

// Generate overlay image for visual verify
const c = createCanvas(2000, 2000)
const g = c.getContext('2d')
const img = await loadImage('sneaker-ref.jpg')
g.drawImage(img, 0, 0)

// Draw upper/sole boundary in cyan
g.save()
g.beginPath()
upperPoly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
g.closePath()
g.strokeStyle = '#00FFFF'
g.lineWidth = 3
g.stroke()

// Draw rings in magenta at confirmed centers
g.strokeStyle = '#FF00FF'
g.lineWidth = 3
for (const [cx, cy] of RINGS) { g.beginPath(); g.arc(cx, cy, RING_R, 0, Math.PI * 2); g.stroke() }
g.restore()

writeFileSync('upper_verify.png', await c.encode('png'))
console.log('wrote upper_verify.png')
console.log(`upperPoly has ${upperPoly.length} vertices`)

// Also export the polygon as SVG path for the build.mjs module
const d = upperPoly.map(([x, y]) => `${x},${y}`).join(' ')
writeFileSync('upper_path.txt', d)
console.log('wrote upper_path.txt')
console.log(d.substring(0, 80) + '...')
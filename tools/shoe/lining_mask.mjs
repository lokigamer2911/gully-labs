// lining_mask.mjs — build lining + collar + tongue polygons
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { RINGS, RING_R } from './build.mjs'
import { writeFileSync } from 'node:fs'

// From collar.mjs data: cream runs per column in collar zone (x330-770, y930-1140)
// Key points from the data:
// - collar outer edge points (from earlier diag/known): (338,975), (545,1090), (690,1118), (745,1112)
// - tongue cream runs per column x700-970 at y840-1030 steps

// Construct lining polygon: starts at inner ankle, goes up collar front, around back, down other side, under tongue, back to ankle
// The lining is the "dark interior" visible between upper and sole/chain/laces

// From top edge data, ankle zone begins at x~1680 y~1321
// Collar outer vertices (from collar zone): (338,975) → (545,1090) → (690,1118) → (745,1112)
// But these are outer edges — lining follows inner edge at about y+12 offset roughly

// Simpler: lining = all pixels that are cream/light but not upper, not sole, not eyelet area.
// Numerically: a polygon that traces the "interior" from the lace zone inward.

// Let me just compute a reasonable lining polygon from the column-run data:
// The key zones are:
// 1. Collar: y ~940-1120 roughly between x 330-770
// 2. Tongue: y ~840-950 roughly between x 700-900

// Lacing hole zone: between x 790-1120 roughly, y 930-1050

// Construct a simple lining polygon that goes:
// ankle -> up left collar inner -> across collar top -> down right collar inner -> 
// under tongue to inner ankle -> back to ankle

const ankleIn = [1650, 1450]  // inner ankle, slightly inside outer

// Collar inner: offset ~15px inward from outer
const collarInner = [
  [350, 985],   // left collar inner (was 338,975 + 12 inward)
  [540, 1100],  // center collar inner
  [680, 1128],  // right collar inner (was 690,1118 + offset)
  [740, 1122]   // heel-side collar inner (was 745,1112)
]

// Tongue inner (under laces): roughly x 720-880, y 860-940
const tongueInner = [
  [720, 865],   // tongue-inner left
  [880, 865],   // tongue-inner right
  [880, 940],   // back of tongue
  [720, 940]    // front of tongue
]

// Lacing gap: between lace rows
const laceGap = [
  [790, 950],   // left lace gap entry
  [1120, 950],  // right lace gap entry
  [1120, 1030], // along lace row
  [790, 1030]   // back to left
]

// Complete lining polygon
const liningPoly = [
  ankleIn,                    // 0: inner ankle
  ...collarInner,             // 1-4: collar inner
  [740, 1110],               // 5: down right collar inner to near lace zone
  ...laceGap,                // 6-9: lace gap
  [790, 1030],               // 6b back to collar side
  ...tongueInner,            // 10-13: tongue inner
  ankleIn                    // close
]

// Generate verify image
const c = createCanvas(2000, 2000)
const g = c.getContext('2d')
const img = await loadImage('sneaker-ref.jpg')
g.drawImage(img, 0, 0)

// Draw lining in magenta
g.save()
g.beginPath()
liningPoly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
g.closePath()
g.strokeStyle = '#FF00FF'
g.lineWidth = 3
g.stroke()

// Draw rings for context
g.strokeStyle = '#FFAA00'
g.lineWidth = 3
for (const [cx, cy] of RINGS) { g.beginPath(); g.arc(cx, cy, RING_R, 0, Math.PI * 2); g.stroke() }
g.restore()

writeFileSync('lining_verify.png', await c.encode('png'))
console.log('wrote lining_verify.png')
console.log(`liningPoly has ${liningPoly.length} vertices`)

// Export path
const d = liningPoly.map(([x, y]) => `${x},${y}`).join(' ')
writeFileSync('lining_path.txt', d)
console.log('wrote lining_path.txt')
console.log(d.substring(0, 80) + '...')
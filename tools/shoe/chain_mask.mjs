// chain_mask.mjs — build chain path mask from brass detection
import { loadImage, createCanvas } from '@napi-rs/canvas'
import { RINGS, RING_R } from './build.mjs'
import { writeFileSync } from 'node:fs'

// From earlier analysis: chain centerline (315,1080)→(345,1180)→(480,1255)→(610,1277)→(725,1255)→(775,1230)
// Attachment ring ≈(811,1162) r~42 (but our rings are r=22)
// The chain is brass-colored, tight path descending from heel

// Chain vertices from the documented centerline + bell bottoms
// The chain wraps around the heel attachment and hangs down
const chainPath = [
  // From heel upward to ankle connection
  [315, 1080],   // start at heel base
  [345, 1180],   // first segment
  [480, 1255],   // down along heel
  [610, 1277],   // across heel base
  [725, 1255],   // up other side
  [775, 1230],   // toward attachment ring
  [811, 1162],   // attachment ring center (confirmed far-row ring)
  // Then the chain hangs as bells downward
  [850, 1280],   // bell 1
  [890, 1380],   // bell 2  
  [930, 1480],   // bell 3
  [970, 1550],   // bell 4 (bottom)
]

// Generate verify image
const c = createCanvas(2000, 2000)
const g = c.getContext('2d')
const img = await loadImage('sneaker-ref.jpg')
g.drawImage(img, 0, 0)

// Draw chain in orange
g.save()
g.beginPath()
chainPath.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
g.closePath()
g.strokeStyle = '#FFAA00'
g.lineWidth = 4
g.stroke()

// Draw rings for context
g.strokeStyle = '#FF00FF'
g.lineWidth = 3
for (const [cx, cy] of RINGS) { g.beginPath(); g.arc(cx, cy, RING_R, 0, Math.PI * 2); g.stroke() }
g.restore()

writeFileSync('chain_verify.png', await c.encode('png'))
console.log('wrote chain_verify.png')
console.log(`chainPath has ${chainPath.length} vertices`)

// Export
const d = chainPath.map(([x, y]) => `${x},${y}`).join(' ')
writeFileSync('chain_path.txt', d)
console.log('wrote chain_path.txt')
console.log(d.join(' '))
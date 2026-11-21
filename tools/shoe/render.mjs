// render.mjs — render a single frame at time t into a 1920×1080 canvas
// Uses the constants from build.mjs + canvas + ffmpeg-encoded PNG sequence
import { createCanvas } from '@napi-rs/canvas'
import { writeFileSync } from 'node:fs'
import { RINGS, RING_R, SOLE_POLY, LINING_POLY, LACE_POLY, CHAIN_PATH, U, COBALT, PAPER, INK } from './build.mjs'

const W = 1920, H = 1080
const c = createCanvas(W, H)
const g = c.getContext('2d')

// Background paper
g.fillStyle = PAPER
g.fillRect(0, 0, W, H)

// Camera: slightly top-down, dolly/tilt based on timeline
// t in [0, 7] seconds
export function renderFrame(t) {
  // Normalize t to 0-1 across the 7s, then apply eased segments
  let phase, progress
  if (t < 1) {
    // 0-1s: assembled (camera locked, no motion)
    phase = 'assemble'
    progress = t / 1
  } else if (t < 4.5) {
    // 1-4.5s: separate (parts slide apart along diagonal axis)
    const sepT = (t - 1) / 3.5 // 0->1 across separation
    phase = 'separate'
    progress = sepT
    // Apply diagonal slide: each part moves down-left by progress*u * part_index factor
    // For now, just camera key: deep focus keeps whole shoe in focus
  } else {
    // 4.5-7s: hold then reassemble
    if (t < 5) {
      // 4.5-5s hold
      phase = 'hold-begin'
      progress = 0
    } else if (t < 6.5) {
      // 5-6.5s reassemble (reverse stagger)
      const reT = (t - 5) / 1.0 // 0->1
      phase = 'reassemble'
      progress = 1 - reT // reverse
    } else {
      // 6.5-7s final hold
      phase = 'hold-end'
      progress = 1
    }
  }

  // Fill background with warm matte
  g.fillStyle = '#EFECE5'
  g.globalAlpha = 1

  // Draw sole (brown canvas + cream cupsole silhouette)
  g.save()
  g.beginPath()
  SOLE_POLY.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
  g.closePath()

  // Sole base color: warm brown-ish
  g.fillStyle = '#A67C50'
  g.fill()

  // Sole stitch lines in subtle darker brown
  g.strokeStyle = '#8a6a48'
  g.lineWidth = 1
  g.stroke()

  // Draw rings at their per-frame positions
  if (phase === 'separate' || phase === 'reassemble') {
    // Rings slide apart/reassemble with staggered starts
    // Per decision: explosion axis 32° down-left, positions (i-2.5)*u
    // Staggered starts: 1.0s + i×0.28s, duration 1.1s
    // Return reverse: 5.0+(5-i)×0.1s, duration 1.0s
    const explosionPhase = progress // 0->1
    const slideDuration = 1.1

    for (let i = 0; i < RINGS.length; i++) {
      const [cx, cy] = RINGS[i]
      let offsetX = 0, offsetY = 0

      if (explosionPhase <= slideDuration) {
        // Outward slide: part i moves from (cx,cy) along axis 32°
        // by distance (i-2.5)*u * explosionPhase/slideDuration
        const partOffset = (i - 2.5) * U
        const angleRad = (32 * Math.PI) / 180
        offsetX = Math.cos(angleRad) * partOffset * explosionPhase / slideDuration
        offsetY = Math.sin(angleRad) * partOffset * explosionPhase / slideDuration
      } else {
        // Return phase - keep rings at original positions
      }

      const fx = cx + offsetX
      const fy = cy + offsetY

      // Draw ring
      g.save()
      g.translate(fx, fy)
      g.strokeStyle = '#00E5FF'
      g.lineWidth = 3
      g.beginPath()
      g.arc(0, 0, RING_R, 0, Math.PI * 2)
      g.stroke()
      g.restore()
    }
  }

  // Draw lace polygons (static except during separate phase)
  g.save()
  g.strokeStyle = '#FFAA00'
  g.lineWidth = 2
  g.beginPath()
  if (LACE_POLY) {
    LACE_POLY.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
  }
  g.closePath()
  g.stroke()
  g.restore()

  // Draw chain path
  g.save()
  g.strokeStyle = '#FFAA00'
  g.lineWidth = 3
  g.beginPath()
  if (CHAIN_PATH) {
    CHAIN_PATH.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
  }
  g.closePath()
  g.stroke()
  g.restore()

  // Film grain pass (added later in ffmpeg or canvas composite)
  // subtle grain overlay

  // Return PNG data URL
  return c.encode('png')
}

// Render all 210 frames (7s × 30fps) and write PNGs
if (process.argv[2] === 'render-all') {
  const totalFrames = 210
  const outdir = process.argv[3] || './frames'
  ;(async () => {
    for (let frame = 0; frame < totalFrames; frame++) {
      const t = frame / 30 // 0 to 7 seconds
      const png = renderFrame(t)
      const buf = await png
      writeFileSync(`${outdir}/frame_${String(frame + 1).padStart(3, '0')}.png`, buf)
      if ((frame + 1) % 30 === 0) console.log(`Rendered ${frame + 1}/${totalFrames}s=${((frame + 1) / 30).toFixed(1)}s`)
    }
    console.log(`All ${totalFrames} frames written to ${outdir}/`)
  })()
}

// Single frame debug output
if (process.argv[2] === 'debug') {
  const t = parseFloat(process.argv[3]) || 0
  const png = renderFrame(t)
  const buf = await png
  writeFileSync('debug_frame.png', buf)
  console.log(`Rendered frame at t=${t}s`)
  process.exit(0)
}
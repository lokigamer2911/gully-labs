import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)

const tree = await page.evaluate(() => {
  const stage = document.querySelector('[data-hero-stage]')
  const rows = []
  const walk = (el, depth) => {
    if (!el || depth > 5) return
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    rows.push({
      depth,
      tag: el.tagName,
      cls: String(el.className).slice(0, 60),
      rect: `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}`,
      position: cs.position,
      height: cs.height,
      inline: el.getAttribute('style')?.slice(0, 90) ?? '',
    })
    ;[...el.children].forEach((c) => walk(c, depth + 1))
  }
  walk(stage, 0)
  return rows
})
console.log(JSON.stringify(tree, null, 2))

// Now force a resize and see whether the canvas recovers.
await page.setViewportSize({ width: 391, height: 845 })
await page.waitForTimeout(1200)
const after = await page.evaluate(() => {
  const c = document.querySelector('[data-hero-stage] canvas')
  const r = c.getBoundingClientRect()
  return { rect: `${Math.round(r.width)}x${Math.round(r.height)}`, attr: `${c.width}x${c.height}`, inline: c.getAttribute('style') }
})
console.log('AFTER RESIZE', JSON.stringify(after))
await browser.close()

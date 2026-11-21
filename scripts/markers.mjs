import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
const section = page.locator('#specimen')
await section.scrollIntoViewIfNeeded()
await page.waitForTimeout(3000)

const data = await section.evaluate((el) => {
  const canvas = el.querySelector('canvas')
  const cb = canvas.getBoundingClientRect()
  const overlay = el.querySelector('div.pointer-events-none')
  const ob = overlay?.getBoundingClientRect()
  const buttons = [...el.querySelectorAll('div.pointer-events-none button[aria-pressed]')]
  return {
    canvas: { x: Math.round(cb.x), y: Math.round(cb.y), w: Math.round(cb.width), h: Math.round(cb.height) },
    overlay: ob ? { x: Math.round(ob.x), y: Math.round(ob.y), w: Math.round(ob.width), h: Math.round(ob.height) } : null,
    canvasAttr: `${canvas.width}x${canvas.height}`,
    markers: buttons.map((b) => {
      const dot = b.firstElementChild.getBoundingClientRect()
      return {
        transform: b.style.transform,
        dotX: Math.round(dot.x + dot.width / 2),
        dotY: Math.round(dot.y + dot.height / 2),
      }
    }),
  }
})
console.log(JSON.stringify(data, null, 2))
await browser.close()

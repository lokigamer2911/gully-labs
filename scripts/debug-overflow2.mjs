import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true })
await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const offenders = await page.evaluate(() => {
  const doc = document.documentElement
  const results = []
  const walk = (el) => {
    if (!el) return
    if (el === doc) { Array.from(el.children || []).forEach(walk); return }
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const pos = cs.position
    if (pos === 'absolute' || pos === 'fixed' || pos === 'relative') {
      const right = r.left + r.width
      const over = right - doc.clientWidth
      if (over > 1) {
        results.push({
          tag: el.tagName,
          cls: String(el.className).slice(0, 60),
          pos,
          w: Math.round(r.width),
          left: Math.round(r.left),
          right: Math.round(right),
          overflow: Math.round(over),
        })
      }
    }
    Array.from(el.children).forEach(walk)
  }
  walk(document.body)
  return results.slice(0, 15)
})
console.log(JSON.stringify(offenders, null, 2))
await page.screenshot({ path: '.qa/debug-overflow2.png', fullPage: true })
await browser.close()

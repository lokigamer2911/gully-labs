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
    if (r.width > 0 && r.height > 0 && r.left + r.width > doc.clientWidth + 1) {
      const right = r.left + r.width
      results.push({
        tag: el.tagName,
        txt: (el.textContent ?? '').trim().slice(0, 50),
        cls: String(el.className).slice(0, 60),
        w: Math.round(r.width),
        left: Math.round(r.left),
        right: Math.round(right),
        overflow: Math.round(right - doc.clientWidth),
        id: el.id ?? '',
        href: el.getAttribute?.('href') ?? '',
      })
    }
    Array.from(el.children || []).forEach(walk)
  }
  walk(doc.body)
  return results
})
console.log(JSON.stringify(offenders, null, 2))
await page.screenshot({ path: '.qa/debug-overflow3.png', fullPage: true })
await browser.close()

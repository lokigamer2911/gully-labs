import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true })
await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const overflow = await page.evaluate(() => {
  const doc = document.documentElement
  const overflowX = doc.scrollWidth - doc.clientWidth
  
  // Find elements wider than viewport
  const offenders = []
  const walk = (el) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.width > doc.clientWidth + 1) {
      offenders.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 50),
        w: Math.round(r.width),
        x: Math.round(r.x),
        overflow: Math.round(r.width - doc.clientWidth),
      })
    }
    Array.from(el.children).forEach(walk)
  }
  walk(doc.body)
  
  return { overflowX, clientWidth: doc.clientWidth, scrollWidth: doc.scrollWidth, offenders: offenders.slice(0, 10) }
})
console.log(JSON.stringify(overflow, null, 2))
await page.screenshot({ path: '.qa/debug-overflow.png', fullPage: true })
await browser.close()

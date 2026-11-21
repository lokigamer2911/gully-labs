import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true })
await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)

const info = await page.evaluate(() => {
  const doc = document.documentElement
  const body = document.body
  return {
    docScrollWidth: doc.scrollWidth,
    docClientWidth: doc.clientWidth,
    docOverflowX: doc.scrollWidth - doc.clientWidth,
    bodyScrollWidth: body.scrollWidth,
    bodyClientWidth: body.clientWidth,
    bodyOverflowX: body.scrollWidth - body.clientWidth,
    computedOverflowX: getComputedStyle(doc).overflowX,
    computedBodyOverflowX: getComputedStyle(body).overflowX,
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()

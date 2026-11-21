import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const info = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(img => {
    const r = img.getBoundingClientRect()
    const cs = getComputedStyle(img)
    return {
      src: img.src,
      alt: img.alt,
      loading: img.loading,
      w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.x), y: Math.round(r.y),
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
    }
  })
  const sections = [...document.querySelectorAll('section')].map(s => s.id)
  return { sections, imgs }
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: '.qa/debug-home.png', fullPage: true })
await browser.close()

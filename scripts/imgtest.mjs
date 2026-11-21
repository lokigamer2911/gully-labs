import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })

const results = await page.evaluate(async () => {
  const files = ['/img/gati-beige-700.webp', '/img/oud-brown-1400.webp', '/img/aandhi-kobicha-700.webp']
  const out = []
  for (const f of files) {
    out.push(
      await new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ f, ok: true, w: img.naturalWidth })
        img.onerror = (e) => resolve({ f, ok: false, err: String(e) })
        img.src = f
      }),
    )
  }
  return out
})
console.log(JSON.stringify(results))

// Scroll the whole page to force every lazy image, then count failures.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, document.body.scrollHeight)
})
await page.waitForTimeout(2500)

const broken = await page.evaluate(() =>
  [...document.images]
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.currentSrc || i.src),
)
console.log('REALLY BROKEN:', JSON.stringify(broken))
await browser.close()

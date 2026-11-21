import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

const broken = await page.evaluate(() =>
  [...document.images]
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, cls: i.className })),
)
console.log('BROKEN:', JSON.stringify(broken, null, 2))

const info = await page.evaluate(() => {
  const hero = document.querySelector('#top')
  const stage = document.querySelector('[data-hero-stage] canvas')
  return {
    heroHeight: hero?.getBoundingClientRect().height,
    viewport: window.innerHeight,
    stageBox: stage?.getBoundingClientRect(),
    canvasCount: document.querySelectorAll('canvas').length,
    docHeight: document.documentElement.scrollHeight,
  }
})
console.log('INFO:', JSON.stringify(info, null, 2))
await browser.close()

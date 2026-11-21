import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const outDir = '.qa'
mkdirSync(outDir, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900, dpr: 1 },
  { name: 'tablet', width: 1024, height: 768, dpr: 1 },
  { name: 'mobile', width: 390, height: 844, dpr: 2 },
]

const browser = await chromium.launch()
const problems = []

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.name === 'mobile',
    hasTouch: vp.name === 'mobile',
  })
  const page = await context.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`[${vp.name}] console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`[${vp.name}] pageerror: ${err.message}`))

  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4500)

  await page.screenshot({ path: `${outDir}/${vp.name}-hero.png` })
  await page.screenshot({ path: `${outDir}/${vp.name}-full.png`, fullPage: true })

  // Section-by-section captures so layout problems are easy to spot.
  for (const id of ['brand', 'specimen', 'craft', 'collections']) {
    const el = page.locator(`#${id}`)
    if (!(await el.count())) continue
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${outDir}/${vp.name}-${id}.png` })
  }

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      height: doc.scrollHeight,
      canvases: document.querySelectorAll('canvas').length,
      imagesBroken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
    }
  })
  console.log(vp.name, JSON.stringify(metrics))
  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    problems.push(`[${vp.name}] horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`)
  }
  await context.close()
}

await browser.close()
console.log(problems.length ? problems.join('\n') : 'NO CONSOLE ERRORS / OVERFLOW')

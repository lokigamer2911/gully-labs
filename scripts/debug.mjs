import { chromium } from 'playwright'

const browser = await chromium.launch()

// --- contrast debug on desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  const dbg = await page.evaluate(() => {
    const out = []
    const pick = (sel, label) => {
      const el = document.querySelector(sel)
      if (!el) return out.push({ label, missing: true })
      const cs = getComputedStyle(el)
      let node = el
      const chain = []
      while (node && chain.length < 6) {
        const bg = getComputedStyle(node).backgroundColor
        if (bg && bg !== 'rgba(0, 0, 0, 0)') chain.push(`${node.tagName}.${String(node.className).slice(0, 28)} => ${bg}`)
        node = node.parentElement
      }
      out.push({ label, color: cs.color, chain })
    }
    pick('header a.spec', 'nav link')
    pick('#specimen .spec', 'fig label')
    return out
  })
  console.log('CONTRAST DEBUG', JSON.stringify(dbg, null, 2))
  await page.close()
}

// --- mobile hero geometry
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  const geo = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: cs.display,
        position: cs.position,
        minH: cs.minHeight,
      }
    }
    return {
      viewport: { w: innerWidth, h: innerHeight },
      hero: pick('#top'),
      h1: pick('#top h1'),
      stage: pick('[data-hero-stage]'),
      canvas: pick('[data-hero-stage] canvas'),
      cta: pick('[data-hero-cta]'),
      wrapper: pick('#top > div:nth-of-type(3)'),
    }
  })
  console.log('MOBILE HERO GEO', JSON.stringify(geo, null, 2))
  await page.close()
}

await browser.close()

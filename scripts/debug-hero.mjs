import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const info = await page.evaluate(() => {
  const hero = document.querySelector('section#top')
  if (!hero) return { error: 'no hero section' }
  const imgs = [...hero.querySelectorAll('img')].map(img => {
    const r = img.getBoundingClientRect()
    const cs = getComputedStyle(img)
    return {
      src: img.src,
      alt: img.alt,
      loading: img.loading,
      complete: img.complete,
      w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.x), y: Math.round(r.y),
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
    }
  })
  const figs = [...hero.querySelectorAll('figure')].map(f => {
    const r = f.getBoundingClientRect()
    const cs = getComputedStyle(f)
    return { w: Math.round(r.width), h: Math.round(r.height), display: cs.display, position: cs.position, aspectRatio: cs.aspectRatio }
  })
  const cols = [...hero.querySelectorAll('div')].filter(d => d.className.includes('flex-1') && d.className.includes('relative')).map(d => {
    const r = d.getBoundingClientRect()
    return { w: Math.round(r.width), h: Math.round(r.height), cls: String(d.className).slice(0, 60) }
  })
  return { heroClasses: String(hero.className).slice(0, 100), heroRect: { w: Math.round(hero.getBoundingClientRect().width), h: Math.round(hero.getBoundingClientRect().height) }, imgs, figs, cols }
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: '.qa/debug-hero.png', fullPage: true })
await browser.close()

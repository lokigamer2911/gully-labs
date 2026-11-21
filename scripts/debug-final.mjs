import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)

// Check hero visibility
const hero = await page.evaluate(() => {
  const section = document.querySelector('section#top')
  if (!section) return 'no section'
  const imgs = [...section.querySelectorAll('img')].map(img => {
    const r = img.getBoundingClientRect()
    const cs = getComputedStyle(img)
    return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), opacity: cs.opacity, visible: r.width > 0 && r.height > 0 }
  })
  const txt = (section.textContent ?? '').trim().slice(0, 200)
  return { txt, imgs }
})
console.log('HERO', JSON.stringify(hero, null, 2))

// Full page text to verify structure
const allText = await page.evaluate(() => {
  const texts = []
  document.querySelectorAll('h1, h2, h3, section').forEach(el => {
    const t = (el.textContent ?? '').trim()
    if (t) texts.push(`${el.tagName}#${el.id ?? ''}: ${t.slice(0, 80)}`)
  })
  return texts
})
console.log('PAGE STRUCTURE')
allText.forEach(t => console.log(' ', t))

await page.screenshot({ path: '.qa/debug-final.png', fullPage: true })
await browser.close()

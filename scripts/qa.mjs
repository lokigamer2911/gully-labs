import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:5174'
const outDir = '.qa'
mkdirSync(outDir, { recursive: true })

const problems = []
const notes = []

function fail(message) {
  problems.push(message)
}

const browser = await chromium.launch()

async function boot(page) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  return errors
}

async function analysePng(page, buffer) {
  return page.evaluate(async (b64) => {
    const res = await fetch(`data:image/png;base64,${b64}`)
    const bmp = await createImageBitmap(await res.blob())
    const canvas = document.createElement('canvas')
    canvas.width = bmp.width
    canvas.height = bmp.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let n = 0
    let sr = 0
    let sg = 0
    let sb = 0
    let clum = 0
    let clum2 = 0
    let cn = 0
    const w = canvas.width
    const h = canvas.height
    const cx0 = Math.floor(w * 0.3)
    const cx1 = Math.ceil(w * 0.7)
    const cy0 = Math.floor(h * 0.28)
    const cy1 = Math.ceil(h * 0.72)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const bl = data[i + 2]
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * bl
      sr += r
      sg += g
      sb += bl
      const x = (i / 4) % w
      const y = Math.floor(i / 4 / w)
      if (x >= cx0 && x < cx1 && y >= cy0 && y < cy1) {
        clum += l
        clum2 += l * l
        cn++
      }
      n++
    }
    const mean = (sr + sg + sb) / (3 * n)
    return {
      width: w,
      height: h,
      meanRGB: [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)],
      meanLum: Math.round(mean * 10) / 10,
      centreMeanLum: cn ? Math.round((clum / cn) * 10) / 10 : null,
    }
  }, buffer.toString('base64'))
}

// ---------------------------------------------------------------- desktop pass
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const errors = await boot(page)

  const layout = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      overflowX: doc.scrollWidth - doc.clientWidth,
      anchors: [...document.querySelectorAll('a[href]')].map((a) => ({
        href: a.getAttribute('href'),
        text: (a.textContent ?? '').trim().slice(0, 30),
      })),
      documentHeight: doc.scrollHeight,
    }
  })

  if (layout.overflowX > 1) fail(`desktop: horizontal overflow ${layout.overflowX}px`)
  const ids = await page.evaluate(() => [...document.querySelectorAll('[id]')].map((n) => n.id))
  for (const a of layout.anchors) {
    const href = a.href ?? ''
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.includes(href.slice(1))) {
        fail(`desktop: dead in-page link ${href} (${a.text})`)
      }
    } else if (!/^https:\/\//.test(href)) {
      fail(`desktop: unexpected href "${href}" (${a.text})`)
    }
  }
  notes.push(`desktop: ${layout.anchors.length} links, document ${layout.documentHeight}px tall`)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(2500)
  const heroCheck = await page.evaluate(() => {
    const img = document.querySelector('#top img')
    if (!img) return { found: false }
    const r = img.getBoundingClientRect()
    const cs = getComputedStyle(img)
    return {
      found: true,
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.x),
      y: Math.round(r.y),
      opacity: cs.opacity,
      visible: r.width > 0 && r.height > 0,
    }
  })
  if (!heroCheck.found) {
    fail('desktop: hero image missing')
  } else if (!heroCheck.visible) {
    fail(`desktop: hero image not visible (${heroCheck.w}x${heroCheck.h} @${heroCheck.x},${heroCheck.y})`)
  } else {
    const shot = await page.locator('#top img').first().screenshot()
    const px = await analysePng(page, shot)
    if (px.centreMeanLum == null || px.centreMeanLum < 5) {
      fail(`desktop: hero image looks blank (centre lum ${px.centreMeanLum})`)
    }
    notes.push(
      `desktop: hero image ${heroCheck.w}x${heroCheck.h} centre lum ${px.centreMeanLum} meanRGB ${px.meanRGB.join(',')}`,
    )
  }

  const cta = page.locator('a[href*="gullylabs.com/products"]').first()
  if (!(await cta.count())) fail('desktop: product deep-link CTA missing')
  else {
    const href = await cta.getAttribute('href')
    notes.push(`desktop: product CTA -> ${href}`)
  }

  for (const e of errors) fail(`desktop console: ${e}`)
  await page.screenshot({ path: `${outDir}/desktop.png`, fullPage: true })
  await context.close()
}

// ---------------------------------------------------------------- tablet + mobile
for (const vp of [
  { name: 'tablet', width: 1024, height: 768, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'mobile-small', width: 360, height: 780, mobile: true },
]) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  })
  const page = await context.newPage()
  const errors = await boot(page)

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      overflowX: doc.scrollWidth - doc.clientWidth,
      canvases: document.querySelectorAll('canvas').length,
    }
  })
  if (metrics.overflowX > 1) fail(`${vp.name}: horizontal overflow ${metrics.overflowX}px`)
  if (metrics.canvases > 0) fail(`${vp.name}: unexpected <canvas> present (3D should be removed)`)

  await page.waitForTimeout(1500)
  const heroCheck = await page.evaluate(() => {
    const img = document.querySelector('#top img')
    if (!img) return { found: false }
    const r = img.getBoundingClientRect()
    const cs = getComputedStyle(img)
    return {
      found: true,
      w: Math.round(r.width),
      h: Math.round(r.height),
      opacity: cs.opacity,
      visible: r.width > 0 && r.height > 0,
    }
  })
  if (!heroCheck.found) {
    fail(`${vp.name}: hero image missing`)
  } else if (!heroCheck.visible) {
    fail(`${vp.name}: hero image not visible (${heroCheck.w}x${heroCheck.h})`)
  } else {
    const shot = await page.locator('#top img').first().screenshot()
    const px = await analysePng(page, shot)
    notes.push(`${vp.name}: hero image ${heroCheck.w}x${heroCheck.h} centre lum ${px.centreMeanLum}`)
    if (px.centreMeanLum == null || px.centreMeanLum < 5) {
      fail(`${vp.name}: hero image looks blank`)
    }
  }

  if (vp.mobile) {
    const small = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('button, a').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) return
        const cs = getComputedStyle(el)
        if (el.tagName === 'A' && cs.display === 'inline') return
        if (r.height < 24 || r.width < 24) {
          out.push({
            text: (el.textContent ?? el.getAttribute('aria-label') ?? '').trim().slice(0, 24),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })
        }
      })
      return out
    })
    notes.push(`${vp.name}: ${small.length} tap targets under 24px`)
    for (const s of small.slice(0, 6)) notes.push(`   ${s.w}x${s.h} "${s.text}"`)

    await page.getByRole('button', { name: /Open menu/ }).click()
    await page.waitForTimeout(900)
    if (!(await page.locator('[role=dialog]').isVisible())) fail(`${vp.name}: mobile menu did not open`)
    await page.screenshot({ path: `${outDir}/${vp.name}-menu.png` })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    if (await page.locator('[role=dialog]').count()) fail(`${vp.name}: menu did not close on Escape`)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${outDir}/${vp.name}-hero.png` })
  await page.screenshot({ path: `${outDir}/${vp.name}-full.png`, fullPage: true })

  for (const id of ['story', 'craft', 'collections', 'closing']) {
    const el = page.locator(`#${id}`)
    if (!(await el.count())) continue
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${outDir}/${vp.name}-${id}.png` })
  }

  for (const e of errors) fail(`${vp.name} console: ${e}`)
  await context.close()
}

// ---------------------------------------------------------------- reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = await boot(page)
  await page.waitForTimeout(1000)
  const motion = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
  if (motion !== 'auto') fail('reduced-motion: scroll-behavior is not auto')
  for (const e of errors) fail(`reduced-motion console: ${e}`)
  await page.screenshot({ path: `${outDir}/reduced-motion.png` })
  notes.push(`reduced-motion: scroll-behavior=${motion}`)
  await context.close()
}

await browser.close()

console.log('\n=== NOTES ===')
console.log(notes.join('\n'))
console.log('\n=== PROBLEMS ===')
console.log(problems.length ? problems.join('\n') : 'none')
process.exitCode = problems.length ? 1 : 0

import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
const specimen = page.locator('#specimen')
await specimen.scrollIntoViewIfNeeded()
await page.waitForTimeout(3000)
const canvas = specimen.locator('canvas').first()

async function rgb(png) {
  return page.evaluate(async (b64) => {
    const res = await fetch(`data:image/png;base64,${b64}`)
    const bmp = await createImageBitmap(await res.blob())
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    return { w: c.width, h: c.height, data: [...ctx.getImageData(0, 0, c.width, c.height).data] }
  }, png.toString('base64'))
}

// Compare colourways: background is identical, so the diff is the shoe only.
const shots = {}
for (const [key, name] of [
  ['oud', /Baaz Oud Brown/],
  ['ebony', /Baaz Ebony Black/],
  ['magic', /Magic Carpet/],
]) {
  await specimen.getByRole('button', { name }).click()
  await page.waitForTimeout(2500)
  shots[key] = await rgb(await canvas.screenshot())
}

function analyse(a, b) {
  const n = a.w * a.h
  let changed = 0
  let diff = 0
  let ar = 0
  let ag = 0
  let ab = 0
  let br = 0
  let bg = 0
  let bb = 0
  for (let i = 0; i < n * 4; i += 4) {
    const d =
      Math.abs(a.data[i] - b.data[i]) +
      Math.abs(a.data[i + 1] - b.data[i + 1]) +
      Math.abs(a.data[i + 2] - b.data[i + 2])
    diff += d / 3
    if (d > 12) {
      changed++
      ar += a.data[i]
      ag += a.data[i + 1]
      ab += a.data[i + 2]
      br += b.data[i]
      bg += b.data[i + 1]
      bb += b.data[i + 2]
    }
  }
  return {
    changedPct: Math.round((changed / n) * 1000) / 10,
    meanAbsDiff: Math.round((diff / n) * 10) / 10,
    aRGB: [ar / changed, ag / changed, ab / changed].map((v) => Math.round(v)),
    bRGB: [br / changed, bg / changed, bb / changed].map((v) => Math.round(v)),
  }
}

console.log('oud vs ebony  ', JSON.stringify(analyse(shots.oud, shots.ebony)))
console.log('oud vs magic  ', JSON.stringify(analyse(shots.oud, shots.magic)))
console.log('ebony vs magic', JSON.stringify(analyse(shots.ebony, shots.magic)))

await browser.close()

import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
const specimen = page.locator('#specimen')
await specimen.scrollIntoViewIfNeeded()
await page.waitForTimeout(3000)

const bgInfo = await specimen.evaluate((el) => {
  const canvas = el.querySelector('canvas')
  const r = canvas.getBoundingClientRect()
  const out = []
  let node = canvas
  while (node && out.length < 6) {
    const cs = getComputedStyle(node)
    out.push({ tag: node.tagName, bg: cs.backgroundColor, cls: String(node.className).slice(0, 50) })
    node = node.parentElement
  }
  return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, chain: out }
})
console.log('BG', JSON.stringify(bgInfo, null, 2))

const canvas = specimen.locator('canvas').first()

function stats(pngBuffer, page) {
  return page.evaluate(async (b64) => {
    const res = await fetch(`data:image/png;base64,${b64}`)
    const bmp = await createImageBitmap(await res.blob())
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    const n = data.length / 4
    let sum = 0
    let sum2 = 0
    let sr = 0
    let sg = 0
    let sb = 0
    let bright = 0
    let br = 0
    let bg = 0
    let bb = 0
    const hist = new Array(8).fill(0)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
      sum += l
      sum2 += l * l
      sr += r
      sg += g
      sb += b
      hist[Math.min(7, Math.floor(l / 32))]++
      if (l > 38) {
        bright++
        br += r
        bg += g
        bb += b
      }
    }
    const mean = sum / n
    return {
      size: `${c.width}x${c.height}`,
      meanRGB: [sr / n, sg / n, sb / n].map((v) => Math.round(v)),
      meanLum: Math.round(mean * 10) / 10,
      sd: Math.round(Math.sqrt(sum2 / n - mean ** 2) * 10) / 10,
      brightPct: Math.round((bright / n) * 1000) / 10,
      brightRGB: [br / bright, bg / bright, bb / bright].map((v) => Math.round(v)),
      hist: hist.map((v) => Math.round((v / n) * 1000) / 10),
    }
  }, pngBuffer.toString('base64'))
}

for (const name of [/Baaz Oud Brown/, /Baaz Ebony Black/, /Magic Carpet/]) {
  await specimen.getByRole('button', { name }).click()
  await page.waitForTimeout(2500)
  const s = await stats(await canvas.screenshot(), page)
  console.log(String(name), JSON.stringify(s))
}

await browser.close()

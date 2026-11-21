import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
const specimen = page.locator('#specimen')
await specimen.scrollIntoViewIfNeeded()
await page.waitForTimeout(3000)
const canvas = specimen.locator('canvas').first()

async function map(png, label) {
  writeFileSync(`.qa/${label}.png`, png)
  const rows = await page.evaluate(async (b64) => {
    const res = await fetch(`data:image/png;base64,${b64}`)
    const bmp = await createImageBitmap(await res.blob())
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d')
    ctx.drawImage(bmp, 0, 0)
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    const COLS = 64
    const ROWS = 24
    const out = []
    for (let ry = 0; ry < ROWS; ry++) {
      let line = ''
      for (let rx = 0; rx < COLS; rx++) {
        const x0 = Math.floor((rx / COLS) * c.width)
        const x1 = Math.floor(((rx + 1) / COLS) * c.width)
        const y0 = Math.floor((ry / ROWS) * c.height)
        const y1 = Math.floor(((ry + 1) / ROWS) * c.height)
        let sr = 0
        let sg = 0
        let sb = 0
        let n = 0
        for (let y = y0; y < y1; y += 2) {
          for (let x = x0; x < x1; x += 2) {
            const i = (y * c.width + x) * 4
            sr += data[i]
            sg += data[i + 1]
            sb += data[i + 2]
            n++
          }
        }
        const r = sr / n
        const g = sg / n
        const b = sb / n
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
        const ramp = ' .:-=+*#%@'
        const ch = ramp[Math.min(9, Math.floor((l / 255) * 10))]
        const warm = r - b > 14 ? 'r' : b - r > 14 ? 'b' : ch
        line += warm
      }
      out.push(line)
    }
    return out
  }, png.toString('base64'))
  console.log(`\n=== ${label} ===`)
  console.log(rows.join('\n'))
}

for (const name of [/Baaz Oud Brown/, /Baaz Ebony Black/, /Magic Carpet/]) {
  await specimen.getByRole('button', { name }).click()
  await page.waitForTimeout(2500)
  await map(await canvas.screenshot(), `tint-${String(name).replace(/[^a-z]/gi, '')}`)
}

await browser.close()

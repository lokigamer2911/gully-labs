/** Composite cutouts over cobalt to proof the matte. Usage: node tools/proof.mjs name1 name2 ... */
import sharp from 'sharp'

const names = process.argv.slice(2).length ? process.argv.slice(2) : ['oud-brown']
for (const n of names) {
  const img = await sharp(`public/img/cutouts/${n}-1400.webp`).resize({ width: 640 }).toBuffer()
  const meta = await sharp(img).metadata()
  const bg = Buffer.from(
    `<svg width="${meta.width}" height="${meta.height}"><rect width="100%" height="100%" fill="#003bd0"/></svg>`,
  )
  await sharp(bg)
    .composite([{ input: img, blend: 'over' }])
    .png()
    .toFile(`C:/Users/HP/AppData/Local/Temp/opencode/cutcheck-${n}.png`)
  console.log(`proof: cutcheck-${n}.png`)
}

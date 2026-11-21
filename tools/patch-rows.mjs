/** Add verified product-photo bases to indexRows in src/data/products.js. */
import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/data/products.js'
let text = readFileSync(path, 'utf8')

const bases = {
  gl001: '/img/oud-brown',
  gl002: '/img/udaan-blue',
  gl003: '/img/amra-ochre',
  gl004: '/img/suva-green',
  gl005: '/img/maska-yellow',
  collab: '/img/xoloni-orange',
}

for (const [id, base] of Object.entries(bases)) {
  const marker = `id: '${id}',`
  const at = text.indexOf(marker)
  if (at < 0) throw new Error(`missing ${id}`)
  const hrefAt = text.indexOf('href:', at)
  const lineEnd = text.indexOf('\n', hrefAt)
  const insert = `\n    base: '${base}',`
  text = text.slice(0, lineEnd) + insert + text.slice(lineEnd)
}

writeFileSync(path, text)
console.log('indexRows now carry product photo bases')

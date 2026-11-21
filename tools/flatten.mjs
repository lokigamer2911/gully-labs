/**
 * Extract a clean product table from the saved gullylabs.com products.json.
 * Output: name, handle, price, buy tag — matched against local image basenames.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const raw = JSON.parse(
  readFileSync('C:/Users/HP/.local/share/opencode/tool-output/tool_1e5164627001Vf13309ELQ0bZq', 'utf8'),
)

const rows = raw.products.map((p) => {
  const prices = p.variants.map((v) => Number(v.price)).filter((n) => n > 0)
  return {
    title: p.title,
    handle: p.handle,
    price: prices.length ? Math.min(...prices) : null,
    tags: p.tags,
    image: p.images?.[0]?.src ?? null,
  }
})

writeFileSync('tools/products-flat.json', JSON.stringify(rows, null, 2))
for (const r of rows) {
  console.log(
    [r.title, r.handle, r.price ?? '-', r.tags.filter((t) => t !== 'hidden').join('|')].join('  ::  '),
  )
}

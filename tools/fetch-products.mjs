/**
 * Fetch the full live product feed from gullylabs.com and flatten it.
 * Output: tools/products-flat.json (name, handle, price, tags, image, sku prefix)
 */
import { writeFileSync } from 'node:fs'

const res = await fetch('https://gullylabs.com/products.json?limit=250')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const raw = await res.json()

const rows = raw.products.map((p) => {
  const prices = p.variants.map((v) => Number(v.price)).filter((n) => n > 0)
  return {
    title: p.title,
    handle: p.handle,
    price: prices.length ? Math.min(...prices) : null,
    tags: p.tags,
    image: p.images?.[0]?.src ?? null,
    type: p.product_type || null,
    published: p.published_at,
  }
})

writeFileSync('tools/products-flat.json', JSON.stringify(rows, null, 2))
console.log(`products: ${rows.length}`)
for (const r of rows) {
  console.log(
    [r.title, r.handle, r.price ?? '-', r.tags.filter((t) => !['hidden', 'women', 'Men'].includes(t)).join('|')].join('  ::  '),
  )
}

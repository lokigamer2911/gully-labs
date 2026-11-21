/**
 * Real Gully Labs products, traced to the live feed at
 * https://gullylabs.com/products.json (fetched 2026-11-16).
 * Every `href` is the real product page. No invented products, prices or links.
 *
 * Photography: brand product shots (uniform cream background), local copies at
 * public/img/<slug>-{700,1400}.webp and keyed cutouts at public/img/cutouts/.
 */

/** Lines for the price index. `from` = lowest live variant price on that line. */
export const indexRows = [
  {
    id: 'gl001',
    index: '01',
    name: 'Number 001 — Baaz',
    note: 'Crust leather, hand-painted patina',
    from: 4290,
    href: 'https://gullylabs.com/products/gully-number-001-oud-brown',
    base: '/img/oud-brown',
  },
  {
    id: 'gl002',
    index: '02',
    name: 'Number 002 — The Sprinter',
    note: 'Seventy years of Indian running',
    from: 2990,
    href: 'https://gullylabs.com/products/gully-number-005-udaan-blue',
    base: '/img/udaan-blue',
  },
  {
    id: 'gl003',
    index: '03',
    name: 'Number 003',
    note: 'The jutti, rebuilt in full-grain leather',
    from: 5990,
    href: 'https://gullylabs.com/products/gully-number-003-amra-ochre-1',
    base: '/img/amra-ochre',
  },
  {
    id: 'gl004',
    index: '04',
    name: 'Number 004 — Kolhapuri',
    note: 'Hand-stitched toe-ring braid',
    from: 2700,
    href: 'https://gullylabs.com/products/gully-number-004-suva-green',
    base: '/img/suva-green',
  },
  {
    id: 'gl005',
    index: '05',
    name: 'Number 005 — Chappal',
    note: 'Flat, honest, everyday',
    from: 1990,
    href: 'https://gullylabs.com/products/gully-number-005-maska-yellow',
    base: '/img/maska-yellow',
  },
  {
    id: 'collab',
    index: '06',
    name: 'Archive & collaborations',
    note: 'CMF by Nothing · Raga · Aryan Katoch · Nivia',
    from: 1990,
    href: 'https://gullylabs.com/collections/archive',
    base: '/img/xoloni-orange',
  },
]

/** Colourway wall — the blurred perspective carousel. */
export const wall = [
  {
    name: 'Baaz Oud Brown',
    line: 'Number 001',
    price: 9490,
    base: '/img/oud-brown',
    href: 'https://gullylabs.com/products/gully-number-001-oud-brown',
  },
  {
    name: 'Baaz Ebony Black',
    line: 'Number 001',
    price: 8990,
    base: '/img/ebony-black',
    href: 'https://gullylabs.com/products/gully-number-001-ebony-black',
  },
  {
    name: 'Magic Carpet',
    line: 'Number 001',
    price: 4490,
    base: '/img/magic-carpet',
    href: 'https://gullylabs.com/products/gully-number-001-magic-carpet',
  },
  {
    name: 'Udaan Blue',
    line: 'Number 002',
    price: 5490,
    base: '/img/udaan-blue',
    href: 'https://gullylabs.com/products/gully-number-005-udaan-blue',
  },
  {
    name: 'Amra Ochre',
    line: 'Number 003',
    price: 7990,
    base: '/img/amra-ochre',
    href: 'https://gullylabs.com/products/gully-number-003-amra-ochre-1',
  },
  {
    name: 'Suva Green',
    line: 'Number 004',
    price: 3790,
    base: '/img/suva-green',
    href: 'https://gullylabs.com/products/gully-number-004-suva-green',
  },
  {
    name: 'Dvaita Kohl Black',
    line: 'Number 001',
    price: 5990,
    base: '/img/dvaita-kohl',
    href: 'https://gullylabs.com/products/gully-number-001-dvaita-kohl-black-men',
  },
  {
    name: 'Dvaita Calico White',
    line: 'Number 001',
    price: 5990,
    base: '/img/dvaita-calico',
    href: 'https://gullylabs.com/products/gully-number-001-dvaita-calico-white-men',
  },
  {
    name: 'Aangan Blue',
    line: 'Number 002',
    price: 7490,
    base: '/img/aangan-blue',
    href: 'https://gullylabs.com/products/gl002-aangan-blue-1',
  },
  {
    name: 'Loam Java',
    line: 'Number 003',
    price: 7990,
    base: '/img/loam-java',
    href: 'https://gullylabs.com/products/gully-number-003-loam-java',
  },
  {
    name: 'Koyar Black',
    line: 'Number 004',
    price: 2700,
    base: '/img/koyar-black',
    href: 'https://gullylabs.com/products/gully-number-004-koyar-black',
  },
  {
    name: 'Maska Yellow',
    line: 'Number 005',
    price: 1990,
    base: '/img/maska-yellow',
    href: 'https://gullylabs.com/products/gully-number-005-maska-yellow',
  },
  {
    name: 'Kharif Green',
    line: 'Number 001',
    price: 6990,
    base: '/img/kharif-green',
    href: 'https://gullylabs.com/products/gully-number-001-kharif-green',
  },
  {
    name: 'Megh White',
    line: 'Number 001',
    price: 5990,
    base: '/img/megh-white',
    href: 'https://gullylabs.com/products/gully-number-001-megh-white',
  },
  {
    name: 'Buransh Red',
    line: 'X Aryan Katoch',
    price: 5990,
    base: '/img/buransh-red',
    href: 'https://gullylabs.com/products/gl001-buransh-red',
  },
  {
    name: 'Xoloni Orange',
    line: 'X CMF by Nothing',
    price: 5990,
    base: '/img/xoloni-orange',
    href: 'https://gullylabs.com/products/gully-labs-x-cmf-by-nothing-xoloni-orange',
  },
]

/** Cutouts for the tumbling fan. */
export const fanCutouts = [
  { base: '/img/cutouts/oud-brown', name: 'Baaz Oud Brown', rotate: -14, x: -34, y: -6, scale: 1.0 },
  { base: '/img/cutouts/udaan-blue', name: 'Udaan Blue', rotate: 9, x: -12, y: 8, scale: 0.94 },
  { base: '/img/cutouts/magic-carpet', name: 'Magic Carpet', rotate: -4, x: 8, y: -10, scale: 1.04 },
  { base: '/img/cutouts/amra-ochre', name: 'Amra Ochre', rotate: 16, x: 26, y: 4, scale: 0.96 },
  { base: '/img/cutouts/suva-green', name: 'Suva Green', rotate: -20, x: 44, y: 12, scale: 0.88 },
]

/** Workshop timeline — every fact from the brand's own story. */
export const workshop = [
  { when: 'Aug 2023', what: 'Founded in New Delhi' },
  { when: 'Apr 2024', what: 'Workshop opens — Noida Sector-10, six karigars' },
  { when: 'Jan 2025', what: '10,000 sq ft HQ — Noida Sector-4, 50+ karigars' },
]

export const inrFmt = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`

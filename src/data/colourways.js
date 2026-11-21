/**
 * Real Gully Labs colourways. Names, prices and construction copy traced to
 * https://gullylabs.com/products.json (fetched 2026-11-15). Every `href`
 * points at the live product page — there is no simulated cart or checkout.
 *
 * `tint` is keyed by the material role in public/models/sneaker.glb so the 3D
 * specimen can be re-coloured per colourway.
 */
export const colourways = [
  {
    id: 'oud-brown',
    name: 'Baaz Oud Brown',
    shortName: 'Oud Brown',
    price: 9490,
    priceLabel: '₹9,490',
    swatch: '#4a3324',
    tint: {
      body: '#8a5f3d',
      rubber: '#e6dfd0',
      outsole: '#8a5a2b',
      lace: '#efe8d9',
      lining: '#c9b497',
      hardware: '#c8c2b6',
    },
    image: {
      base: '/img/oud-brown',
      alt: 'Gully Number 001 Baaz Oud Brown sneaker',
    },
    href: 'https://gullylabs.com/products/gully-number-001-oud-brown',
    features: [
      'Crust leather, hand-painted then finished to a two-tone patina',
      '3D embroidery on the side in foamy white',
      'Plush PU foam sockliner with a custom coffee-inspired print',
      'Dark honey rubber outsole for traction',
    ],
    layers: [
      {
        id: 'lace',
        label: 'Flat lace',
        detail: 'White flat lace, threaded through brushed nickel eyelets.',
      },
      {
        id: 'hardware',
        label: 'Brushed nickel hardware',
        detail: 'Eyelets and aglets, brushed by hand before lacing.',
      },
      {
        id: 'body',
        label: 'Crust leather upper',
        detail: 'Hand-painted crust leather, finished to a two-tone patina.',
      },
      {
        id: 'lining',
        label: 'Twill lining',
        detail: 'Beige twill and lycra lining for breathability.',
      },
      {
        id: 'rubber',
        label: 'Vulcanised rubber midsole',
        detail: 'Off-white vulcanised rubber, pressed and trimmed by hand.',
      },
      {
        id: 'outsole',
        label: 'Honey gum outsole',
        detail: 'Dark honey gum rubber for grip on wet concrete.',
      },
    ],
  },
  {
    id: 'ebony-black',
    name: 'Baaz Ebony Black',
    shortName: 'Ebony Black',
    price: 8990,
    priceLabel: '₹8,990',
    swatch: '#17181a',
    tint: {
      body: '#3a3b3f',
      rubber: '#e6dfd0',
      outsole: '#8a5a2b',
      lace: '#efe8d9',
      lining: '#c9b497',
      hardware: '#c8c2b6',
    },
    image: {
      base: '/img/ebony-black',
      alt: 'Gully Number 001 Baaz Ebony Black sneaker',
    },
    href: 'https://gullylabs.com/products/gully-number-001-ebony-black',
    features: [
      'Velvety soft suede with a canvas upper',
      '3D embroidery on the side in foamy white',
      'Plush PU foam sockliner with a custom coffee-inspired print',
      'Dark honey rubber outsole for traction',
    ],
    layers: [
      {
        id: 'lace',
        label: 'Flat lace',
        detail: 'White flat lace with brushed nickel hardware.',
      },
      {
        id: 'hardware',
        label: 'Brushed nickel hardware',
        detail: 'Eyelets and aglets, brushed by hand before lacing.',
      },
      {
        id: 'body',
        label: 'Suede and canvas upper',
        detail: 'Velvety suede panel over canvas, cut from the same pattern block.',
      },
      {
        id: 'lining',
        label: 'Twill lining',
        detail: 'Beige twill and lycra lining for breathability.',
      },
      {
        id: 'rubber',
        label: 'Vulcanised rubber midsole',
        detail: 'Off-white vulcanised rubber, pressed and trimmed by hand.',
      },
      {
        id: 'outsole',
        label: 'Honey gum outsole',
        detail: 'Dark honey gum rubber for traction.',
      },
    ],
  },
  {
    id: 'magic-carpet',
    name: 'Magic Carpet',
    shortName: 'Magic Carpet',
    price: 4490,
    priceLabel: '₹4,490',
    swatch: '#d8c7a6',
    tint: {
      body: '#d8c7a6',
      rubber: '#d0c0a8',
      outsole: '#e0d8c8',
      lace: '#f5ebe0',
      lining: '#c2b3a0',
      hardware: '#a8a090',
    },
    image: {
      base: '/img/magic-carpet',
      alt: 'Gully Number 001 Magic Carpet sneaker',
    },
    href: 'https://gullylabs.com/products/gully-number-001-magic-carpet',
    features: [
      'Beige leather and canvas upper with off-white softy detailing',
      'Blue 3D embroidery on the side',
      'Plush PU foam sockliner with a custom carpet-inspired print',
      'Antique white rubber outsole for traction',
    ],
    layers: [
      {
        id: 'lace',
        label: 'Flat lace',
        detail: 'Off-white flat lace.',
      },
      {
        id: 'hardware',
        label: 'Brushed nickel hardware',
        detail: 'Eyelets and aglets, brushed by hand before lacing.',
      },
      {
        id: 'body',
        label: 'Leather and canvas upper',
        detail: 'Beige leather and canvas cut as a single upper.',
      },
      {
        id: 'lining',
        label: 'Twill lining',
        detail: 'Beige twill lining for comfort.',
      },
      {
        id: 'rubber',
        label: 'Antique white rubber midsole',
        detail: 'Off-white rubber midsole, pressed and trimmed by hand.',
      },
      {
        id: 'outsole',
        label: 'Antique white outsole',
        detail: 'Antique white rubber outsole for traction.',
      },
    ],
  },
]

export const heroProduct = colourways[0]

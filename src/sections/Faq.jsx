import { useState } from 'react'
import { site } from '../data/site'
import { cn } from '../lib/cn'

const QA = [
  {
    q: 'Where can I buy a pair?',
    a: 'The real collection lives at gullylabs.com — sneakers, chappals and apparel, with every size run listed on the product page.',
    href: 'https://gullylabs.com/collections/all-shoe',
    link: 'All sneakers',
  },
  {
    q: 'When do drops happen?',
    a: 'Every 60 days. When a drop sells through it moves to the archive — the pair is not made again.',
    href: 'https://gullylabs.com/collections/archive',
    link: 'The Archive',
  },
  {
    q: 'Do pairs restock?',
    a: 'No. Small batches, never repeated — that is the workshop\u2019s answer to fast fashion.',
    href: 'https://gullylabs.com/collections/special-editions',
    link: 'Special editions',
  },
  {
    q: 'How do I care for crust leather?',
    a: 'Wipe with a cloth or soft brush, air-dry naturally and keep away from water — the full care notes ship with every pair.',
    href: 'https://gullylabs.com/policies/refund-policy',
    link: 'Returns & exchanges',
  },
  {
    q: 'Where is the workshop?',
    a: 'Noida — the Sector-10 workshop grew into a 10,000 sq ft Sector-4 HQ with 50+ karigars. Visits run through the store locator.',
    href: 'https://gullylabs.com/pages/find-a-store',
    link: 'Find a store',
  },
]

function Row({ item, index }) {
  const [open, setOpen] = useState(index === 0)
  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-t border-ink/10 last:border-b">
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
      >
        <span className="flex items-baseline gap-5 md:gap-8">
          <span className="spec shrink-0 text-ink/40">{`0${index + 1}`}</span>
          <span className="text-[clamp(1.25rem,3vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-cobalt">
            {item.q}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn('relative h-4 w-4 shrink-0 transition-transform duration-500 ease-precision', open && 'rotate-45')}
        >
          <span className="absolute left-0 top-1/2 h-px w-full bg-ink" />
          <span className="absolute left-1/2 top-0 h-full w-px bg-ink" />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-precision',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pb-8 pl-9 pr-4 md:flex-row md:items-center md:justify-between md:gap-10 md:pl-16">
            <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-ink/70">{item.a}</p>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="spec inline-flex shrink-0 items-center gap-2 border border-ink/20 px-4 py-2.5 text-ink transition-colors duration-300 hover:border-cobalt hover:text-cobalt"
            >
              {item.link}
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Scene 12 — FAQ. "Questions, answered." — real answers, each linking to the
 * matching page on the real store.
 */
export function Faq() {
  return (
    <section id="faq" className="grain relative bg-paper py-28 md:py-40">
      <div className="shell">
        <p className="spec text-ink/50">12 — QUESTIONS</p>
        <h2 className="mt-6 text-[clamp(2.2rem,5vw,4.6rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-ink">
          Questions,
          <br />
          answered.
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {QA.map((item, i) => (
              <Row key={item.q} item={item} index={i} />
            ))}
          </div>

          {/* real product photography, so this beat is never just type */}
          <aside className="lg:col-span-4">
            <div className="border border-ink/10 bg-white/40 p-5">
              <div className="relative overflow-hidden bg-paper">
                <img
                  src="/img/ebony-black-700.webp"
                  width="700"
                  height="700"
                  alt="Gully Number 001 Baaz Ebony Black sneaker"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span className="edge-ticks pointer-events-none absolute inset-3" />
              </div>
              <p className="spec mt-5 text-ink/50">GULLY N°001 · BAAZ</p>
              <p className="mt-2 text-[0.95rem] leading-snug text-ink/80">
                Ebony Black. Velvety suede over canvas, finished by hand in Noida.
              </p>
              <a
                href="https://gullylabs.com/products/gully-number-001-ebony-black"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline spec mt-5 inline-block text-ink hover:text-cobalt"
              >
                See the real pair
              </a>
            </div>
          </aside>
        </div>

        <p className="mt-10 max-w-[52ch] text-ink/55">
          Still curious? The brand&rsquo;s own pages — shipping, returns, terms — are
          linked in the footer, and {site.store} is the source of truth.
        </p>
      </div>
    </section>
  )
}

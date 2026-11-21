import { useRef } from 'react'
import { useScene, stage, countUp, inr } from '../lib/scene'
import { indexRows } from '../data/products'

/**
 * Scene 10 — Index. Every Gully line with its lowest live price, counting up
 * as the row enters — the reference's gold index beat, with honest numbers
 * traced to the live feed and links to the real pages.
 */
export function Index() {
  const counters = useRef([])
  const rows = useRef([])

  const ref = useScene((tl, root) => {
    const rowEls = rows.current.filter(Boolean)
    const counterEls = counters.current.filter(Boolean)

    if (!tl) {
      counterEls.forEach((el, i) => countUp(null, el, indexRows[i].from, { format: inr }))
      rowEls.forEach((el) => (el.style.opacity = '1'))
      return undefined
    }

    tl.fromTo('[data-index-head]', { autoAlpha: 0.8, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0)

    rowEls.forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.8, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.045 }, 0.01 + i * 0.016)
      countUp(tl, counterEls[i], indexRows[i].from, {
        at: 0.2 + i * 0.09,
        duration: 0.14,
        format: inr,
      })
    })

    return undefined
  }, [])

  return (
    <section ref={ref} id="collections" className="relative h-[210vh] bg-paper-2">
      <div className={`${stage} grain flex flex-col justify-center`}>
        <div className="shell w-full">
          <p className="spec text-ink/50">10 — THE INDEX</p>
          <h2 data-index-head className="mt-6 max-w-[18ch] text-[clamp(2.2rem,5vw,4.6rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-ink">
            Across every line, the price is honest.
          </h2>

          <div className="mt-12">
            {indexRows.map((row, i) => (
              <a
                key={row.id}
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => {
                  rows.current[i] = el
                }}
                className="group grid grid-cols-[2rem_2.75rem_1fr_auto] items-center gap-3 border-t border-ink/15 py-5 transition-colors duration-300 last:border-b hover:bg-white/40 md:grid-cols-[3rem_4rem_1fr_1fr_auto] md:gap-8 md:py-7"
              >
                <span className="spec text-ink/40">{`0${i + 1}`}</span>
                <span className="h-11 w-11 overflow-hidden border border-ink/10 bg-white md:h-14 md:w-14">
                  <img
                    src={`${row.base}-700.webp`}
                    alt=""
                    width="140"
                    height="140"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-precision group-hover:scale-110"
                  />
                </span>
                <span>
                  <span className="block text-[clamp(1.05rem,2.4vw,1.7rem)] font-bold uppercase leading-tight tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-cobalt">
                    {row.name}
                  </span>
                  <span className="mt-1 block text-[0.8rem] text-ink/55">{row.note}</span>
                </span>
                <span className="spec hidden text-ink/50 md:block">FROM</span>
                <span
                  ref={(el) => {
                    counters.current[i] = el
                  }}
                  className="text-right font-mono text-[clamp(1.3rem,3vw,2.4rem)] leading-none tracking-[-0.03em] text-ink"
                >
                  {inr(row.from)}
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 max-w-[52ch] text-ink/60">
            Prices are live variant minimums traced from gullylabs.com — no
            discounts invented, no cart simulated. Tap a line to open it on the
            real store.
          </p>
        </div>
      </div>
    </section>
  )
}

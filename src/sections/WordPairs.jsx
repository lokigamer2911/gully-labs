import { useRef } from 'react'
import { useScene, stage } from '../lib/scene'

const PAIRS = [
  ['Mass production', 'Batches of six'],
  ['Seasons', '60-day drops'],
  ['Made anywhere', 'Made in Noida'],
  ['Restocked forever', 'Never repeated'],
  ['Logo-first', 'Craft-first'],
]

/**
 * Scene 8 — Word pairs. The old habit strikes through; the Gully habit
 * writes itself in. Same grammar as the reference's Cart→Position beat,
 * every pairing factual.
 */
export function WordPairs() {
  const rows = useRef([])

  const ref = useScene((tl, root) => {
    const els = rows.current.filter(Boolean)

    if (!tl) {
      els.forEach((el) => (el.style.opacity = '1'))
      return undefined
    }

    els.forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.8, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.04 }, i * 0.018)
      const strike = el.querySelector('[data-strike]')
      if (strike) {
        tl.fromTo(strike, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.05 }, 0.01 + i * 0.018)
      }
      tl.fromTo(el.querySelector('[data-after]'), { opacity: 0.8 }, { opacity: 1, duration: 0.04 }, 0.015 + i * 0.018)
    })

    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[150vh] bg-paper">
      <div className={`${stage} grain flex flex-col justify-center`}>
        {/* real product photography behind the type, kept quiet so the words read */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] opacity-[0.16] md:block">
          <img src="/img/cutouts/ebony-black-1400.webp" alt="" className="absolute right-[-8%] top-[4%] w-[115%]" />
          <img src="/img/cutouts/magic-carpet-1400.webp" alt="" className="absolute bottom-[2%] right-[14%] w-[95%]" />
        </div>

        <div className="shell relative w-full">
          <p className="spec text-ink/50">08 — THE SWAP</p>

          <div className="mt-12 space-y-2 md:space-y-4">
            {PAIRS.map(([before, after], i) => (
              <div
                key={before}
                ref={(el) => {
                  rows.current[i] = el
                }}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/10 py-5 md:py-7"
              >
                <span className="relative inline-block text-[clamp(1.3rem,3.4vw,2.6rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink/35">
                  {before}
                  <span data-strike aria-hidden="true" className="absolute left-0 top-1/2 h-[0.07em] w-full origin-left bg-cobalt" />
                </span>
                <span data-after className="font-serif text-[clamp(1.5rem,3.8vw,3rem)] italic leading-none text-ink">
                  {after}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[44ch] text-ink/60">
            The workshop runs on release days, not seasons — every pair is
            accounted for, numbered, and gone when it&rsquo;s gone.
          </p>
        </div>
      </div>
    </section>
  )
}

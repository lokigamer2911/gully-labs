import { useRef } from 'react'
import { useScene, stage } from '../lib/scene'

const TICKETS = [
  { top: 'Hand-made in Noida', bottom: '50+ karigars on the floor' },
  { top: 'Every 60 days', bottom: 'Never restocked' },
]

/**
 * Scene 13 — Closing. Dark, quiet, sure of itself: the brand's own statement,
 * two honest tickets, and the way out to the real store.
 */
export function Closing() {
  const ref = useScene((tl, root) => {
    if (!tl) {
      root.querySelectorAll('[data-closing]').forEach((el) => (el.style.opacity = '1'))
      return undefined
    }

    tl.fromTo('[data-closing-title]', { autoAlpha: 0.8, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0)
    root.querySelectorAll('[data-closing-ticket]').forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.8, y: 12, rotate: i === 0 ? -1.8 : 1.8 }, { autoAlpha: 1, y: 0, rotate: i === 0 ? -1.5 : 1.5, duration: 0.05 }, 0.02 + i * 0.025)
    })
    tl.fromTo('[data-closing-cta]', { autoAlpha: 0.8 }, { autoAlpha: 1, duration: 0.05 }, 0.07)

    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[160vh] bg-ink">
      <div className={`${stage} grain flex flex-col items-center justify-center text-center`}>
        <img
          src="/img/cutouts/oud-brown-700.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(80vw,760px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        />

        <p data-closing className="spec relative text-white/40">
          13 — CLOSING
        </p>

        <h2
          data-closing-title
          className="relative z-10 mt-8 max-w-[16ch] text-[clamp(2.6rem,7vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-paper"
        >
          From the streets,
          <br />
          into the future.
        </h2>

        <div className="relative z-10 mt-12 flex flex-col items-center gap-4 sm:flex-row">
          {TICKETS.map((ticket) => (
            <div
              key={ticket.top}
              data-closing-ticket
              className="w-[280px] border border-white/15 bg-white/[0.04] px-6 py-5 text-left backdrop-blur-sm"
            >
              <p className="text-[0.95rem] font-bold uppercase tracking-[0.02em] text-paper">{ticket.top}</p>
              <p className="spec mt-2 text-white/50">{ticket.bottom}</p>
            </div>
          ))}
        </div>

        <a
          data-closing-cta
          href="https://gullylabs.com/collections/all-shoe"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative z-10 mt-14 inline-flex items-center gap-4 border border-paper px-8 py-5 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
        >
          <span className="spec">Shop the real collection</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
            <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>

        <p className="spec mt-10 text-white/35">GULLY LABS · NEW DELHI · EST. 2023</p>
      </div>
    </section>
  )
}

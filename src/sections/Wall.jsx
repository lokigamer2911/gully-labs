import { useRef } from 'react'
import gsap from 'gsap'
import { useScene, stage } from '../lib/scene'
import { wall, inrFmt } from '../data/products'

/**
 * Scene 6 — Wall. A perspective corridor of real product cards scrolls
 * sideways with the scroll; the card nearest the centre comes into focus
 * with its caption, the rest fall back into the blur. The reference's
 * "Every card, graded and tracked." moment.
 */
export function Wall() {
  const track = useRef(null)
  const active = useRef(null)

  const ref = useScene((tl, root) => {
    const trackEl = track.current
    const cards = trackEl ? Array.from(trackEl.children) : []
    const caption = root.querySelector('[data-caption]')
    const captionName = root.querySelector('[data-caption-name]')
    const captionLine = root.querySelector('[data-caption-line]')

    if (!tl) {
      if (caption) caption.style.opacity = '1'
      if (trackEl) trackEl.style.transform = 'translateY(-50%)'
      return undefined
    }

    // Hold the track vertically centred for the whole scrub (GSAP owns the
    // transform while it scrubs x).
    gsap.set(trackEl, { yPercent: -50 })

    // Sideways scrub across the whole track.
    tl.to(trackEl, {
      x: () => -(trackEl.scrollWidth - root.clientWidth + 120),
      duration: 1,
    }, 0.08)

    // Depth focus: distance from viewport centre drives scale/blur/opacity.
    const focus = (progress) => {
      const viewportCenter = root.clientWidth / 2
      let best = null
      let bestDist = Infinity
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const dist = Math.abs(center - viewportCenter)
        if (dist < bestDist) {
          bestDist = dist
          best = card
        }
        const t = Math.min(1, dist / (root.clientWidth * 0.42))
        card.style.filter = `blur(${(t * 7).toFixed(2)}px) saturate(${1 - t * 0.35})`
        card.style.opacity = String(1 - t * 0.72)
        card.style.transform = `scale(${1.06 - t * 0.22})`
      })
      if (best && best !== active.current) {
        active.current = best
        const idx = Number(best.dataset.index ?? 0)
        const item = wall[idx]
        if (item && captionName && captionLine) {
          captionName.textContent = item.name
          captionLine.textContent = `${item.line} · ${inrFmt(item.price)}`
        }
      }
    }
    focus(0)
    tl.eventCallback('onUpdate', () => focus(tl.scrollTrigger?.progress ?? 0))

    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[250vh] bg-ink">
      <div className={`${stage} grain flex flex-col justify-between`}>
        <div className="shell pt-28 md:pt-36">
          <p className="spec text-white/50">07 — THE WALL</p>
          <h2 className="text-[clamp(2rem,4.8vw,4.4rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-paper">
            Every pair,
            <br />
            built by hand.
          </h2>
          <p className="spec mt-4 text-white/50">SCROLL — THE WALL MOVES WITH YOU</p>
        </div>

        {/* corridor */}
        <div className="relative flex-1 overflow-hidden" style={{ perspective: '1200px' }}>
          <div
            ref={track}
            className="absolute left-0 top-1/2 flex items-center gap-6 pl-[8vw] pr-[8vw] will-change-transform md:gap-10"
            style={{ transform: 'translateY(-50%)' }}
          >
            {wall.map((item, i) => (
              <a
                key={item.base}
                data-index={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-[62vw] shrink-0 sm:w-[44vw] md:w-[34vw] lg:w-[26vw]"
              >
                <div className="relative overflow-hidden border border-white/10 bg-paper">
                  <img
                    src={`${item.base}-700.webp`}
                    width="700"
                    height="700"
                    alt={`${item.name} — Gully Labs ${item.line}`}
                    loading="lazy"
                    className="block aspect-square w-full object-cover"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-300 group-hover:border-cobalt-light/60"
                />
              </a>
            ))}
          </div>
        </div>

        {/* spotlight caption */}
        <div className="shell pb-10 text-center">
          <div data-caption className="opacity-100">
            <p data-caption-name className="text-[clamp(1.3rem,2.6vw,2.1rem)] font-bold text-paper">
              Baaz Oud Brown
            </p>
            <p data-caption-line className="spec mt-2 text-white/50">
              Number 001 · ₹9,490
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

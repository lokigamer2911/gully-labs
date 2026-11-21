import { useRef } from 'react'
import { useScene, stage } from '../lib/scene'
import { fanCutouts } from '../data/products'

/**
 * Scene 5 — Fan. A diagonal ink plane wipes over the cobalt scene and the
 * real colourway cutouts tumble out of a stack into a fanned hand of cards.
 */
export function Fan() {
  const cards = useRef([])

  const ref = useScene((tl, root) => {
    const els = cards.current.filter(Boolean)

    if (!tl) {
      els.forEach((el, i) => {
        const target = fanCutouts[i]
        if (el && target) {
          el.style.transform = `translate(-50%, -50%) translate(${target.x}%, ${target.y}%) rotate(${target.rotate}deg) scale(${target.scale})`
        }
      })
      return undefined
    }

    // Diagonal wipe: the ink plane settles cleanly without leaving dead scroll space
    tl.fromTo(
      '[data-felt]',
      { yPercent: -18, rotate: -2, scale: 1.05 },
      { yPercent: 0, rotate: 0, scale: 1, duration: 0.16, ease: 'power1.out' },
      0,
    )

    tl.fromTo('[data-fan-head]', { autoAlpha: 0.7, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.02)

    // Cards tumble from a centre stack into the fan early and smoothly
    els.forEach((el, i) => {
      const target = fanCutouts[i]
      tl.fromTo(
        el,
        { xPercent: -50, yPercent: -50, x: '0%', y: '0%', rotate: 0, scale: 0.88, autoAlpha: 0.3 },
        {
          xPercent: -50,
          yPercent: -50,
          x: `${target.x}%`,
          y: `${target.y}%`,
          rotate: target.rotate,
          scale: target.scale,
          autoAlpha: 1,
          duration: 0.32,
          ease: 'power1.out',
        },
        0.1 + i * 0.06,
      )
    })

    tl.fromTo('[data-fan-sub]', { autoAlpha: 0.7 }, { autoAlpha: 1, duration: 0.05 }, 0.15)
    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[160vh] bg-cobalt">
      <div className={`${stage} bg-cobalt`}>
        <div data-felt className="grain absolute inset-0 bg-ink will-change-transform">
          {/* the real bench from the workshop reel — colourways on the bench,
              karigars at the machines behind, dimmed to atmosphere */}
          <img
            src="/img/workshop/bench.webp"
            alt=""
            aria-hidden="true"
            width="1278"
            height="720"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.32, filter: 'brightness(0.7)' }}
          />
          <div className="absolute -top-6 left-0 right-0 h-12 rounded-[100%] bg-ink" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="shell pt-28 md:pt-36">
              <h2 data-fan-head className="text-[clamp(2rem,4.8vw,4.4rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-paper">
                Every colourway,
                <br />
                one bench.
              </h2>
            </div>

            {/* the fan */}
            <div className="relative flex flex-1 items-center justify-center">
              <div className="relative h-[38vh] w-[min(92vw,1100px)]">
                {fanCutouts.map((card, i) => (
                  <img
                    key={card.base}
                    ref={(el) => {
                      cards.current[i] = el
                    }}
                    src={`${card.base}-700.webp`}
                    width="700"
                    height="700"
                    alt={card.name}
                    loading="lazy"
                    className="absolute left-1/2 top-1/2 w-[34%] will-change-transform"
                    style={{ transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 26px 22px rgba(0,0,0,0.45))' }}
                  />
                ))}
              </div>
            </div>

            <div className="shell flex items-end justify-between pb-10">
              <p data-fan-sub className="max-w-[30ch] text-[0.9rem] text-white/60">
                Baaz, Sprinter, Amra, Suva — cut, lasted and painted on the same
                floor, released in different skins.
              </p>
              <span className="spec hidden text-white/50 sm:block">06 — THE FAN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

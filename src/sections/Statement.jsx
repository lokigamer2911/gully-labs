import { useRef } from 'react'
import { useScene, stage, countUp } from '../lib/scene'

/**
 * Scene 9 — Statement. Dark pin: the claim brightens line by line while the
 * real product falls through and over the type, and a mono counter climbs
 * with the scroll — the reference's "tash brings the structure…" beat.
 */
export function Statement() {
  const shoe = useRef(null)
  const counter = useRef(null)

  const ref = useScene((tl, root) => {
    const lines = root.querySelectorAll('[data-line]')

    if (!tl) {
      lines.forEach((el) => (el.style.opacity = '1'))
      countUp(null, counter.current, 50, { format: (v) => String(Math.round(v)).padStart(2, '0') })
      if (shoe.current) shoe.current.style.opacity = '0'
      return undefined
    }

    // Lines of the claim brighten in sequence.
    lines.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0.8 }, { opacity: 1, duration: 0.035 }, i * 0.02)
    })

    // The shoe falls from above, over the text, then continues past it.
    tl.fromTo(
      shoe.current,
      {
        yPercent: -140,
        xPercent: 6,
        rotate: -18,
        autoAlpha: 0,
        filter: 'blur(4px) drop-shadow(0 30px 26px rgba(0,0,0,0.5))',
      },
      {
        yPercent: -6,
        xPercent: 0,
        rotate: -3,
        autoAlpha: 1,
        filter: 'blur(0px) drop-shadow(0 44px 34px rgba(0,0,0,0.5))',
        duration: 0.3,
        ease: 'power1.in',
      },
      0.06,
    ).to(
      shoe.current,
      {
        yPercent: 140,
        rotate: 14,
        autoAlpha: 0,
        filter: 'blur(5px) drop-shadow(0 30px 26px rgba(0,0,0,0.5))',
        duration: 0.28,
        ease: 'power1.in',
      },
      0.48,
    )

    countUp(tl, counter.current, 50, { from: 0, at: 0.12, duration: 0.36, format: (v) => String(Math.round(v)).padStart(2, '0') })

    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[180vh] bg-ink">
      <div className={`${stage} grain flex items-center justify-center`}>
        <div className="shell relative z-10 pt-20">
          <p className="spec text-white/40">09 — THE CLAIM</p>
          <h2 className="mt-8 max-w-[20ch] text-center text-[clamp(2.4rem,6vw,5.6rem)] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-white">
            <span data-line className="block">
              Gully Labs brings
            </span>
            <span data-line className="block">
              the discipline of craft
            </span>
            <span data-line className="block">
              to Indian sneakers.
            </span>
          </h2>
        </div>

        {/* falling product — wrapper is centred, GSAP moves the inner node */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[min(52vw,420px)] -translate-x-1/2 -translate-y-1/2"
        >
          <img
            ref={shoe}
            src="/img/cutouts/oud-brown-700.webp"
            width="700"
            height="700"
            alt=""
            loading="lazy"
            className="w-full will-change-transform"
            style={{ filter: 'drop-shadow(0 40px 30px rgba(0,0,0,0.5))' }}
          />
        </div>

        {/* counter */}
        <div className="absolute bottom-10 right-5 z-10 text-right sm:right-10">
          <p className="spec text-white/50">KARIGARS ON THE FLOOR</p>
          <p
            ref={counter}
            className="mt-2 font-mono text-[clamp(2.6rem,6vw,5rem)] leading-none tracking-[-0.04em] text-paper"
          >
            00
          </p>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { useScene, stage, inr } from '../lib/scene'

const CALLOUTS = [
  { label: 'Hand-painted crust leather', anchor: { x: 27, y: 34 }, side: 'right' },
  { label: 'Vulcanised rubber midsole', anchor: { x: 22, y: 58 }, side: 'left' },
  { label: 'Dark honey gum outsole', anchor: { x: 34, y: 66 }, side: 'left' },
]

/**
 * Scene 3 — Annotation. The price lands huge beside the product and drawn
 * lines reach out to three real construction details, the reference's
 * "$550K / POP 124 · PSA 10" beat told with Gully facts.
 */
export function Annotation() {
  const lineRefs = useRef([])

  const ref = useScene((tl, root) => {
    const lines = lineRefs.current.filter(Boolean)

    if (!tl) {
      lines.forEach((path) => {
        if (path) path.style.strokeDashoffset = '0'
      })
      return undefined
    }

    // Price lands, then the callouts draw themselves toward the shoe.
    tl.fromTo('[data-price]', { autoAlpha: 0.8, y: 16, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.07 }, 0)
      .fromTo('[data-price-sub]', { autoAlpha: 0.8 }, { autoAlpha: 1, duration: 0.04 }, 0.03)

    lines.forEach((path, i) => {
      const len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`
      tl.to(path, { strokeDashoffset: 0, duration: 0.12 }, 0.15 + i * 0.05)
    })

    root.querySelectorAll('[data-callout]').forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.8 }, { autoAlpha: 1, duration: 0.04 }, 0.06 + i * 0.014)
    })

    return undefined
  }, [])

  return (
    <section ref={ref} className="relative h-[170vh] bg-paper">
      <div className={`${stage} grain flex items-center`}>
        <div className="shell grid w-full items-center gap-8 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* product with drawn callouts */}
          <div className="order-2 md:order-1 md:col-span-7">
            <div className="relative mx-auto w-[min(86vw,660px)] md:w-full">
              <img
                src="/img/cutouts/oud-brown-1400.webp"
                srcSet="/img/cutouts/oud-brown-700.webp 700w, /img/cutouts/oud-brown-1400.webp 1400w"
                sizes="(min-width: 768px) 55vw, 86vw"
                width="1400"
                height="1400"
                alt="Baaz Oud Brown with construction callouts"
                loading="lazy"
                className="mx-auto w-full max-h-[48vh] md:max-h-[58vh] object-contain"
                style={{ filter: 'drop-shadow(0 40px 30px rgba(11,11,11,0.16))' }}
              />
              {/* hand-drawn leader lines (tablet & desktop) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 hidden h-full w-full md:block"
              >
                {CALLOUTS.map((c, i) => (
                  <path
                    key={c.label}
                    ref={(el) => {
                      lineRefs.current[i] = el
                    }}
                    d={
                      c.side === 'right'
                        ? `M ${c.anchor.x} ${c.anchor.y} L ${c.anchor.x - 6} ${c.anchor.y - 4} L -2 ${c.anchor.y - 10}`
                        : `M ${c.anchor.x} ${c.anchor.y} L ${c.anchor.x + 7} ${c.anchor.y + 5} L 102 ${c.anchor.y + 8}`
                    }
                    fill="none"
                    stroke="#0b0b0b"
                    strokeOpacity="0.55"
                    strokeWidth="0.28"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* price + callout labels */}
          <div className="order-1 md:order-2 md:col-span-5">
            <p className="spec mb-5 text-ink/50">04 — THE DETAIL</p>
            <h2 data-price className="text-[clamp(3.4rem,9vw,9rem)] font-bold leading-[0.9] tracking-[-0.05em] text-ink">
              {inr(9490)}
            </h2>
            <p data-price-sub className="spec mt-4 text-ink/60">
              GULLY N°001 · BAAZ OUD BROWN · CRUST LEATHER
            </p>

            <ul className="mt-10 space-y-4">
              {CALLOUTS.map((c) => (
                <li key={c.label} data-callout className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-ink/40" />
                  <span className="text-[0.9rem] text-ink/80">{c.label}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[36ch] text-ink/60">
              One price, printed once. When the batch sells through, the pair
              goes to the archive — it is not made again.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

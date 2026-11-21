import { useRef } from 'react'
import { useScene, stage, countUp } from '../lib/scene'
import { workshop } from '../data/products'

/**
 * Scene 4 — Growth. The page wipes to cobalt while the workshop's real
 * 2023→2025 step chart draws in: founded in Delhi, Sector-10 workshop with
 * six karigars, then the 10,000 sq ft Sector-4 HQ with 50+. The floor head
 * count counts up with the scroll.
 */
export function Growth() {
  const chart = useRef(null)
  const counter = useRef(null)

  const ref = useScene((tl, root) => {
    const svg = chart.current
    const rise = svg?.querySelector('[data-rise]')
    const dots = svg ? Array.from(svg.querySelectorAll('[data-dot]')) : []
    const labels = root.querySelectorAll('[data-milestone]')

    if (!tl) {
      if (rise) rise.style.strokeDashoffset = '0'
      countUp(null, counter.current, 50)
      labels.forEach((el) => {
        el.style.opacity = '1'
      })
      return undefined
    }

    // Wipe: a cobalt plane sweeps smoothly up over the paper.
    tl.fromTo('[data-wipe]', { yPercent: 28 }, { yPercent: 0, duration: 0.18, ease: 'power1.out' }, 0)

    // Headline is present immediately and lifts into sharp focus
    tl.fromTo('[data-head]', { autoAlpha: 0.7, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.02)
      .fromTo('[data-head-sub]', { autoAlpha: 0.7 }, { autoAlpha: 1, duration: 0.05 }, 0.05)

    // Chart: step line draws, milestones pop.
    if (rise) {
      const len = rise.getTotalLength()
      rise.style.strokeDasharray = `${len}`
      rise.style.strokeDashoffset = `${len}`
      tl.to(rise, { strokeDashoffset: 0, duration: 0.28 }, 0.2)
    }
    dots.forEach((dot, i) => {
      tl.fromTo(dot, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.06 }, 0.28 + i * 0.07)
    })
    labels.forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.6, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.12 + i * 0.04)
    })

    countUp(tl, counter.current, 50, {
      from: 6,
      at: 0.35,
      duration: 0.28,
      format: (v) => String(Math.round(v)).padStart(2, '0'),
    })

    return undefined
  }, [])

  return (
    <section ref={ref} id="story" className="relative h-[180vh] bg-cobalt">
      <div className={`${stage} grain bg-paper`}>
        {/* the wipe plane carries the whole scene up over the paper */}
        <div data-wipe className="absolute inset-0 bg-cobalt will-change-transform">
          <div className="absolute -top-6 left-0 right-0 h-12 rounded-[100%] bg-cobalt" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="shell pt-28 md:pt-36">
              <p className="spec text-white/50">05 — THE WORKSHOP</p>
              <h2 data-head className="text-[clamp(2.2rem,5.4vw,5rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white">
                Quietly building
                <br />
                India&rsquo;s sneaker workshop.
              </h2>
              <p data-head-sub className="spec mt-5 text-white/70">
                FOR THREE YEARS. ONE STREET AT A TIME.
              </p>
            </div>

            {/* chart */}
            <div className="shell grid flex-1 items-end gap-10 pb-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <svg
                  ref={chart}
                  viewBox="0 0 900 320"
                  className="w-full"
                  role="img"
                  aria-label="Workshop growth: founded 2023 in Delhi, Sector-10 workshop April 2024 with six karigars, Sector-4 headquarters January 2025 with fifty-plus karigars"
                >
                  <line x1="0" y1="290" x2="900" y2="290" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <path
                    data-rise
                    d="M 40 272 L 40 268 L 300 268 L 300 210 L 620 210 L 620 84 L 860 84"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {[
                    { x: 40, y: 272 },
                    { x: 300, y: 268 },
                    { x: 620, y: 210 },
                    { x: 860, y: 84 },
                  ].map((p) => (
                    <circle
                      key={p.x}
                      data-dot
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#003bd0"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>

              {/* milestones + counter */}
              <div className="lg:col-span-4">
                <ul className="space-y-6">
                  {workshop.map((m) => (
                    <li key={m.when} data-milestone className="flex items-baseline gap-4 border-b border-white/15 pb-4">
                      <span className="spec shrink-0 text-white/70">{m.when}</span>
                      <span className="text-[0.95rem] leading-snug text-white">{m.what}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-end justify-between lg:justify-start lg:gap-6">
                  <span className="spec text-white/70">
                    KARIGARS
                    <br />
                    ON THE FLOOR
                  </span>
                  <span
                    ref={counter}
                    className="font-mono text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.04em] text-white"
                  >
                    06
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

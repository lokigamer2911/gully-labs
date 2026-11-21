import { useLayoutEffect, useRef } from 'react'
import { useScene, stage } from '../lib/scene'
import { workshopPhotos } from '../data/assets'

const STEPS = [
  { key: 'cutting', label: 'Pattern cutting', detail: 'Panels cut from the same pattern block' },
  { key: 'lasting', label: 'Lasting', detail: 'Upper pulled over the last by hand' },
  { key: 'painting', label: 'Hand-painting', detail: 'Crust leather finished to a two-tone patina' },
  { key: 'vulcanising', label: 'Vulcanising', detail: 'Rubber pressed and trimmed by hand' },
  { key: 'numbering', label: 'Numbering', detail: 'Numbered pairs, packed with tote and laces' },
]

/**
 * Scene 11 — Journey. The product flies a drawn curve through the five real
 * steps of its own construction — the reference's "From card selection to
 * your portfolio." beat. The curve and the milestones are laid out in SVG so
 * they stay aligned at every viewport.
 */
export function Journey() {
  const svg = useRef(null)

  const ref = useScene((tl, root) => {
    const svgEl = svg.current
    if (!svgEl) return undefined

    const path = svgEl.querySelector('[data-path]')
    const solid = svgEl.querySelector('[data-solid]')
    const shoe = svgEl.querySelector('[data-shoe]')
    const markers = Array.from(svgEl.querySelectorAll('[data-step]'))

    const total = path.getTotalLength()

    // Lay out the step markers along the actual path so nothing can drift.
    const fractions = [0.08, 0.29, 0.5, 0.71, 0.92]
    markers.forEach((marker, i) => {
      const point = path.getPointAtLength(total * fractions[i])
      const label = marker.querySelector('text')
      const dot = marker.querySelector('circle')
      dot.setAttribute('cx', point.x)
      dot.setAttribute('cy', point.y)
      label.setAttribute('x', i % 2 === 0 ? point.x + 14 : point.x - 14)
      label.setAttribute('y', point.y - 16)
      label.setAttribute('text-anchor', i % 2 === 0 ? 'start' : 'end')
      // two-line label: name + detail via tspans (built below)
    })

    if (!tl) {
      solid.style.strokeDashoffset = '0'
      markers.forEach((m) => (m.style.opacity = '1'))
      root.querySelectorAll('[data-step-card]').forEach((c) => (c.style.opacity = '1'))
      const end = path.getPointAtLength(total * 0.92)
      shoe.setAttribute('transform', `translate(${end.x} ${end.y}) rotate(4)`)
      return undefined
    }

    // Solid line draws over the dotted one.
    solid.style.strokeDasharray = `${total}`
    solid.style.strokeDashoffset = `${total}`
    tl.to(solid, { strokeDashoffset: 0, duration: 0.86 }, 0.06)

    // The shoe flies the curve; rotation follows the tangent.
    const proxy = { t: 0 }
    tl.to(proxy, {
      t: 1,
      duration: 0.9,
      onUpdate: () => {
        const t = proxy.t
        const p = path.getPointAtLength(total * t)
        const ahead = path.getPointAtLength(Math.min(total, total * (t + 0.012)))
        const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI
        shoe.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle * 0.35})`)
        markers.forEach((marker, i) => {
          marker.style.opacity = t * 1.15 > fractions[i] ? '1' : '0.12'
        })
        root.querySelectorAll('[data-step-card]').forEach((card, i) => {
          card.style.opacity = t * 1.15 > fractions[i] ? '1' : '0.25'
        })
      },
    }, 0.06)

    return undefined
  }, [])

  // The step labels are two-line SVG text — build tspans here so markers stay
  // declarative above.
  useLayoutEffect(() => {
    const svgEl = svg.current
    if (!svgEl) return
    Array.from(svgEl.querySelectorAll('[data-step]')).forEach((marker, i) => {
      const text = marker.querySelector('text')
      if (!text || text.childElementCount) return
      const { label, detail } = STEPS[i]
      const name = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
      name.setAttribute('x', text.getAttribute('x'))
      name.setAttribute('y', text.getAttribute('y'))
      name.textContent = `STEP ${i + 1} — ${label.toUpperCase()}`
      const sub = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
      sub.setAttribute('x', text.getAttribute('x'))
      sub.setAttribute('y', Number(text.getAttribute('y')) + 14)
      sub.textContent = detail
      text.append(name, sub)
    })
  }, [])

  return (
    <section ref={ref} className="relative h-[260vh] bg-paper">
      <div className={`${stage} grain flex flex-col`}>
        <div className="shell pt-28 md:pt-36">
          <h2 className="max-w-[18ch] text-[clamp(2rem,4.8vw,4.4rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-ink">
            From the cutting table to your street.
          </h2>
          <p className="spec mt-4 text-ink/50">11 — THE JOURNEY · FIVE STEPS, ONE PAIR</p>
        </div>

        <div className="relative flex-1">
          <svg
            ref={svg}
            viewBox="0 0 1200 640"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-label="The five steps of a Gully pair: pattern cutting, lasting, hand-painting, vulcanising, numbering"
            role="img"
          >
            {/* dotted guide */}
            <path
              data-path
              d="M 60 520 C 260 520 240 180 480 190 C 660 198 620 470 820 460 C 1000 452 1020 170 1140 160"
              fill="none"
              stroke="#0b0b0b"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* solid draw-over */}
            <path
              data-solid
              d="M 60 520 C 260 520 240 180 480 190 C 660 198 620 470 820 460 C 1000 452 1020 170 1140 160"
              fill="none"
              stroke="#0b0b0b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {STEPS.map((step) => (
              <g key={step.label} data-step style={{ opacity: 0.12 }}>
                <circle r="5" fill="#003bd0" stroke="#efece5" strokeWidth="2" />
                <text className="fill-ink font-mono" fontSize="13" letterSpacing="1">
                  {/* tspans injected on mount */}
                </text>
              </g>
            ))}

            {/* the traveller */}
            <g data-shoe transform="translate(60 520)">
              <image
                href="/img/cutouts/oud-brown-700.webp"
                x="-64"
                y="-46"
                width="128"
                height="92"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
        </div>

        {/* milestone cards — a real workshop frame per step lights up as the pair passes */}
        <div className="shell flex gap-2 pb-8 md:gap-4">
          {STEPS.map((step, i) => {
            const photo = workshopPhotos[step.key]
            return (
              <div
                key={step.label}
                data-step-card
                style={{ opacity: 0.25 }}
                className="flex-1 border-t border-ink/15 pt-2.5"
              >
                <p className="spec text-ink/50">{`STEP 0${i + 1}`}</p>
                <div className="mt-2 aspect-[4/3] overflow-hidden bg-white/60">
                  {photo ? (
                    <img
                      src={photo}
                      alt={`${step.label} in the Gully Labs workshop`}
                      width="1278"
                      height="720"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={`/img/cutouts/${['oud-brown', 'udaan-blue', 'magic-carpet', 'amra-ochre', 'suva-green'][i]}-700.webp`}
                      alt=""
                      width="700"
                      height="700"
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  )}
                </div>
                <p className="mt-2 text-[0.72rem] font-bold uppercase leading-tight text-ink md:text-[0.82rem]">
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

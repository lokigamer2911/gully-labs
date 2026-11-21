import { useRef } from 'react'
import { useScene, stage } from '../lib/scene'
import { angleFrames } from '../data/assets'

const LINES = ['Hand-lasted.', 'Hand-painted.', 'Numbered.']
const hasFrames = angleFrames.length > 1

/**
 * Scene 2 — Rotation scrub. The one real product turns in place while three
 * craft verbs light up one by one, exactly like the reference's
 * "Graded. Tracked. Investable." beat. The turn is a 3D image transform on
 * the real photograph — never a generated shoe.
 */
export function Rotator() {
  const shoe = useRef(null)

  const ref = useScene((tl, root) => {
    const shoeEl = shoe.current

    if (!tl) {
      // Reduced motion: show the settled, readable state.
      root.querySelectorAll('[data-verb]').forEach((el) => {
        el.style.opacity = '1'
      })
      if (shoeEl) shoeEl.style.transform = 'none'
      return undefined
    }

    if (hasFrames) {
      // Real multi-angle photography: scrub the turntable frames like the
      // reference's rotating card. Preloaded so no frame ever pops in late.
      angleFrames.forEach((src) => {
        const preload = new Image()
        preload.src = src
      })
      const spin = { f: 0 }
      let last = -1
      tl.to(spin, {
        f: angleFrames.length - 1,
        duration: 0.72,
        onUpdate: () => {
          const index = Math.round(spin.f)
          if (index !== last && shoeEl) {
            last = index
            shoeEl.src = angleFrames[index]
          }
        },
      }, 0.04)
    } else {
      // Fallback: the turn is a 3D image transform on the real photograph.
      // Peak blur at the extremes sells the rotation without faking angles.
      tl.fromTo(
        shoeEl,
        { rotateY: -26, rotateZ: 5, scale: 0.92, filter: 'blur(2.5px) drop-shadow(0 30px 26px rgba(11,11,11,0.18))' },
        {
          rotateY: 18,
          rotateZ: -7,
          scale: 1.05,
          filter: 'blur(0px) drop-shadow(0 44px 34px rgba(11,11,11,0.2))',
          duration: 0.5,
          transformPerspective: 1100,
          transformOrigin: '50% 60%',
        },
        0.04,
      ).to(
        shoeEl,
        { rotateY: 0, rotateZ: 0, scale: 1, duration: 0.36 },
        0.56,
      )
    }

    // Verbs light up in sequence.
    root.querySelectorAll('[data-verb]').forEach((el, i) => {
      tl.fromTo(el, { opacity: 0.8 }, { opacity: 1, duration: 0.035 }, 0 + i * 0.022)
    })

    return undefined
  }, [hasFrames])

  return (
    <section ref={ref} className="relative h-[180vh] bg-paper">
      <div className={`${stage} grain flex flex-col justify-between py-2`}>
        <div className="shell pt-20 md:pt-28">
          <p className="spec text-ink/50">03 — THE MAKE</p>
        </div>

        <div className="shell grid flex-1 items-center gap-8 md:grid-cols-12 md:gap-8 lg:gap-10">
          <div className="order-2 md:order-1 md:col-span-5">
            <h2 className="display text-[clamp(2rem,4.8vw,5rem)] text-ink">
              {LINES.map((line) => (
                <span key={line} data-verb className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-[38ch] text-[clamp(0.875rem,1.2vw,1rem)] text-ink/60 md:mt-8">
              Every pair starts as flat crust leather on the same pattern block,
              is pulled over the last by hand, painted to a two-tone patina and
              numbered before it leaves the bench.
            </p>
          </div>

          <div className="order-1 md:order-2 md:col-span-7">
            <div className="relative mx-auto w-[min(80vw,620px)] md:w-full" style={{ perspective: '1100px' }}>
              <img
                ref={shoe}
                src={hasFrames ? angleFrames[0] : '/img/cutouts/oud-brown-1400.webp'}
                srcSet={hasFrames ? undefined : '/img/cutouts/oud-brown-700.webp 700w, /img/cutouts/oud-brown-1400.webp 1400w'}
                sizes="(min-width: 768px) 50vw, 80vw"
                width="1400"
                height="1400"
                alt="Baaz Oud Brown rotating in place"
                loading="lazy"
                className="mx-auto w-full max-h-[48vh] md:max-h-[56vh] object-contain will-change-transform"
                style={{ filter: 'drop-shadow(0 40px 30px rgba(11,11,11,0.18))' }}
              />
              <div aria-hidden="true" className="mx-auto -mt-3 h-5 w-1/2 rounded-[100%] bg-ink/10 blur-md" />
            </div>
          </div>
        </div>

        <div className="shell flex items-center justify-between pb-6 md:pb-8">
          <span className="spec text-ink/50">Lasting bench · Noida</span>
          <span className="spec text-ink/50">60-day drops</span>
        </div>
      </div>
    </section>
  )
}

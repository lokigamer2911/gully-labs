import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { reducedMotion } from '../lib/cn'
import { heroProduct } from '../data/colourways'

/**
 * Scene 1 — Hero. One real product floats centre-right over the paper field;
 * the claim sits left; a drop card anchors bottom-left; "Scroll to explore"
 * sits bottom-right. Three hairline columns + grain tie it to every scene
 * that follows.
 */
export function Hero() {
  const root = useRef(null)
  const shoe = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return undefined

    const ctx = gsap.context(() => {
      // Idle float starts immediately (it is beneath the loader anyway).
      gsap.to(shoe.current, {
        y: -14,
        rotate: 1.6,
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      const enter = () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from(shoe.current, { yPercent: 16, autoAlpha: 0.3, rotate: 4, duration: 0.9 }, 0.05)
          .from('[data-hero-lift]', { y: 20, autoAlpha: 0.4, duration: 0.65, stagger: 0.05 }, 0.08)
      }

      // The loader covers the page; start the entrance once it lifts.
      let onReady = null
      if (window.__gullyReady) {
        enter()
      } else {
        onReady = enter
        window.addEventListener('gully:ready', onReady, { once: true })
      }

      // Exit parallax on the way out.
      gsap.to('[data-hero-exit]', {
        yPercent: -7,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => {
      if (onReady) window.removeEventListener('gully:ready', onReady)
      ctx.revert()
    }
  }, [])

  const product = heroProduct

  return (
    <section ref={root} id="top" className="grain relative overflow-hidden bg-paper">
      {/* hairline columns */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 grid grid-cols-3">
        <div className="border-r border-ink/10" />
        <div className="border-r border-ink/10" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between pb-8 pt-28 sm:pb-12 md:pt-36">
        <div className="shell grid items-start gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <p data-hero-lift data-hero-exit className="spec mb-6 inline-flex items-center gap-3 border border-ink/15 bg-white/50 px-4 py-2 text-ink/70">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cobalt" aria-hidden="true" />
              {`GL001 · ${product.shortName} · ${product.priceLabel}`}
            </p>
            <h1 data-hero-lift data-hero-exit className="display text-[clamp(2.5rem,6.8vw,6.75rem)] text-ink">
              The sneaker
              <br />
              workshop for
              <br />
              the streets
              <br />
              of India.
            </h1>
            <p data-hero-lift data-hero-exit className="mt-8 max-w-[42ch] text-[clamp(0.95rem,1.4vw,1.15rem)] font-light leading-relaxed text-ink/70">
              Hand-lasted in Noida. Released every 60 days. Never restocked.
              This is a concept tribute — every pair below links to the real
              product at gullylabs.com.
            </p>
          </div>

          {/* floating product */}
          <div className="relative md:col-span-5">
            <div className="pointer-events-none relative mx-auto w-[min(88vw,560px)] md:w-full">
              <img
                ref={shoe}
                data-hero-exit
                src="/img/cutouts/oud-brown-1400.webp"
                srcSet="/img/cutouts/oud-brown-700.webp 700w, /img/cutouts/oud-brown-1400.webp 1400w"
                sizes="(min-width: 1024px) 42vw, 88vw"
                width="1400"
                height="1400"
                alt="Gully Number 001 Baaz Oud Brown sneaker, side profile"
                className="relative z-10 mx-auto w-full will-change-transform"
                style={{ filter: 'drop-shadow(0 34px 30px rgba(11,11,11,0.16))' }}
                fetchpriority="high"
              />
              <div
                aria-hidden="true"
                className="mx-auto -mt-4 h-6 w-3/5 rounded-[100%] bg-ink/10 blur-md"
              />
            </div>
          </div>
        </div>

        <div className="shell mt-10 grid items-end gap-8 lg:grid-cols-12">
          {/* drop card */}
          <div data-hero-lift data-hero-exit className="lg:col-span-5">
            <a
              href="https://gullylabs.com/collections/all-shoe"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-ink/15 bg-white/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-ink/40 md:p-7"
            >
              <p className="spec text-ink/60">Every 60 days · hand-lasted in Noida</p>
              <p className="mt-3 font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold uppercase leading-tight tracking-[-0.03em] text-ink">
                Every pair, one drop
                <br />
                at a time.
              </p>
              <span className="spec mt-5 inline-flex items-center gap-2 text-ink transition-colors duration-300 group-hover:text-cobalt">
                Explore the real collection
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </a>
          </div>

          <div data-hero-exit className="flex items-center gap-3 lg:col-span-7 lg:justify-end">
            <span className="spec text-ink/60">Scroll to explore</span>
            <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-ink/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-cobalt" />
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%);} 60%,100% { transform: translateY(200%);} }`}</style>
    </section>
  )
}

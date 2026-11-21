import { useEffect, useState } from 'react'
import { site } from '../../data/site'
import { cn, reducedMotion } from '../../lib/cn'

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {open ? (
        <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <>
          <path d="M3 7H19" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 15H19" stroke="currentColor" strokeWidth="1.4" />
        </>
      )}
    </svg>
  )
}

/**
 * Floating pill header — a logo chip left, a nav chip right. The white glass
 * reads on every scene background (paper, cobalt, ink), like the reference's
 * floating nav.
 */
export function Header() {
  const [open, setOpen] = useState(false)

  // Anchors into a pinned runway should land mid-scene, where the wipe has
  // revealed its content — not at progress 0, where it is still covered.
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      if (!link) return
      const target = document.getElementById(link.getAttribute('href').slice(1))
      if (!target) return
      event.preventDefault()
      const pinned = Boolean(target.querySelector(':scope > .sticky'))
      const offset = pinned ? target.offsetHeight * 0.5 : 0
      const top = target.getBoundingClientRect().top + window.scrollY + offset - 88
      window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 p-3 sm:p-4">
      <div className="shell flex items-center justify-between">
        <a
          href="#top"
          aria-label="Gully Labs — back to top"
          className="pointer-events-auto flex items-baseline gap-2 rounded-full border border-ink/10 bg-white/85 px-5 py-3 backdrop-blur-md transition-colors duration-300 hover:border-ink/30"
        >
          <span className="font-display text-[0.9rem] font-bold uppercase leading-none tracking-[-0.03em] text-ink">
            Gully Labs
          </span>
          <span className="font-mono text-[0.5rem] leading-none text-ink/60">®</span>
        </a>

        <nav aria-label="Primary" className="pointer-events-auto hidden items-center gap-1 rounded-full border border-ink/10 bg-white/85 px-2 py-1.5 backdrop-blur-md md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="spec rounded-full px-4 py-2.5 text-ink/70 transition-colors duration-300 hover:bg-ink hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://gullylabs.com/collections/all-shoe"
            target="_blank"
            rel="noopener noreferrer"
            className="spec ml-1 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-white transition-colors duration-300 hover:bg-cobalt"
          >
            Shop
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
              <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="pointer-events-auto relative z-[60] rounded-full border border-ink/10 bg-white/85 p-3 text-ink backdrop-blur-md transition-colors duration-300 hover:border-ink/30 md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-paper transition-[opacity,visibility] duration-500 ease-precision md:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 pt-3">
          <span className="font-display text-[0.95rem] font-bold uppercase tracking-[-0.03em] text-ink">
            Gully Labs
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-full border border-ink/10 bg-white/85 p-3 text-ink"
          >
            <MenuIcon open={open} />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-5 pb-24">
          {site.nav.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline justify-between border-b border-ink/10 py-5"
            >
              <span className="display text-[clamp(2rem,10vw,3rem)] text-ink transition-colors duration-300 group-hover:text-cobalt">
                {item.label}
              </span>
              <span className="spec text-ink/60">{`0${index + 1}`}</span>
            </a>
          ))}

          <a
            href="https://gullylabs.com/collections/all-shoe"
            target="_blank"
            rel="noopener noreferrer"
            className="spec mt-10 inline-flex items-center justify-center border border-ink bg-ink px-6 py-5 text-white"
          >
            Shop all sneakers
          </a>

          <div className="mt-8 flex flex-wrap gap-6">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="spec text-ink/60 transition-colors duration-300 hover:text-ink"
              >
                {social.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

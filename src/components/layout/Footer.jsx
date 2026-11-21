import { site } from '../../data/site'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="display text-[clamp(2.5rem,6vw,4rem)] leading-[0.9]">
              Gully
              <br />
              Labs
            </p>
            <p className="mt-8 max-w-[26ch] text-[0.85rem] font-light leading-relaxed text-white/60">
              Hand-lasted sneakers from New Delhi. Real collections, real prices,
              deep-linked to gullylabs.com. No simulated checkout.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {site.footer.map((column) => (
            <div key={column.title} className="md:col-span-2">
              <h3 className="spec mb-6 tracking-[0.2em] text-white/70">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.85rem] text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <h3 className="spec mb-6 tracking-[0.2em] text-white/70">Contact</h3>
            <ul className="space-y-3 text-[0.85rem] text-white/60">
              <li>Noida Sector-4</li>
              <li>Uttar Pradesh, India</li>
              <li>
                <a
                  href="https://gullylabs.com/pages/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-white"
                >
                  Talk to the lab
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="spec max-w-[70ch] text-[0.65rem] leading-relaxed text-white/60">
              Unofficial concept project. Not affiliated with, endorsed by, or operated by
              Gully Labs Innovations Private Limited.
            </p>
            <p className="spec text-[0.65rem] text-white/60">
              © {new Date().getFullYear()} Concept — product data traced to gullylabs.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

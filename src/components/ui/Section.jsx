import { cn } from '../../lib/cn'

export function Section({ children, className, id, innerClassName }) {
  return (
    <section id={id} className={cn('relative overflow-hidden bg-white', className)}>
      <div className={cn('shell', innerClassName)}>{children}</div>
    </section>
  )
}

/** Small monospaced section index, e.g. "01 — The Last". */
export function Eyebrow({ children, className, tone = 'cobalt' }) {
  return (
    <span
      className={cn(
        'spec block tracking-[0.24em]',
        tone === 'cobalt' ? 'text-cobalt' : 'text-ink/60',
        className,
      )}
    >
      {children}
    </span>
  )
}

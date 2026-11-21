import { cn } from '../../lib/cn'

/** Text link with a precise hairline underline that wipes in from the left. */
export function ArrowLink({
  href,
  children,
  className,
  external = false,
  onClick,
  arrow = true,
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={cn(
        'group/arrow link-underline inline-flex items-center font-bold text-ink transition-colors duration-300',
        className,
      )}
    >
      <span>{children}</span>
      {arrow ? (
        <svg
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          aria-hidden="true"
          className="ml-2 shrink-0 transition-transform duration-300 ease-precision group-hover/arrow:translate-x-1"
        >
          <path
            d="M1 1L5 5L1 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </a>
  )
}

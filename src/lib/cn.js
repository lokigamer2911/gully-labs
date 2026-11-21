/** Tiny class-name joiner. Accepts strings and { className: boolean } objects. */
export function cn(...inputs) {
  const seen = new Set()
  const result = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string') {
      for (const part of input.split(/\s+/)) {
        if (part && !seen.has(part)) {
          seen.add(part)
          result.push(part)
        }
      }
      continue
    }

    if (typeof input === 'object') {
      for (const key of Object.keys(input)) {
        if (input[key]) {
          for (const part of key.split(/\s+/)) {
            if (part && !seen.has(part)) {
              seen.add(part)
              result.push(part)
            }
          }
        }
      }
    }
  }

  return result.join(' ')
}

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../lib/cn'

export function Loader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) {
      setProgress(100)
      setDone(true)
      setGone(true)
      return undefined
    }

    let value = 0
    const id = setInterval(() => {
      value = Math.min(100, value + 16 + Math.random() * 24)
      setProgress(Math.round(value))
      if (value >= 100) {
        clearInterval(id)
        timerRef.current = setTimeout(() => setDone(true), 120)
      }
    }, 45)

    // Hard safety net: the loader must never trap the page.
    const failsafe = setTimeout(() => {
      setProgress(100)
      setDone(true)
    }, 2000)

    return () => {
      clearInterval(id)
      clearTimeout(failsafe)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!done) return undefined
    // Announce that the page is visible — pinned scenes key their entrance off it.
    window.__gullyReady = true
    window.dispatchEvent(new Event('gully:ready'))
    const id = setTimeout(() => setGone(true), 600)
    return () => clearTimeout(id)
  }, [done])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-paper px-5 py-6 transition-transform duration-[550ms] ease-precision sm:px-8 ${
        done ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-[0.9rem] font-bold uppercase tracking-[-0.03em] text-ink">
          Gully Labs
        </span>
        <span className="spec text-ink/60">Est. 2023</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <p className="display max-w-[14ch] text-center text-[clamp(2rem,7vw,4rem)] leading-[0.9] text-ink">
          Loading specimen
        </p>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="spec text-ink/60">Baaz / Number 001</span>
          <span className="font-mono text-[clamp(2rem,7vw,3.5rem)] leading-none tracking-[-0.04em] text-ink">
            {String(progress).padStart(3, '0')}
          </span>
        </div>
        <div className="mt-4 h-px w-full bg-ink/15">
          <div
            className="h-px bg-cobalt transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

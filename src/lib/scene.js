import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './cn'

/**
 * Sticky scrub scenes.
 *
 * Every cinematic section follows the same skeleton:
 *
 *   <section ref={ref} className="h-[300vh]">        // scroll runway
 *     <div className="sticky top-0 h-screen">        // pinned viewport
 *       ...scene, animated by a scrubbed timeline...
 *     </div>
 *   </section>
 *
 * `useScene(build)` wires it up: `build(timeline, rootElement)` receives a
 * gsap timeline whose progress is scrubbed across the runway's passage
 * through the viewport. Under `prefers-reduced-motion` the scene gets
 * `build(null, root)` instead — it should render its final, readable state
 * and never pin or animate.
 *
 * Design rule: the plain CSS state of every scene is its FINAL readable
 * state; timelines move things `from(...)` somewhere earlier in the scroll.
 */
export function useScene(build, deps = []) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return undefined

    if (reducedMotion()) {
      const cleanup = build(null, root)
      // No scrub means the long runway is just empty scrolling — collapse it
      // to a single readable viewport and unpin the stage.
      root.style.height = 'auto'
      const inner = root.firstElementChild
      if (inner) {
        inner.style.position = 'relative'
        inner.style.height = 'auto'
        inner.style.minHeight = '100vh'
      }
      return typeof cleanup === 'function' ? cleanup : undefined
    }

    const ctx = gsap.context(() => {
      build(sceneTimeline(root), root)
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

function sceneTimeline(root) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.15,
      invalidateOnRefresh: true,
    },
  })
}

/** Scrubbed 0→N counter. Writes textContent directly (no React re-renders). */
export function countUp(tl, el, to, { from = 0, at = 0, duration = 0.45, format = (v) => String(Math.round(v)) } = {}) {
  if (!el) return
  if (!tl) {
    el.textContent = format(to)
    return
  }
  const proxy = { v: from }
  tl.to(proxy, {
    v: to,
    duration,
    onUpdate: () => {
      el.textContent = format(proxy.v)
    },
  }, at)
}

/** ₹ formatting, Indian digit grouping. */
export const inr = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`

/** Sticky stage className shorthand. */
export const stage = 'sticky top-0 h-screen overflow-hidden'

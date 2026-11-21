import { lazy, Suspense, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Loader } from './sections/Loader'
import { Hero } from './sections/Hero'
import { Rotator } from './sections/Rotator'
import { Annotation } from './sections/Annotation'
import { Growth } from './sections/Growth'
import { Fan } from './sections/Fan'
import { Wall } from './sections/Wall'
import { reducedMotion } from './lib/cn'
import { WordPairs } from './sections/WordPairs'
import { Statement } from './sections/Statement'
import { Index } from './sections/Index'
import { Journey } from './sections/Journey'
import { Faq } from './sections/Faq'
import { Closing } from './sections/Closing'

// three.js is heavy — code-split it, but mount immediately so the scene can
// never leave an empty gap while an observer decides to fire.
const Teardown = lazy(() => import('./sections/Teardown').then((m) => ({ default: m.Teardown })))

gsap.registerPlugin(ScrollTrigger)

if (import.meta.env.DEV) {
  window.__gsap = { gsap, ScrollTrigger }
}

export default function App() {
  // Reveal-on-scroll for the non-pinned beats (FAQ). Safe by default.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'))
    if (!nodes.length || !('IntersectionObserver' in window) || reducedMotion()) {
      nodes.forEach((node) => node.classList.add('visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    nodes.forEach((node) => observer.observe(node))
    const fallback = setTimeout(() => nodes.forEach((node) => node.classList.add('visible')), 2600)

    // Pinned runways change the document height once images/fonts land.
    ScrollTrigger.refresh()
    const onSettle = () => ScrollTrigger.refresh()
    window.addEventListener('load', onSettle)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
      window.removeEventListener('load', onSettle)
    }
  }, [])

  return (
    <div id="top-anchor" className="min-h-screen bg-white text-ink">
      <Loader />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-[340vh] bg-paper" />}>
          <Teardown />
        </Suspense>
        <Rotator />
        <Annotation />
        <Growth />
        <Fan />
        <Wall />
        <WordPairs />
        <Statement />
        <Index />
        <Journey />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}

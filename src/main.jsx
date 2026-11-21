import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { reducedMotion } from './lib/cn'

// Reveal animations are opt-in: without this class every `.reveal` element is
// visible, so a failed observer can never leave the page looking blank.
if ('IntersectionObserver' in window && !reducedMotion()) {
  document.documentElement.classList.add('motion-ready')
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// ScrollTrigger needs fresh measurements once fonts and images have settled.
if (document.readyState === 'complete') {
  window.dispatchEvent(new Event('resize'))
} else {
  window.addEventListener('load', () => window.dispatchEvent(new Event('resize')), {
    once: true,
  })
}

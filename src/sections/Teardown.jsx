import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScene, stage } from '../lib/scene'
import { heroProduct } from '../data/colourways'

/** GLB material name -> the real layer it represents. */
const ROLE = {
  'White flat lace': 'lace',
  'Brushed nickel hardware': 'hardware',
  'Red cotton canvas': 'body',
  'Beige twill lining': 'lining',
  'Off-white vulcanised rubber': 'rubber',
  'Honey gum rubber outsole': 'outsole',
}

/** Direction each layer travels when the pair comes apart, in model units. */
const VECTOR = {
  lace: [0.05, 1.15, 0.18],
  hardware: [0.35, 0.78, 0.12],
  body: [0, 0.38, 0],
  lining: [0, -0.08, -0.42],
  rubber: [0, -0.58, 0.14],
  outsole: [0, -1.05, 0],
}

/**
 * Scene 7 — Teardown. The real sneaker model (public/models/sneaker.glb) comes
 * apart layer by layer as you scroll; the six callouts are the real
 * construction notes from the product feed. The other scenes stay photographic —
 * this is the one deliberate 3D "specimen study" moment.
 */
export function Teardown() {
  const host = useRef(null)
  const view = useRef({ p: 0, active: -1 })
  const [failed, setFailed] = useState(false)

  // Scroll drives the explosion progress and the active layer.
  const ref = useScene((tl, root) => {
    const labels = Array.from(root.querySelectorAll('[data-layer]'))
    const counter = root.querySelector('[data-layer-count]')

    const setActive = (index) => {
      view.current.active = index
      labels.forEach((el, i) => {
        el.dataset.active = i === index ? 'true' : 'false'
      })
      if (counter) counter.textContent = String(index + 1).padStart(2, '0')
    }

    if (!tl) {
      view.current.p = 1
      setActive(5)
      return undefined
    }

    const proxy = { p: 0 }
    tl.to(proxy, {
      p: 1,
      duration: 1,
      onUpdate: () => {
        view.current.p = proxy.p
        const index = Math.min(5, Math.floor(proxy.p * 6))
        if (index !== view.current.active) setActive(index)
      },
    }, 0)

    tl.fromTo('[data-td-title]', { autoAlpha: 0.8, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0)
    labels.forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0.8, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.04 }, 0.01 + i * 0.012)
    })

    return undefined
  }, [])

  // The lazy chunk mounts inside the second scene — refresh every runway's
  // start/end immediately so nothing is measured against stale offsets.
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  // WebGL setup — independent of the scroll timeline.
  useEffect(() => {
    const mount = host.current
    if (!mount || reducedMotion()) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return undefined
    }
    if (!renderer.getContext()) {
      setFailed(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.className = 'block h-full w-full'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100)
    camera.position.set(0, 0, 4.4)

    scene.add(new THREE.AmbientLight(0xffffff, 1.7))
    const key = new THREE.DirectionalLight(0xffffff, 2.4)
    key.position.set(3, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x7f9dff, 1.1)
    fill.position.set(-4, 2, -3)
    scene.add(fill)

    const rig = new THREE.Group()
    rig.rotation.y = -0.86
    rig.rotation.x = 0.08
    scene.add(rig)

    const parts = []
    let live = true
    if (import.meta.env.DEV) window.__teardown = { view, parts }

    new GLTFLoader().load(
      '/models/sneaker.glb',
      (gltf) => {
        if (!live) return

        // Center the sneaker model at origin (0, 0, 0) so it never sits offscreen
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const center = new THREE.Vector3()
        box.getCenter(center)
        gltf.scene.position.sub(center)

        rig.add(gltf.scene)

        // One shared bounding size keeps the explosion proportional
        const size = new THREE.Vector3()
        box.getSize(size)
        const unit = Math.max(size.x, size.y, size.z)
        const gap = unit * 0.38

        gltf.scene.traverse((node) => {
          if (!node.isMesh || !node.material) return
          const material = node.material.clone()
          const name = node.material.name || ''
          const role = ROLE[name] ?? 'body'
          let map = material.map

          // Grayscale the source map so the brand tint reads true instead of
          // multiplying against the original canvas colour.
          if (map?.image) {
            try {
              const canvas = document.createElement('canvas')
              const img = map.image
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d', { willReadFrequently: true })
              ctx.drawImage(img, 0, 0)
              const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
              for (let i = 0; i < data.data.length; i += 4) {
                const gray = data.data[i] * 0.3 + data.data[i + 1] * 0.59 + data.data[i + 2] * 0.11
                data.data[i] = data.data[i + 1] = data.data[i + 2] = gray
              }
              ctx.putImageData(data, 0, 0)
              map = new THREE.CanvasTexture(canvas)
              map.colorSpace = THREE.SRGBColorSpace
            } catch {
              map = material.map
            }
          }

          material.map = map
          material.color = new THREE.Color(heroProduct.tint[role] ?? '#8a5f3d')
          material.roughness = 0.78
          material.metalness = role === 'hardware' ? 0.55 : 0.02
          material.transparent = true
          material.opacity = 1
          node.material = material

          const vector = VECTOR[role] ?? VECTOR.body
          parts.push({
            node,
            role,
            home: node.position.clone(),
            offset: new THREE.Vector3(vector[0], vector[1], vector[2]).multiplyScalar(gap),
          })
        })
      },
      undefined,
      () => setFailed(true),
    )

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let visible = true
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    })
    io.observe(mount)

    const applyFrame = () => {
      if (!parts.length) return
      const p = view.current.p
      const activeRole = ['lace', 'hardware', 'body', 'lining', 'rubber', 'outsole'][view.current.active]

      parts.forEach((part) => {
        part.node.position.copy(part.home).addScaledVector(part.offset, p)
        part.node.material.opacity = activeRole && part.role !== activeRole ? 0.34 : 1
      })

      // Pull the camera back gently as the pair opens up
      const distance = 3.6 + p * 1.5
      camera.position.z += (distance - camera.position.z) * 0.12
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }

    let raf = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      if (visible && parts.length) applyFrame()
    }
    render()
    if (import.meta.env.DEV) window.__teardown.applyFrame = applyFrame

    return () => {
      live = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      io.disconnect()
      scene.traverse((node) => {
        if (!node.isMesh) return
        node.geometry?.dispose?.()
        const mats = Array.isArray(node.material) ? node.material : [node.material]
        mats.forEach((m) => {
          m?.map?.dispose?.()
          m?.dispose?.()
        })
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  const layers = heroProduct.layers

  return (
    <section ref={ref} id="craft" className="relative h-[220vh] bg-paper">
      <div className={`${stage} grain flex flex-col justify-center py-4 md:py-8`}>
        <div className="shell grid w-full items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* callouts */}
          <div className="order-2 md:order-1 md:col-span-5">
            <p className="spec text-ink/50">02 — THE TEARDOWN · SIX LAYERS</p>
            <h2 data-td-title className="mt-3 text-[clamp(1.75rem,3.4vw,3.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-ink md:mt-5">
              Six layers.
              <br />
              One pair.
            </h2>

            <div className="mt-4 md:mt-6">
              {layers.map((layer, i) => (
                <div
                  key={layer.id}
                  data-layer
                  data-active={i === 0 ? 'true' : 'false'}
                  className="layer-callout flex gap-3.5 border-t border-ink/15 py-2 md:py-2.5 transition-opacity duration-300 last:border-b"
                >
                  <span className="spec w-6 shrink-0 text-ink/40">{`0${i + 1}`}</span>
                  <span>
                    <span className="block text-[0.875rem] font-bold uppercase tracking-[0.01em] text-ink">
                      {layer.label}
                    </span>
                    <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink/60">{layer.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* model stage */}
          <div className="order-1 md:order-2 md:col-span-7">
            <div className="relative aspect-[4/3] w-full max-h-[58vh] overflow-hidden border border-ink/10 bg-[radial-gradient(circle_at_50%_45%,#f7f4ee_0%,#e6e0d5_100%)] md:aspect-[16/11]">
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 opacity-60">
                <div className="border-r border-ink/10" />
                <div className="border-r border-ink/10" />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-4 font-display text-[clamp(3rem,9vw,8rem)] font-bold leading-none tracking-[-0.06em] text-ink/[0.06]">
                001
              </span>

              {!failed ? (
                <div ref={host} role="img" aria-label="Exploded 3D view of the sneaker's six construction layers" className="absolute inset-0" />
              ) : (
                <img
                  src="/img/cutouts/oud-brown-700.webp"
                  alt="Baaz Oud Brown sneaker"
                  className="absolute inset-0 m-auto w-4/5"
                />
              )}
              {failed && (
                <p className="spec absolute bottom-4 right-4 text-ink/50">
                  3D VIEW UNAVAILABLE — SPEC LIST AT LEFT
                </p>
              )}

              <div className="pointer-events-none absolute right-4 top-4 text-right">
                <p className="spec text-ink/50">EXPLODED VIEW</p>
                <p data-layer-count className="font-mono text-[1.6rem] leading-none text-ink">01</p>
              </div>
              <div aria-hidden="true" className="edge-ticks pointer-events-none absolute inset-3" />
            </div>
            <p className="spec mt-2.5 text-ink/50">SCROLL TO PULL THE PAIR APART</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reduced-motion helper kept local so the WebGL scene never starts for those users.
function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

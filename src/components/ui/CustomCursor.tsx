import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { CURSOR_LABEL_EVENT } from '../../lib/cursor'
import { audio } from '../audio/audioManager'

/** Elementos que fazem o cursor "acordar". Use `data-cursor="texto"` para mostrar um rótulo. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

const SIZE = 40
const HOVER_SIZE = 64
const LABEL_SIZE = 88

/** Chave usada quando o hover vem de um objeto 3D (via setCursorLabel). */
const THREE_TARGET = {}

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  // Só em dispositivos com mouse de verdade; no touch fica o comportamento nativo
  const [enabled] = useState(() => matchMedia('(hover: hover) and (pointer: fine)').matches)

  useGSAP(() => {
    if (!enabled || !dot.current || !ring.current || !label.current) return
    const dotEl = dot.current
    const ringEl = ring.current
    const labelEl = label.current
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    // quickTo reaproveita um único tween por eixo: barato para chamar a cada pointermove
    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.1, ease: 'power3' })
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.1, ease: 'power3' })
    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })

    let hovered: object | null = null
    let threeLabel: string | null = null
    let visible = false
    let lastX = 0
    let lastY = 0

    const setHovered = (key: object | null, text: string) => {
      if (key === hovered && labelEl.textContent === text) return
      hovered = key
      labelEl.textContent = text
      ringEl.dataset.state = key ? 'hover' : 'idle'

      const size = !key ? SIZE : text ? LABEL_SIZE : HOVER_SIZE
      gsap.to(ringEl, { width: size, height: size, duration: 0.35, ease: 'back.out(2.5)' })
      gsap.to(dotEl, { scale: key ? 0 : 1, duration: 0.2 })
      gsap.to(labelEl, { autoAlpha: text ? 1 : 0, scale: text ? 1 : 0.5, duration: 0.25 })
      if (key) audio.play('hover')
    }

    /** O DOM interativo tem prioridade; senão vale o hover 3D, se houver. */
    const resolve = (el: Element | null) => {
      const target = el?.closest(INTERACTIVE) ?? null
      if (target) setHovered(target, target.getAttribute('data-cursor') ?? '')
      else if (threeLabel) setHovered(THREE_TARGET, threeLabel)
      else setHovered(null, '')
    }

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true
        // Primeiro movimento: teleporta para o ponteiro em vez de "voar" do canto
        gsap.set([dotEl, ringEl], { x: e.clientX, y: e.clientY })
        gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.2 })
      }
      lastX = e.clientX
      lastY = e.clientY
      dotX(lastX)
      dotY(lastY)
      ringX(lastX)
      ringY(lastY)
      resolve(e.target instanceof Element ? e.target : null)
    }

    // Rolar com o mouse parado troca o elemento embaixo do cursor sem disparar pointermove
    const onScroll = () => {
      if (visible) resolve(document.elementFromPoint(lastX, lastY))
    }

    const onThreeLabel = (e: Event) => {
      threeLabel = (e as CustomEvent<string | null>).detail
      if (visible) resolve(document.elementFromPoint(lastX, lastY))
    }

    const onDown = () => {
      gsap.to(ringEl, { scale: 0.8, duration: 0.12 })
      if (hovered) audio.play('click')
    }
    const onUp = () => gsap.to(ringEl, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' })

    const onLeave = () => {
      visible = false
      setHovered(null, '')
      gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.2 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener(CURSOR_LABEL_EVENT, onThreeLabel)
    root.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener(CURSOR_LABEL_EVENT, onThreeLabel)
      root.removeEventListener('mouseleave', onLeave)
      root.classList.remove('has-custom-cursor')
    }
  })

  if (!enabled) return null

  return (
    <>
      <div
        ref={ring}
        data-state="idle"
        className="pointer-events-none fixed top-0 left-0 z-[100] grid size-10 place-items-center rounded-full border-[3px] border-black shadow-cartoon-sm transition-colors duration-200 data-[state=hover]:bg-pop-pink"
      >
        <span
          ref={label}
          className="invisible font-display text-sm text-white uppercase opacity-0 [-webkit-text-stroke:1px_black] [paint-order:stroke_fill]"
        />
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[100] size-2.5 rounded-full bg-black"
      />
    </>
  )
}

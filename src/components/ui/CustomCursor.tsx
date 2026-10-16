import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { audio } from '../audio/audioManager'

const INTERACTIVE = 'a, button, [role="button"], .sticker, canvas, input, textarea, label'

/** Bolinha que segue o mouse, estica com a velocidade e cresce sobre elementos clicáveis. */
export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () =>
      matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(() => {
    const cur = cursor.current
    if (!enabled || !cur) return
    const cx = gsap.quickTo(cur, 'x', { duration: 0.28, ease: 'power3' })
    const cy = gsap.quickTo(cur, 'y', { duration: 0.28, ease: 'power3' })
    let hovered: Element | null = null
    let lx = 0
    let ly = 0

    const setBig = (el: Element | null) => {
      if (el === hovered) return
      hovered = el
      cur.classList.toggle('big', !!el)
      gsap.to(cur, {
        width: el ? 44 : 22,
        height: el ? 44 : 22,
        margin: el ? '-22px 0 0 -22px' : '-11px 0 0 -11px',
        duration: 0.2,
      })
      if (el) audio.play('hover')
    }

    const onMove = (e: PointerEvent) => {
      cx(e.clientX)
      cy(e.clientY)
      cur.style.opacity = '1'
      setBig(e.target instanceof Element ? e.target.closest(INTERACTIVE) : null)
    }

    // Estica na direção do movimento ("smear" de desenho animado)
    const stretch = () => {
      const x = Number(gsap.getProperty(cur, 'x'))
      const y = Number(gsap.getProperty(cur, 'y'))
      const vx = x - lx
      const vy = y - ly
      lx = x
      ly = y
      const v = Math.min(Math.hypot(vx, vy) / 30, 0.7)
      gsap.set(cur, { rotation: (Math.atan2(vy, vx) * 180) / Math.PI, scaleX: 1 + v, scaleY: 1 - v * 0.45 })
    }

    const onLeave = () => (cur.style.opacity = '0')
    addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    gsap.ticker.add(stretch)
    return () => {
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      gsap.ticker.remove(stretch)
    }
  })

  if (!enabled) return null
  return <div ref={cursor} className="cursor" aria-hidden />
}

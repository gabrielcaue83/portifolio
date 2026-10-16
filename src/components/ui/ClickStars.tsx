import { useEffect } from 'react'
import gsap from 'gsap'
import { STAR_PATH } from '../../lib/shapes'
import { audio } from '../audio/audioManager'

const COLORS = ['#B6FF3B', '#FF2E93', '#FF8A00']

/** Estrelinhas que espirram a cada clique. */
export function ClickStars() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null
      if (target?.closest('input, textarea, .sticker, canvas')) return
      if (target?.closest('a, button, [role="button"]')) audio.play('click')
      for (let i = 0; i < 6; i++) {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        s.setAttribute('viewBox', '-24 -24 48 48')
        s.setAttribute('class', 'zap')
        s.innerHTML = `<path d="${STAR_PATH}" fill="${COLORS[i % 3]}"/>`
        document.body.appendChild(s)
        const a = (i / 6) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3)
        const d = gsap.utils.random(40, 80)
        gsap.set(s, { x: e.clientX, y: e.clientY, scale: 0 })
        gsap
          .timeline({ onComplete: () => s.remove() })
          .to(s, {
            x: e.clientX + Math.cos(a) * d,
            y: e.clientY + Math.sin(a) * d,
            scale: gsap.utils.random(0.7, 1.2),
            rotation: gsap.utils.random(-180, 180),
            duration: 0.45,
            ease: 'power3.out',
          })
          .to(s, { y: '+=50', scale: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
    addEventListener('pointerdown', onDown)
    return () => removeEventListener('pointerdown', onDown)
  }, [])

  return null
}

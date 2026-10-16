import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { openIntro } from '../../lib/intro'

/** Abertura de desenho animado: logo quica e a íris abre revelando o site. */
export function Iris() {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const finish = () => setDone(true)
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        openIntro()
        finish()
        return
      }

      const tl = gsap
        .timeline({ paused: true, onComplete: finish })
        .fromTo('.logo-pop', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, .45)' })
        .to('.logo-pop', { y: -30, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 3 })
        .to('.logo-pop', { scale: 0, duration: 0.25, ease: 'back.in(2)' })
        .call(openIntro)
        .to(root.current, { '--r': '150vmax', duration: 1.1, ease: 'power3.in' }, '-=0.05')

      // Espera as fontes (no máximo 1,8s) para o título não "pular" na entrada
      const fallback = setTimeout(() => tl.play(), 1800)
      document.fonts?.ready.then(() => {
        clearTimeout(fallback)
        tl.play()
      })
      return () => clearTimeout(fallback)
    },
    { scope: root },
  )

  if (done) return null
  return (
    <div ref={root} className="iris" aria-hidden>
      <div className="logo-pop">CG</div>
    </div>
  )
}

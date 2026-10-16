import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { Mascot } from '../ui/Mascot'

/** Encerramento de desenho animado: a íris fecha no Chiado. */
export function Fim() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.iris-mask', { display: 'none' })
        return
      }
      gsap.fromTo(
        '.iris-mask',
        { '--r': '120vmax' },
        { '--r': '26vmin', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } },
      )
    },
    { scope: root },
  )

  return (
    <section className="fim" aria-label="Fim" ref={root}>
      <div className="fim-sticky">
        <div className="fim-inner">
          <Mascot />
          <div className="fim-txt">Fim!</div>
          <div className="fim-small">...por enquanto</div>
        </div>
        <div className="iris-mask" aria-hidden />
      </div>
    </section>
  )
}

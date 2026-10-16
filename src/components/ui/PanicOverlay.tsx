import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { PANIC_EVENT } from '../../lib/panic'
import { fx } from '../../lib/rig'
import { audio } from '../audio/audioManager'

/**
 * O Easter Egg em si: sirene, tela piscando em vermelho, página tremendo e o
 * mundo 3D em colapso (fx.panic é lido pelo World, CRTEffects e estações).
 */
export function PanicOverlay() {
  const root = useRef<HTMLDivElement>(null)
  const message = useRef<HTMLDivElement>(null)
  const [announce, setAnnounce] = useState('')

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
      const main = document.querySelector('main')
      let tl: gsap.core.Timeline | null = null

      const run = contextSafe(() => {
        if (tl?.isActive()) return
        audio.play('siren')
        setAnnounce('Pânico ativado! Brincadeira, está tudo bem.')

        tl = gsap
          .timeline({ onComplete: () => setAnnounce('') })
          .set(root.current, { autoAlpha: 1 })
          .to(fx, { panic: 1, duration: 0.25, ease: 'power2.out' }, 0)
          .fromTo(
            message.current,
            { scale: 0, rotate: -25 },
            { scale: 1, rotate: -6, duration: 0.8, ease: 'elastic.out(1, 0.4)' },
            0,
          )
          .fromTo('[data-flash]', { opacity: 0 }, { opacity: 0.5, duration: 0.15, repeat: 11, yoyo: true, ease: 'steps(1)' }, 0)
          .to(fx, { panic: 0, duration: 1.2, ease: 'power2.inOut' }, 1.9)
          .to(message.current, { scale: 0, rotate: 20, duration: 0.3, ease: 'back.in(2)' }, 2.3)
          .set(root.current, { autoAlpha: 0 })

        if (!reducedMotion && main) {
          tl.to(
            main,
            { x: 'random(-16, 16)', y: 'random(-10, 10)', duration: 0.05, repeat: 29, repeatRefresh: true, ease: 'none' },
            0,
          ).set(main, { x: 0, y: 0 }, '>')
        }
      })

      window.addEventListener(PANIC_EVENT, run)
      return () => window.removeEventListener(PANIC_EVENT, run)
    },
    { scope: root },
  )

  return (
    <>
      <div ref={root} className="pointer-events-none invisible fixed inset-0 z-[90] grid place-items-center px-4">
        <div data-flash className="absolute inset-0 bg-pop-red opacity-0" />
        <div ref={message} className="cartoon-box relative rounded-3xl bg-pop-yellow px-8 py-6 text-center">
          <p className="text-outline font-display text-4xl text-white uppercase md:text-7xl">
            Não entre em pânico!
          </p>
          <p className="mt-2 text-lg font-black">(tarde demais)</p>
        </div>
      </div>
      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>
    </>
  )
}

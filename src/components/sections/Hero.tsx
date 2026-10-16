import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { waLink } from '../../lib/config'
import { INTRO_EVENT, introState } from '../../lib/intro'
import { STAR_PATH } from '../../lib/shapes'
import { Mascot, type MascotHandle } from '../ui/Mascot'

gsap.registerPlugin(SplitText, DrawSVGPlugin)

const PHRASES = [
  'E aí! Bora criar?',
  'Eu sou o Chiado, mascote do Cauê.',
  'Passa o mouse no nome ali do lado!',
  'Clica em mim pra eu pular!',
  'Rola a página e entra na minha TV.',
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const mascot = useRef<MascotHandle>(null)
  const bubble = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      const split = SplitText.create('.h1 .line', { type: 'chars', charsClass: 'ch' })

      // Balão com digitação e boca falando
      const startBubble = contextSafe(() => {
        if (reduce) return
        let i = 0
        const next = () => {
          const txt = PHRASES[i++ % PHRASES.length]
          const o = { n: 0 }
          mascot.current?.talk(true)
          gsap
            .timeline({ onComplete: () => void gsap.delayedCall(2.4, next) })
            .to(o, {
              n: txt.length,
              duration: txt.length * 0.045,
              ease: 'none',
              onUpdate: () => {
                if (bubble.current) bubble.current.textContent = txt.slice(0, Math.round(o.n))
              },
            })
            .call(() => mascot.current?.talk(false))
        }
        next()
      })

      const intro = contextSafe(() => {
        if (reduce) return
        gsap
          .timeline({ defaults: { ease: 'back.out(2)' } })
          .from(split.chars, {
            yPercent: -170,
            rotation: () => gsap.utils.random(-50, 50),
            opacity: 0,
            duration: 1,
            ease: 'bounce.out',
            stagger: 0.045,
          })
          .from('.tag', { scale: 0, rotation: -40, duration: 0.5 }, 0.1)
          .from('.lead, .ctas > *', { y: 40, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.4)
          .from('.burst', { scale: 0, duration: 1.1, ease: 'elastic.out(1, .5)' }, 0.2)
          .from('.mascot', { yPercent: 130, duration: 0.8, ease: 'back.out(1.4)' }, 0.5)
          .from('.spark', { scale: 0, rotation: 180, stagger: 0.1, duration: 0.6 }, 0.9)
          .from('.bubble', { scale: 0, transformOrigin: '10% 100%', duration: 0.5, ease: 'back.out(3)', onComplete: startBubble }, 1.2)
          .from('.hero-sq path', { drawSVG: 0, duration: 1, ease: 'power2.inOut' }, 1)
      })

      if (introState.opened) intro()
      else addEventListener(INTRO_EVENT, intro, { once: true })

      if (!reduce) {
        // Letras de borracha no nome
        split.chars.forEach((c) =>
          c.addEventListener('pointerenter', () =>
            gsap.fromTo(
              c,
              { y: 0, rotation: 0, scaleY: 1 },
              {
                keyframes: { y: [0, -26, 0], rotation: [0, gsap.utils.random(-16, 16), 0], scaleY: [1, 1.18, 0.86, 1] },
                duration: 0.55,
                ease: 'power1.inOut',
                overwrite: true,
              },
            ),
          ),
        )
        gsap.to('.spark', { scale: 0.6, rotation: 90, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.25 })
      }

      return () => removeEventListener(INTRO_EVENT, intro)
    },
    { scope: root },
  )

  const grin = (on: boolean) => mascot.current?.mood(on ? 'grin' : 'smile')

  return (
    <section className="hero" id="topo" ref={root}>
      <div className="dots" aria-hidden />
      <div className="wrap hero-grid">
        <div className="hero-text">
          <span className="tag">★ Design · Motion · Sites</span>
          <h1 className="h1" aria-label="Cauê Gabriel">
            <span className="line l1">Cauê</span>
            <span className="line l2">Gabriel</span>
          </h1>
          <p className="lead">
            Eu crio marcas, <mark>animações vetoriais</mark> e sites que se mexem de verdade. Tudo começa num
            rabisco e termina em GSAP e Three.js.
          </p>
          <div className="ctas">
            <a className="btn btn-acid" href="#habilidades" onPointerEnter={() => grin(true)} onPointerLeave={() => grin(false)}>
              Entrar na TV ↓
            </a>
            <a
              className="btn btn-paper"
              href={waLink()}
              target="_blank"
              rel="noopener"
              onPointerEnter={() => grin(true)}
              onPointerLeave={() => grin(false)}
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
        <div className="hero-art">
          <div className="burst" aria-hidden />
          {[
            { cls: 'spark', style: { left: '6%', top: '14%' } },
            { cls: 'spark m', style: { right: '8%', bottom: '20%', width: 34 } },
            { cls: 'spark o', style: { left: '14%', bottom: '10%', width: 28 } },
          ].map((s, i) => (
            <svg key={i} className={s.cls} style={s.style} viewBox="-24 -24 48 48" aria-hidden>
              <path d={STAR_PATH} />
            </svg>
          ))}
          <div className="bubble" aria-live="polite">
            <span ref={bubble}>E aí! Bora criar?</span>
            <span className="caret" />
          </div>
          <Mascot ref={mascot} />
        </div>
        <svg className="hero-sq" viewBox="0 0 180 90" aria-hidden>
          <path d="M6 60 C30 10 50 90 74 44 S120 6 132 52 S166 70 174 30" />
        </svg>
      </div>
    </section>
  )
}

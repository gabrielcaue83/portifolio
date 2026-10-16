import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useRef } from 'react'
import { Underline } from '../ui/Decor'

gsap.registerPlugin(Draggable, InertiaPlugin)

const STICKERS = [
  ['st1', 'GSAP'],
  ['st2', 'Three.js'],
  ['st3', 'SVG animado'],
  ['st4', 'Motion\ndesign'],
  ['st5', 'HTML · CSS · JS'],
  ['st6', '★'],
]

export function About() {
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      let z = 10
      const drags = Draggable.create('.sticker', {
        bounds: stage.current,
        inertia: true,
        edgeResistance: 0.7,
        onPress(this: Draggable) {
          ;(this.target as HTMLElement).style.zIndex = String(++z)
          gsap.to(this.target, { scale: 1.12, boxShadow: '9px 9px 0 #0E0E0E', duration: 0.15 })
        },
        onRelease(this: Draggable) {
          gsap.to(this.target, { scale: 1, boxShadow: '4px 4px 0 #0E0E0E', duration: 0.4, ease: 'elastic.out(1, .4)' })
        },
      })
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
        gsap.from('.sticker', {
          scale: 0,
          rotation: () => gsap.utils.random(-90, 90),
          duration: 0.7,
          ease: 'back.out(2.5)',
          stagger: 0.08,
          scrollTrigger: { trigger: stage.current, start: 'top 80%', once: true },
        })
      return () => drags.forEach((d) => d.kill())
    },
    { scope: stage },
  )

  return (
    <section className="about" id="sobre">
      <div className="wrap about-grid">
        <div>
          <span className="kicker">Quem faz</span>
          <h2 className="h2">
            Prazer, eu sou o{' '}
            <span className="hl">
              Cauê
              <Underline />
            </span>
          </h2>
          <p className="sub">
            Designer e desenvolvedor. Eu junto o que desenho animado ensina (timing, exagero, personalidade) com código,
            pra fazer marcas que ninguém esquece.
          </p>
          <p>
            Meu lance é dar vida às coisas: um logo que pisca, um botão que pula, um site inteiro que reage quando você
            passa o mouse. Se dá pra animar, eu quero animar.
          </p>
          <div className="facts">
            <span className="fact">✏️ rabisco antes de tudo</span>
            <span className="fact">⚡ GSAP no sangue</span>
            <span className="fact">📺 criado à base de desenho animado</span>
          </div>
        </div>
        <div ref={stage} className="stage" aria-label="Adesivos arrastáveis com as ferramentas que uso">
          {STICKERS.map(([cls, text]) => (
            <div key={cls} className={`sticker ${cls}`} style={{ whiteSpace: 'pre' }}>
              {text}
            </div>
          ))}
          <span className="stage-label">↖ arrasta os adesivos</span>
        </div>
      </div>
    </section>
  )
}

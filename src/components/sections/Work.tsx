import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

export function Work() {
  const root = useRef<HTMLElement>(null)

  // Cards inclinam com o mouse
  useGSAP(
    () => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const cleanups = gsap.utils.toArray<HTMLElement>('.proj').map((c) => {
        const rx = gsap.quickTo(c, 'rotationX', { duration: 0.4, ease: 'power3' })
        const ry = gsap.quickTo(c, 'rotationY', { duration: 0.4, ease: 'power3' })
        const move = (e: PointerEvent) => {
          const r = c.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 14)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        c.addEventListener('pointermove', move)
        c.addEventListener('pointerleave', leave)
        return () => {
          c.removeEventListener('pointermove', move)
          c.removeEventListener('pointerleave', leave)
        }
      })
      return () => cleanups.forEach((f) => f())
    },
    { scope: root },
  )

  return (
    <section className="work" id="trampos" ref={root}>
      <div className="wrap">
        <span className="kicker">Trampos</span>
        <h2 className="h2">
          Coisa que já está <span className="hl">no ar</span>
        </h2>
        <p className="sub">Um pouco do que eu já fiz. E tem espaço pro próximo.</p>
        <div className="works">
          <article className="proj pop">
            <div className="thumb thumb-classe">
              <div className="tv">
                <div>
                  <b>Classe Studio</b>
                  <small>barbearia</small>
                </div>
              </div>
            </div>
            <div className="body">
              <span className="meta">Site · GSAP</span>
              <h3>Classe Studio</h3>
              <p>
                Site de página única para uma barbearia, com animações em GSAP, câmera que passeia entre as seções e
                agendamento direto pelo WhatsApp.
              </p>
              <a className="btn btn-acid small go" href="https://gabrielcaue83.github.io/classe-studio/" target="_blank" rel="noopener">
                Ver ao vivo ↗
              </a>
            </div>
          </article>
          <article className="proj pop">
            <div className="thumb thumb-self">
              <div>
                <span className="you">Você está aqui</span>este site inteiro<span className="arrow">↓</span>
              </div>
            </div>
            <div className="body">
              <span className="meta">Landing page · Motion</span>
              <h3>Este site</h3>
              <p>Mascote animado, uma TV que vira portal, morph de vetores, 3D cartoon e tudo que você viu até agora.</p>
              <a className="btn btn-paper small go" href="#topo">
                Ver de novo ↑
              </a>
            </div>
          </article>
          <article className="proj pop">
            <div className="thumb thumb-next">
              <span className="q">?</span>
            </div>
            <div className="body">
              <span className="meta">Próximo trampo</span>
              <h3>A sua marca</h3>
              <p>Esse espaço está guardado pro seu projeto.</p>
              <a className="btn btn-mag small go" href="#contato">
                Vamos criar →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

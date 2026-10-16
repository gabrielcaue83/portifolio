import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { Underline } from '../ui/Decor'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

const K = '#0E0E0E'

/** Roda a animação só enquanto o quadrinho está na tela. */
function whenVisible(el: Element, tl: gsap.core.Timeline) {
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) })
}

export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const s = (n: number) => root.current!.querySelector(`.panel:nth-child(${n}) svg`)!
      const p1 = s(1)
      whenVisible(
        p1,
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.8, paused: true })
          .from(p1.querySelector('.bub-a'), { scale: 0, transformOrigin: '20% 90%', duration: 0.4, ease: 'back.out(3)' })
          .from(p1.querySelectorAll('circle'), { y: -6, opacity: 0, stagger: 0.1, duration: 0.2 })
          .from(p1.querySelector('.bub-b'), { scale: 0, transformOrigin: '80% 100%', duration: 0.4, ease: 'back.out(3)' }, '+=0.3')
          .to(p1, { opacity: 0, duration: 0.2, delay: 1.2 })
          .set(p1, { opacity: 1 }),
      )
      const p2 = s(2)
      whenVisible(
        p2,
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.5, paused: true })
          .fromTo(p2.querySelector('.doodle'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'none' })
          .to(p2.querySelector('.pencil'), { x: -6, y: 4, duration: 0.1, yoyo: true, repeat: 13, ease: 'none' }, 0),
      )
      const p3 = s(3)
      const ball = p3.querySelector('.zoom-ball')
      const lines = p3.querySelectorAll('.ml')
      whenVisible(
        p3,
        gsap
          .timeline({ repeat: -1, paused: true })
          .fromTo(ball, { x: -60, scaleX: 1.4, scaleY: 0.8 }, { x: 10, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%', duration: 0.5, ease: 'power3.out' })
          .fromTo(lines, { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, stagger: 0.05, duration: 0.25 }, 0)
          .to(lines, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.3 })
          .to(ball, { y: -8, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<')
          .to(ball, { x: 120, scaleX: 1.4, scaleY: 0.8, duration: 0.35, ease: 'power3.in' }),
      )
      const p4 = s(4)
      const rocket = p4.querySelector('.rocket')
      whenVisible(
        p4,
        gsap
          .timeline({ repeat: -1, paused: true })
          .to(rocket, { x: 1.5, duration: 0.05, yoyo: true, repeat: 15 })
          .to(p4.querySelector('.flame'), { scaleY: 1.5, transformOrigin: '50% 0%', duration: 0.1, yoyo: true, repeat: 7 }, 0)
          .to(rocket, { y: -170, duration: 0.6, ease: 'power3.in' })
          .set(rocket, { y: 170 })
          .to(rocket, { y: 0, duration: 0.6, ease: 'back.out(1.6)' }),
      )
      gsap.utils.toArray<HTMLElement>('.pow').forEach((p) =>
        gsap.from(p, {
          scale: 0,
          rotation: -60,
          duration: 0.6,
          ease: 'elastic.out(1, .4)',
          delay: 0.35,
          scrollTrigger: { trigger: p.closest('.panel'), start: 'top 75%', once: true },
        }),
      )
    },
    { scope: root },
  )

  return (
    <section className="process" id="processo" ref={root}>
      <div className="wrap">
        <span className="kicker">Como funciona</span>
        <h2 className="h2">
          Do papo ao{' '}
          <span className="hl">
            ar
            <Underline />
          </span>{' '}
          em 4 quadros
        </h2>
        <div className="comic">
          <article className="panel pop">
            <span className="num">1</span>
            <div className="art">
              <svg viewBox="0 0 150 150" aria-hidden>
                <path className="bub-a" d="M14 30 Q14 14 30 14 L94 14 Q110 14 110 30 L110 62 Q110 78 94 78 L46 78 L28 96 L32 78 L30 78 Q14 78 14 62 Z" fill="#F2EEE3" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                <g fill={K}>
                  <circle cx="44" cy="46" r="5" />
                  <circle cx="62" cy="46" r="5" />
                  <circle cx="80" cy="46" r="5" />
                </g>
                <path className="bub-b" d="M56 92 Q56 80 68 80 L124 80 Q136 80 136 92 L136 116 Q136 128 124 128 L120 128 L124 142 L106 128 L68 128 Q56 128 56 116 Z" fill="#B6FF3B" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                <path d="M74 104 L118 104" stroke={K} strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Papo</h3>
            <p>Você me conta do negócio, do público e do que quer alcançar.</p>
            <span className="pow">BLÁ!</span>
          </article>
          <article className="panel pop">
            <span className="num">2</span>
            <div className="art">
              <svg viewBox="0 0 150 150" aria-hidden>
                <path className="doodle" d="M14 110 C30 60 50 130 70 80 S104 40 116 90 S138 110 140 70" fill="none" stroke={K} strokeWidth="4" strokeLinecap="round" />
                <g className="pencil" transform="rotate(35 104 46)">
                  <rect x="92" y="6" width="24" height="70" rx="3" fill="#FF8A00" stroke={K} strokeWidth="4" />
                  <rect x="92" y="6" width="24" height="14" fill="#FF2E93" stroke={K} strokeWidth="4" />
                  <path d="M92 76 L104 98 L116 76 Z" fill="#F2EEE3" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M100 90 L104 98 L108 90 Z" fill={K} />
                </g>
              </svg>
            </div>
            <h3>Rabisco</h3>
            <p>Esboços e referências pra você aprovar a direção antes de tudo.</p>
            <span className="pow">RISC!</span>
          </article>
          <article className="panel pop">
            <span className="num">3</span>
            <div className="art">
              <svg viewBox="0 0 150 150" aria-hidden>
                <g stroke={K} strokeWidth="4" strokeLinecap="round">
                  <line className="ml" x1="12" y1="60" x2="52" y2="60" />
                  <line className="ml" x1="20" y1="78" x2="56" y2="78" />
                  <line className="ml" x1="12" y1="96" x2="50" y2="96" />
                </g>
                <g className="zoom-ball">
                  <circle cx="96" cy="78" r="30" fill="#FF2E93" stroke={K} strokeWidth="4" />
                  <path d="M80 66 Q86 56 98 56" stroke="#F2EEE3" strokeWidth="5" fill="none" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <h3>Animação</h3>
            <p>Crio e dou movimento, ajustando com você no caminho.</p>
            <span className="pow">ZUUM!</span>
          </article>
          <article className="panel pop">
            <span className="num">4</span>
            <div className="art">
              <svg viewBox="0 0 150 150" aria-hidden>
                <g className="rocket">
                  <path d="M75 12 C98 30 104 64 96 96 L54 96 C46 64 52 30 75 12 Z" fill="#F2EEE3" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="75" cy="52" r="11" fill="#B6FF3B" stroke={K} strokeWidth="4" />
                  <path d="M54 78 L36 100 L54 98 Z M96 78 L114 100 L96 98 Z" fill="#FF2E93" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                  <path className="flame" d="M62 98 Q75 140 88 98 Z" fill="#FF2E93" stroke={K} strokeWidth="4" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
            <h3>No ar!</h3>
            <p>Entrego os arquivos organizados e o site publicado.</p>
            <span className="pow">PLIM!</span>
          </article>
        </div>
      </div>
    </section>
  )
}

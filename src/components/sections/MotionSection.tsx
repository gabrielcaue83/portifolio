import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState, type ReactNode } from 'react'
import { audio } from '../audio/audioManager'

gsap.registerPlugin(ScrollTrigger)

const STROKE = { stroke: '#000', strokeWidth: 6, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

const VECTORS: { className: string; color: string; svg: ReactNode }[] = [
  {
    className: 'left-[6%] top-[10%] w-20 md:w-28',
    color: '#ffe600',
    svg: <polygon points="50,6 62,38 96,38 68,58 79,92 50,72 21,92 32,58 4,38 38,38" {...STROKE} />,
  },
  {
    className: 'right-[8%] top-[12%] w-14 md:w-20',
    color: '#ff3ea5',
    svg: <polygon points="58,4 14,58 44,58 32,96 86,38 56,38 70,4" {...STROKE} />,
  },
  {
    className: 'left-[10%] bottom-[12%] w-20 md:w-24',
    color: '#ff2e2e',
    svg: <path d="M50 88 C10 60 4 34 22 20 C36 9 48 18 50 30 C52 18 64 9 78 20 C96 34 90 60 50 88 Z" {...STROKE} />,
  },
  {
    className: 'right-[12%] bottom-[10%] w-20 md:w-28',
    color: 'none',
    svg: (
      <path
        d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a18 18 0 1 1 -18 -18 a26 26 0 1 1 26 26"
        fill="none"
        {...STROKE}
      />
    ),
  },
  {
    className: 'left-[40%] top-[4%] w-12 md:w-16',
    color: '#39ff14',
    svg: <path d="M38 6 h24 v32 h32 v24 h-32 v32 h-24 v-32 h-32 v-24 h32 Z" {...STROKE} />,
  },
  {
    className: 'right-[36%] bottom-[4%] w-12 md:w-16',
    color: '#00e5ff',
    svg: <circle cx="50" cy="50" r="40" {...STROKE} />,
  },
]

const REPEL_RADIUS = 220
const REPEL_FORCE = 120

/** Mascote TV retrô: os olhos seguem o mouse e ele pisca sozinho. */
function TvBuddy({ onPoke, talking }: { onPoke: () => void; talking: boolean }) {
  return (
    <button
      type="button"
      onClick={onPoke}
      data-tv
      data-cursor="oi!"
      aria-label="Mascote TV. Clique para dizer oi."
      className="relative w-56 md:w-72"
    >
      <span
        data-bubble
        className={`cartoon-box absolute -top-14 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-4 py-2 font-display text-xl whitespace-nowrap transition-transform duration-300 ${talking ? 'scale-100' : 'scale-0'}`}
      >
        Oi, sumido!
      </span>
      <svg viewBox="0 0 240 230" className="w-full drop-shadow-[6px_6px_0_#000]">
        <line x1="96" y1="44" x2="64" y2="6" {...STROKE} />
        <line x1="144" y1="44" x2="180" y2="10" {...STROKE} />
        <circle cx="64" cy="6" r="6" fill="#ff3ea5" {...STROKE} strokeWidth={4} />
        <circle cx="180" cy="10" r="6" fill="#39ff14" {...STROKE} strokeWidth={4} />
        <rect x="56" y="196" width="28" height="26" rx="6" fill="#000" />
        <rect x="156" y="196" width="28" height="26" rx="6" fill="#000" />
        <rect x="16" y="40" width="208" height="164" rx="30" fill="#ff7a00" {...STROKE} />
        <rect x="40" y="62" width="160" height="118" rx="22" fill="#00e5ff" {...STROKE} />
        {[96, 144].map((cx) => (
          <g key={cx} data-eye>
            <ellipse cx={cx} cy="108" rx="20" ry="24" fill="#fff" {...STROKE} strokeWidth={5} />
            <g data-pupil>
              <circle cx={cx} cy="110" r="9" fill="#000" />
              <circle cx={cx + 3} cy="106" r="3" fill="#fff" />
            </g>
          </g>
        ))}
        <path
          d={talking ? 'M104 148 Q120 176 136 148 Z' : 'M102 148 Q120 164 138 148'}
          fill={talking ? '#ff2e2e' : 'none'}
          {...STROKE}
          strokeWidth={5}
        />
        <circle cx="206" cy="190" r="5" fill="#000" />
      </svg>
    </button>
  )
}

/** Vetores animados que reagem ao mouse: repulsão, olhos que seguem e traço desenhado no scroll. */
export function MotionSection() {
  const root = useRef<HTMLElement>(null)
  const [talking, setTalking] = useState(false)

  useGSAP(
    (_, contextSafe) => {
      if (!root.current || !contextSafe) return

      // Flutuação idle (no filho, para não brigar com a repulsão no pai)
      gsap.to('[data-float]', {
        y: 'random(-16, 16)',
        rotate: 'random(-14, 14)',
        duration: 'random(1.6, 2.6)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Piscadas em intervalos aleatórios (repeatRefresh sorteia a pausa a cada ciclo)
      gsap
        .timeline({ repeat: -1, repeatRefresh: true })
        .to({}, { duration: 'random(1.5, 4)' })
        .to('[data-eye]', { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08 })
        .to('[data-eye]', { scaleY: 1, duration: 0.12 })

      // Traço do título se desenha conforme o scroll
      const squiggle = root.current.querySelector<SVGPathElement>('[data-squiggle]')
      if (squiggle) {
        const length = squiggle.getTotalLength()
        gsap.fromTo(
          squiggle,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: squiggle, start: 'top 90%', end: 'top 50%', scrub: true },
          },
        )
      }

      const vectors = gsap.utils.toArray<HTMLElement>('[data-vector]').map((el) => ({
        el,
        x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }),
        r: gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3' }),
      }))
      const pupils = gsap.utils.toArray<SVGGElement>('[data-pupil]').map((el) => ({
        el,
        x: gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3' }),
      }))
      const tv = root.current.querySelector<HTMLElement>('[data-tv]')
      const tilt = tv && gsap.quickTo(tv, 'rotation', { duration: 0.6, ease: 'power3' })

      // Só calcula enquanto a seção está na tela
      const visible = ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top' })

      const onMove = contextSafe((e: PointerEvent) => {
        if (!visible.isActive) return

        for (const v of vectors) {
          const rect = v.el.getBoundingClientRect()
          // Centro "de repouso": desconta o deslocamento atual
          const cx = rect.left + rect.width / 2 - Number(gsap.getProperty(v.el, 'x'))
          const cy = rect.top + rect.height / 2 - Number(gsap.getProperty(v.el, 'y'))
          const dx = cx - e.clientX
          const dy = cy - e.clientY
          const dist = Math.hypot(dx, dy) || 1
          const push = Math.max(0, (REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
          v.x((dx / dist) * push)
          v.y((dy / dist) * push)
          v.r((dx / dist) * push * 0.4)
        }

        for (const p of pupils) {
          const eye = p.el.parentElement?.getBoundingClientRect()
          if (!eye) continue
          const dx = e.clientX - (eye.left + eye.width / 2)
          const dy = e.clientY - (eye.top + eye.height / 2)
          const angle = Math.atan2(dy, dx)
          const reach = Math.min(Math.hypot(dx, dy) / 25, 9)
          p.x(Math.cos(angle) * reach)
          p.y(Math.sin(angle) * reach)
        }

        if (tv && tilt) {
          const rect = tv.getBoundingClientRect()
          tilt(gsap.utils.clamp(-10, 10, (e.clientX - (rect.left + rect.width / 2)) / 40))
        }
      })

      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: root },
  )

  const poke = () => {
    audio.play('boing')
    setTalking(true)
    gsap.fromTo('[data-tv]', { scaleY: 0.8, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
    window.setTimeout(() => setTalking(false), 1600)
  }

  return (
    <section id="motion" ref={root} className="relative px-4 py-28 md:px-12">
      <div className="mb-10 text-center">
        <span className="cartoon-box inline-block rounded-full bg-white px-4 py-1 text-sm font-black uppercase">
          Motion · Vetores
        </span>
        <h2 className="text-outline relative mt-6 inline-block text-5xl text-white md:text-8xl">
          Motion que te segue
          <svg viewBox="0 0 600 40" className="absolute top-full left-0 mt-1 w-full" aria-hidden>
            <path
              data-squiggle
              d="M5 20 Q 40 0 75 20 T 145 20 T 215 20 T 285 20 T 355 20 T 425 20 T 495 20 T 565 20 T 595 20"
              fill="none"
              stroke="#ffe600"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </h2>
      </div>

      <div className="cartoon-box bg-halftone relative mx-auto grid h-[72svh] min-h-[440px] max-w-5xl place-items-center overflow-hidden rounded-3xl bg-white">
        {VECTORS.map((v, i) => (
          <div key={i} data-vector className={`pointer-events-none absolute ${v.className}`}>
            <div data-float>
              <svg viewBox="0 0 100 100" fill={v.color} className="w-full overflow-visible drop-shadow-[4px_4px_0_#000]">
                {v.svg}
              </svg>
            </div>
          </div>
        ))}
        <TvBuddy onPoke={poke} talking={talking} />
        <p className="absolute bottom-4 font-black">Mexa o mouse por aqui 👀</p>
      </div>
    </section>
  )
}

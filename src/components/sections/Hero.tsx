import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { SplitText } from 'gsap/SplitText'
import { ArrowDown, Hand, Siren } from 'lucide-react'
import { useRef } from 'react'
import { useLenis } from '../../hooks/useLenis'
import { audio } from '../audio/audioManager'
import { Button } from '../ui/Button'

gsap.registerPlugin(Draggable, InertiaPlugin, SplitText)

const POP = ['#ff3ea5', '#00e5ff', '#39ff14', '#ff7a00', '#9b5cff']

/** Pontos de uma explosão de quadrinhos ("starburst"). */
const burst = Array.from({ length: 28 }, (_, i) => {
  const r = i % 2 ? 46 : 70
  const a = (i / 28) * Math.PI * 2
  return `${75 + Math.cos(a) * r},${75 + Math.sin(a) * r}`
}).join(' ')

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const lenis = useLenis()

  useGSAP(
    (_, contextSafe) => {
      if (!title.current || !root.current || !contextSafe) return
      const split = SplitText.create(title.current, { type: 'words,chars' })

      gsap
        .timeline()
        .from(split.chars, {
          yPercent: 120,
          rotate: 'random(-30, 30)',
          autoAlpha: 0,
          stagger: 0.025,
          duration: 0.6,
          ease: 'back.out(2.5)',
        })
        .from('[data-pop]', { scale: 0, rotate: -12, stagger: 0.1, duration: 0.5, ease: 'back.out(2.5)' }, 0.3)
        .from(
          '[data-sticker]',
          { scale: 0, rotate: 'random(-90, 90)', stagger: 0.12, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
          0.6,
        )

      // Cada letra pula e troca de cor ao passar o mouse
      const jump = contextSafe((char: Element) => {
        gsap
          .timeline({ overwrite: 'auto' })
          .to(char, {
            y: -26,
            rotate: gsap.utils.random(-18, 18),
            color: gsap.utils.random(POP),
            duration: 0.15,
            ease: 'power2.out',
          })
          .to(char, { y: 0, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' })
          .to(char, { color: '#ffffff', duration: 0.4 }, '+=0.6')
      })
      split.chars.forEach((char) => char.addEventListener('mouseenter', () => jump(char)))

      // Adesivos arrastáveis, com inércia ao soltar
      const stickers = Draggable.create('[data-sticker]', {
        type: 'x,y',
        bounds: root.current,
        inertia: true,
        edgeResistance: 0.65,
        onPress(this: Draggable) {
          gsap.to(this.target, { scale: 1.12, rotate: '+=8', duration: 0.2 })
        },
        onDragStart: () => audio.play('boing'),
        onRelease(this: Draggable) {
          gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
        },
      })

      gsap.to('[data-spin]', { rotate: 360, duration: 12, repeat: -1, ease: 'none' })

      // Conteúdo sobe e some enquanto o hero sai da tela (scrub = preso ao scroll)
      gsap.to(content.current, {
        yPercent: -40,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      return () => stickers.forEach((d) => d.kill())
    },
    { scope: root },
  )

  const scrollTo = (id: string) => {
    if (lenis) lenis.scrollTo(id, { duration: 2.2 })
    else document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={root}
      className="bg-halftone relative grid min-h-svh items-center overflow-hidden px-4 py-16 md:grid-cols-2 md:px-12"
    >
      <div ref={content} className="relative z-10 space-y-6">
        <span
          data-pop
          className="cartoon-box inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 font-black uppercase"
        >
          <span className="size-3 animate-blink rounded-full bg-pop-red" /> No ar · Creative Web Dev
        </span>
        <h1
          ref={title}
          className="text-outline text-6xl leading-[0.95] text-white md:text-8xl"
          data-cursor=""
        >
          Olá, eu faço a web pular!
        </h1>
        <p data-pop className="max-w-md text-lg font-bold">
          Experiências interativas com 3D, motion e muita personalidade. Passe o mouse no título,
          arraste os adesivos e clique no nó.
        </p>
        <div data-pop className="flex flex-wrap gap-4">
          <Button variant="cyan" onClick={() => scrollTo('#three')} data-cursor="bora!">
            Explorar <ArrowDown strokeWidth={3} />
          </Button>
          <Button variant="pink" onClick={() => scrollTo('#contact')} data-cursor="não!">
            Não aperte <Siren strokeWidth={3} />
          </Button>
        </div>
      </div>

      {/* Adesivos arrastáveis */}
      <div
        data-sticker
        data-cursor="arraste"
        className="absolute top-[2%] right-[4%] z-20 w-20 touch-none md:top-[14%] md:right-[34%] md:w-40"
      >
        <svg viewBox="0 0 150 150" className="drop-shadow-[4px_4px_0_#000]">
          <polygon points={burst} fill="#ffe600" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
          <text
            x="75"
            y="86"
            textAnchor="middle"
            className="font-display"
            fontSize="30"
            fill="#ff3ea5"
            stroke="#000"
            strokeWidth="2"
          >
            WOW!
          </text>
        </svg>
      </div>

      <div
        data-sticker
        data-cursor="arraste"
        className="absolute right-[10%] bottom-[10%] z-20 hidden w-24 touch-none md:block"
      >
        <svg viewBox="0 0 100 140" className="drop-shadow-[4px_4px_0_#000]">
          <polygon
            points="58,4 14,78 46,78 34,136 88,52 56,52 74,4"
            fill="#ff3ea5"
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        data-sticker
        data-cursor="arraste"
        className="absolute right-[30%] bottom-[8%] z-20 hidden size-32 touch-none md:block"
      >
        <div className="cartoon-box grid size-full place-items-center rounded-full bg-pop-green">
          <svg data-spin viewBox="0 0 120 120" className="absolute inset-0 size-full">
            <defs>
              <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text className="font-display" fontSize="13" letterSpacing="2">
              <textPath href="#badge-circle">• FEITO À MÃO • COM CÓDIGO </textPath>
            </text>
          </svg>
          <Hand strokeWidth={3} className="size-8" />
        </div>
      </div>
    </section>
  )
}

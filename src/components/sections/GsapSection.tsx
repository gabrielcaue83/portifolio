import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Gamepad2, Music, Rocket, ShoppingBag, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { Card } from '../ui/Card'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Projetos de exemplo: troque pelos seus
const PROJECTS: { title: string; tags: string[]; color: string; Icon: LucideIcon }[] = [
  { title: 'Loja Bubblegum', tags: ['WebGL', 'E-commerce'], color: 'bg-pop-yellow', Icon: ShoppingBag },
  { title: 'Arcade Toon', tags: ['Three.js', 'Game'], color: 'bg-pop-cyan', Icon: Gamepad2 },
  { title: 'Rádio Pop', tags: ['Howler', 'Áudio'], color: 'bg-pop-green', Icon: Music },
  { title: 'Missão Lunar', tags: ['GSAP', 'Storytelling'], color: 'bg-pop-orange', Icon: Rocket },
]

/** Seção de demonstração do GSAP: texto dividido, pin com scroll horizontal e paralaxe. */
export function GsapSection() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const parallax = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!title.current || !track.current) return

      // 1. Título letra a letra, preso ao scroll
      const split = SplitText.create(title.current, { type: 'words,chars' })
      gsap.from(split.chars, {
        yPercent: 130,
        rotate: 25,
        autoAlpha: 0,
        stagger: 0.04,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: title.current, start: 'top 90%', end: 'top 45%', scrub: 1 },
      })

      // 2. Pin + scroll horizontal: o scroll vertical vira movimento lateral
      const trackEl = track.current
      const distance = () => trackEl.scrollWidth - window.innerWidth
      const range = { trigger: pin.current, start: 'top top', end: () => `+=${distance()}` }

      const horizontal = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { ...range, pin: true, scrub: 1, invalidateOnRefresh: true },
      })

      // Cada card balança enquanto atravessa a tela (containerAnimation = tempo do scroll horizontal)
      gsap.utils.toArray<HTMLElement>('[data-project]').forEach((card) => {
        gsap.fromTo(
          card,
          { rotate: 8, y: 16 },
          {
            rotate: -8,
            y: -16,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontal,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })

      gsap.to('[data-hprogress]', { scaleX: 1, ease: 'none', scrollTrigger: { ...range, scrub: true } })

      // 3. Paralaxe: cada camada anda numa velocidade (data-speed)
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        const speed = Number(el.dataset.speed)
        gsap.fromTo(
          el,
          { yPercent: speed * 60 },
          {
            yPercent: -speed * 60,
            ease: 'none',
            scrollTrigger: { trigger: parallax.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="gsap" ref={root} className="relative">
      <div className="px-4 pt-32 pb-16 text-center">
        <span className="cartoon-box inline-block rounded-full bg-white px-4 py-1 text-sm font-black uppercase">
          GSAP · ScrollTrigger
        </span>
        <h2 ref={title} className="text-outline mt-6 text-5xl leading-none text-white md:text-9xl">
          Scroll é animação
        </h2>
      </div>

      {/* Pin horizontal */}
      <div ref={pin} className="relative flex h-svh flex-col justify-center overflow-hidden">
        <p className="mb-6 px-[8vw] font-display text-xl text-white uppercase [-webkit-text-stroke:1px_black]">
          Projetos →
        </p>
        <div ref={track} className="flex w-max gap-8 px-[8vw]">
          {PROJECTS.map(({ title, tags, color, Icon }, i) => (
            <Card
              key={title}
              data-project
              data-cursor="em breve"
              color={color}
              className="flex h-[52svh] w-[78vw] flex-col justify-between rounded-3xl md:w-[38vw]"
            >
              <div className="flex items-start justify-between">
                <span className="text-outline font-display text-7xl text-white md:text-8xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cartoon-box grid size-16 place-items-center rounded-full bg-white">
                  <Icon strokeWidth={2.5} size={30} />
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl md:text-4xl">{title}</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border-[3px] border-black bg-white px-3 py-0.5 text-sm font-black">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mx-[8vw] mt-8 h-4 overflow-hidden rounded-full border-4 border-black bg-white">
          <div data-hprogress className="h-full origin-left scale-x-0 bg-black" />
        </div>
      </div>

      {/* Paralaxe */}
      <div ref={parallax} className="relative h-[130svh] overflow-hidden">
        <span
          data-speed="1.4"
          className="text-outline absolute top-[12%] left-[4%] font-display text-[22vw] leading-none text-white"
        >
          PARA
        </span>
        <span
          data-speed="-0.8"
          className="text-outline absolute right-[4%] bottom-[10%] font-display text-[22vw] leading-none text-pop-yellow"
        >
          LAXE
        </span>
        <span data-speed="2.4" className="cartoon-box absolute top-[30%] right-[18%] size-20 rounded-full bg-pop-yellow md:size-28" />
        <span data-speed="3" className="cartoon-box absolute bottom-[28%] left-[16%] size-16 rotate-12 bg-pop-green md:size-24" />
        <span data-speed="-1.8" className="cartoon-box absolute top-[58%] right-[40%] size-12 rounded-full bg-pop-cyan" />
        <div data-speed="0.3" className="absolute inset-x-4 top-[42%] mx-auto max-w-md">
          <Card tilt="left" className="space-y-2 text-center">
            <h3 className="text-2xl">Paralaxe</h3>
            <p className="font-bold">
              Cada camada anda num ritmo diferente. O mundo 3D lá atrás é a camada mais funda.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

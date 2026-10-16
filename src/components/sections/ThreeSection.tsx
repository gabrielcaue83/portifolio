import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MousePointerClick } from 'lucide-react'
import { useRef } from 'react'

const CHAPTERS = [
  {
    tag: '01',
    title: 'Cel-shading',
    text: 'A luz é quantizada em bandas chapadas, como tinta guache. Role e veja as bandas caírem de 4 para 2.',
    color: 'bg-pop-cyan',
  },
  {
    tag: '02',
    title: 'Contorno de nanquim',
    text: 'Cada objeto ganha uma casca preta extrudada pelas normais: o border-4 da interface, só que em 3D.',
    color: 'bg-pop-pink',
  },
  {
    tag: '03',
    title: 'Pôr do sol no scroll',
    text: 'O ScrollTrigger dirige câmera, sol e cor do céu num trilho contínuo, do topo até o rodapé.',
    color: 'bg-pop-orange',
  },
]

/**
 * Seção alta com conteúdo sticky: enquanto ela rola, o CameraDirector orbita a
 * ilha 3D e este componente troca os capítulos no mesmo ritmo.
 */
export function ThreeSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const range = { trigger: root.current, start: 'top top', end: 'bottom bottom' }
      const cards = gsap.utils.toArray<HTMLElement>('[data-chapter]')
      gsap.set(cards, { autoAlpha: 0, y: 60, rotate: 4 })

      const tl = gsap.timeline({ scrollTrigger: { ...range, scrub: 0.5 } })
      cards.forEach((card, i) => {
        tl.to(card, { autoAlpha: 1, y: 0, rotate: i % 2 ? 2 : -2, duration: 1, ease: 'back.out(2)' })
        if (i < cards.length - 1) tl.to(card, { autoAlpha: 0, y: -60, rotate: -4, duration: 1 }, '+=1.4')
      })
      tl.to({}, { duration: 0.8 })

      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { ...range, scrub: true } })

      gsap.from('[data-three-title]', {
        y: 80,
        autoAlpha: 0,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 10%', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section id="three" ref={root} className="relative h-[360svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end gap-4 px-4 pb-20 md:justify-center md:gap-5 md:px-12 md:pb-0">
        <div data-three-title className="space-y-3">
          <span className="cartoon-box inline-block rounded-full bg-white px-4 py-1 text-sm font-black uppercase">
            Three.js · Toon Shader
          </span>
          <h2 className="text-outline text-4xl text-white md:text-7xl">Mundo Toon</h2>
        </div>

        <div className="relative h-48 w-full max-w-md md:h-52">
          {CHAPTERS.map((c) => (
            <article
              key={c.tag}
              data-chapter
              className={`cartoon-box absolute inset-0 space-y-2 rounded-2xl p-5 md:p-6 ${c.color}`}
            >
              <span className="font-display text-sm">{c.tag} / 03</span>
              <h3 className="text-2xl md:text-3xl">{c.title}</h3>
              <p className="text-sm font-bold md:text-base">{c.text}</p>
            </article>
          ))}
        </div>

        <p className="cartoon-box inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-black">
          <MousePointerClick size={18} strokeWidth={3} /> Clique nos cristais da ilha
        </p>

        <div className="h-4 w-full max-w-md overflow-hidden rounded-full border-4 border-black bg-white">
          <div data-progress className="h-full origin-left scale-x-0 bg-black" />
        </div>
      </div>
    </section>
  )
}

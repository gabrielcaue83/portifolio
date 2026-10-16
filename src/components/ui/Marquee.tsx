import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = ['Three.js', 'WebGL', 'GSAP', 'React', 'Shaders', 'Motion Design', 'Creative Coding', 'Tailwind']

/** Faixa infinita que acelera e inverte de direção com a velocidade do scroll. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const loop = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 24, repeat: -1 })
    // Folga para poder tocar ao contrário sem bater no início
    loop.totalTime(loop.duration() * 100)

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6)
        gsap.to(loop, { timeScale: self.direction * boost, duration: 0.2, overwrite: true })
        gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.25 })
      },
    })
  })

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-6 px-6 font-display text-2xl text-pop-yellow uppercase md:text-4xl">
          {item} <span className="text-pop-pink">★</span>
        </span>
      ))}
    </div>
  )

  return (
    <div ref={root} className="relative z-10 -rotate-2 overflow-hidden border-y-4 border-black bg-black py-3">
      <div ref={track} className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

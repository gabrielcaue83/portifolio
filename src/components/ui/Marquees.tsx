import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { STAR_PATH } from '../../lib/shapes'

gsap.registerPlugin(ScrollTrigger)

const ROWS = [
  { cls: 'mq-mag', dir: -1, words: ['Motion design', 'Animação vetorial', 'GSAP', 'Three.js', 'Identidade visual'] },
  { cls: 'mq-acid', dir: 1, words: ['Sites que se mexem', 'Logo animado', 'Social media', 'Mascotes', 'Landing pages'] },
]

/** Dois letreiros em sentidos opostos que aceleram com o scroll. */
export function Marquees() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const loops = gsap.utils.toArray<HTMLElement>('.mq-track').map((t) => {
        const dir = Number(t.dataset.dir)
        return gsap.fromTo(
          t,
          { xPercent: dir < 0 ? 0 : -50 },
          { xPercent: dir < 0 ? -50 : 0, duration: 26, ease: 'none', repeat: -1 },
        )
      })
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        loops.forEach((l) => l.pause())
        return
      }
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
          const s = self.direction
          loops.forEach((l) => {
            gsap.to(l, { timeScale: boost * s, duration: 0.2, overwrite: true })
            gsap.to(l, { timeScale: s, duration: 1.2, delay: 0.25 })
          })
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="marquees" aria-hidden>
      {ROWS.map((row) => (
        <div key={row.cls} className={`mq ${row.cls}`}>
          <div className="mq-track" data-dir={row.dir}>
            {Array.from({ length: 4 }, (_, k) =>
              row.words.map((w) => (
                <span key={`${k}-${w}`}>
                  {w}
                  <svg viewBox="-24 -24 48 48">
                    <path d={STAR_PATH} />
                  </svg>
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

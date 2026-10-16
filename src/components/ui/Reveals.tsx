import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

/**
 * Entradas no scroll que valem para a página toda: títulos palavra por
 * palavra, sublinhado rabiscado se desenhando e cards pulando pra dentro.
 * Montado depois das seções para enxergar todo o DOM.
 */
export function Reveals() {
  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.utils.toArray<HTMLElement>('.h2').forEach((h) => {
      const { words } = SplitText.create(h, { type: 'words' })
      gsap.from(words, {
        yPercent: 110,
        rotation: () => gsap.utils.random(-10, 10),
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2.2)',
        stagger: 0.07,
        scrollTrigger: { trigger: h, start: 'top 85%', once: true },
      })
    })

    gsap.utils.toArray<SVGPathElement>('.u path').forEach((p) =>
      gsap.from(p, {
        drawSVG: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 0.4,
        scrollTrigger: { trigger: p.closest('.h2'), start: 'top 80%', once: true },
      }),
    )

    gsap.set('.pop', { opacity: 0, scale: 0.7, rotation: () => gsap.utils.random(-7, 7), y: 40 })
    ScrollTrigger.batch('.pop', {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.12, clearProps: 'transform' }),
    })

    // Fontes e imagens mudam alturas: recalcula tudo quando a página termina de carregar
    const refresh = () => ScrollTrigger.refresh()
    addEventListener('load', refresh)
    return () => removeEventListener('load', refresh)
  })

  return null
}

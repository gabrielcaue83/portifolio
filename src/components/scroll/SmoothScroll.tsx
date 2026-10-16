import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useState, type ReactNode } from 'react'
import { LenisContext } from '../../hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

/** Scroll suave com Lenis rodando no ticker do GSAP e sincronizado com o ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Fontes web mudam a altura da página: recalcula os triggers quando carregarem
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    // Com movimento reduzido fica o scroll nativo; o ScrollTrigger funciona igual
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true })

    // A cada frame do Lenis, o ScrollTrigger recalcula as posições...
    instance.on('scroll', ScrollTrigger.update)
    // ...e o Lenis é dirigido pelo ticker do GSAP: um único loop de RAF para tudo
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // A instância só existe depois do efeito; o estado a expõe via contexto
    // oxlint-disable-next-line react/set-state-in-effect
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

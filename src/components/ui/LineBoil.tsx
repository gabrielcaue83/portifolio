import { useEffect, useRef } from 'react'

/**
 * Filtro "line boil": o contorno treme como desenho feito à mão.
 * Troca a semente do ruído 12x por segundo ("animação em dois").
 */
export function LineBoil() {
  const turbulence = useRef<SVGFETurbulenceElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let seed = 1
    const id = setInterval(() => {
      seed = (seed % 6) + 1
      turbulence.current?.setAttribute('seed', String(seed))
    }, 1000 / 12)
    return () => clearInterval(id)
  }, [])

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={1} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} />
      </filter>
    </svg>
  )
}

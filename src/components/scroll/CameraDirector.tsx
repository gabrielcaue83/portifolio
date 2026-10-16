import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flatten, getShots, setRigSegments, shortestHue, type Shot } from '../../lib/rig'

gsap.registerPlugin(ScrollTrigger)

const transition = gsap.parseEase('power2.inOut')
const linear = gsap.parseEase('none')

/**
 * Liga o trilho da câmera 3D ao ScrollTrigger. Cada trecho é um ScrollTrigger
 * sem animação própria: o World lê o progresso deles todo frame (solveRig).
 *
 * Deve ser montado DEPOIS das seções, para que os pins já existam quando
 * as posições forem medidas.
 */
export function CameraDirector() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, (ctx) => {
      const shots = getShots(Boolean(ctx.conditions?.wide))

      // [seção, início, fim, de, para, easing]
      const plan: [string, string, string, Shot, Shot, (p: number) => number][] = [
        // Hero -> Three.js: mergulho até a ilha enquanto a seção entra
        ['#three', 'top bottom', 'top top', shots.hero, shots.threeIn, transition],
        // Dentro da seção Three.js (sticky): órbita, pôr do sol, bandas 4 -> 2
        ['#three', 'top top', 'bottom bottom', shots.threeIn, shots.threeOut, linear],
        ['#gsap', 'top bottom', 'top top', shots.threeOut, shots.gsapIn, transition],
        // Durante a seção GSAP (com pin horizontal) a câmera atravessa o confete
        ['#gsap', 'top top', 'bottom bottom', shots.gsapIn, shots.gsapOut, linear],
        ['#motion', 'top bottom', 'top top', shots.gsapOut, shots.motion, transition],
        // Contato é a última seção: o trecho termina no fim da página
        ['#contact', 'top bottom', 'bottom bottom', shots.motion, shots.contact, transition],
      ]

      const segments = plan.map(([trigger, start, end, from, to, ease]) => ({
        trigger: ScrollTrigger.create({ trigger, start, end }),
        from: flatten(from),
        to: shortestHue(flatten(from), flatten(to)),
        ease,
      }))

      setRigSegments(flatten(shots.hero), segments)
      return () => setRigSegments(flatten(shots.hero), [])
    })
  })

  return null
}

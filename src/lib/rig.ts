import gsap from 'gsap'
import type { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Color } from 'three'

/**
 * Estado compartilhado entre o DOM (GSAP/ScrollTrigger escrevem) e o Canvas
 * (useFrame lê). Objeto mutável de propósito: nada aqui passa pelo React,
 * então o scroll não causa re-render.
 */

/** Altura (eixo Y) de cada "estação" do mundo 3D. A câmera mergulha de uma para a outra. */
export const STATION_Y = {
  hero: 0,
  three: -14,
  gsap: -28,
  motion: -44,
  contact: -58,
} as const

export type Shot = {
  pos: [number, number, number]
  look: [number, number, number]
  bg: string
  /** 0 = sol do meio-dia, 1 = pôr do sol (cenário Three.js) */
  sun: number
  /** Número de bandas de luz do toon shader */
  steps: number
  /** Giro da ilha (voltas) */
  spin: number
}

/** Valores planos para o GSAP interpolar num único tween. */
export type RigState = ReturnType<typeof flatten>

const hsl = { h: 0, s: 0, l: 0 }

export function flatten(shot: Shot) {
  // Céu em HSL: interpolar em RGB passa por cinza (ex.: ciano -> laranja)
  new Color(shot.bg).getHSL(hsl)
  return {
    px: shot.pos[0],
    py: shot.pos[1],
    pz: shot.pos[2],
    lx: shot.look[0],
    ly: shot.look[1],
    lz: shot.look[2],
    h: hsl.h,
    s: hsl.s,
    l: hsl.l,
    sun: shot.sun,
    steps: shot.steps,
    spin: shot.spin,
  }
}

const base = { sun: 0, steps: 4, spin: 0 }

/** Enquadramentos de câmera por seção. `narrow` = telas estreitas (conteúdo embaixo, 3D em cima). */
export function getShots(wide: boolean) {
  const side = wide ? -2.2 : 0
  const y = STATION_Y
  return {
    hero: { ...base, pos: [0, 0, 6], look: [0, 0, 0], bg: '#ffe600' },
    // Telas estreitas: câmera mais longe e olhando abaixo da ilha, que sobe para o terço
    // superior e não fica atrás do texto (que ocupa a parte de baixo)
    threeIn: {
      ...base,
      pos: wide ? [0, y.three + 2.5, 9] : [0, y.three + 0.5, 18],
      look: wide ? [side, y.three, 0] : [0, y.three - 4, 0],
      bg: '#00e5ff',
    },
    threeOut: {
      pos: wide ? [-1, y.three + 1.2, 6.5] : [-1, y.three + 1, 14],
      look: wide ? [side * 0.7, y.three - 0.3, 0] : [0, y.three - 3.4, 0],
      bg: '#ff7a00',
      sun: 1,
      steps: 2,
      spin: 1,
    },
    gsapIn: { ...base, steps: 3, spin: 1, pos: [0, y.gsap + 4, 8], look: [0, y.gsap, 0], bg: '#ff3ea5' },
    gsapOut: { ...base, steps: 3, spin: 1, pos: [0, y.gsap - 6, 2], look: [0, y.gsap - 9, -3], bg: '#2e6bff' },
    motion: { ...base, steps: 3, spin: 1, pos: [0, y.motion, 10], look: [0, y.motion, 0], bg: '#9b5cff' },
    contact: {
      ...base,
      steps: 3,
      spin: 1,
      pos: [0, y.contact + 0.5, wide ? 7 : 11],
      look: [wide ? -2 : 0, y.contact - (wide ? 0 : 2.2), 0],
      bg: '#ffe600',
    },
  } satisfies Record<string, Shot>
}

/** Estado vivo da câmera/cenário, começa no enquadramento do Hero. */
export const rig: RigState = flatten(getShots(true).hero)

/** Um trecho do trilho: enquanto o ScrollTrigger avança de 0 a 1, o rig vai de `from` a `to`. */
export type RigSegment = {
  trigger: ScrollTrigger
  from: RigState
  to: RigState
  ease: (p: number) => number
}

export const rigSegments: RigSegment[] = []
let restState: RigState = { ...rig }

/** Ajusta o matiz de destino para girar pelo caminho mais curto no círculo de cores. */
export function shortestHue(from: RigState, to: RigState): RigState {
  const delta = to.h - from.h
  return { ...to, h: to.h - Math.round(delta) }
}

export function setRigSegments(rest: RigState, segments: RigSegment[]) {
  restState = rest
  rigSegments.splice(0, rigSegments.length, ...segments)
}

/**
 * Recalcula o rig a partir do progresso dos ScrollTriggers. Os trechos são uma
 * corrente (o `to` de um é o `from` do próximo), então vale o último trecho já
 * iniciado. Calcular do zero todo frame evita conflito entre tweens que
 * disputam as mesmas propriedades quando o usuário pula pela página.
 */
export function solveRig() {
  let state = restState
  for (const segment of rigSegments) {
    const p = segment.trigger.progress
    if (p <= 0) break
    state = gsap.utils.interpolate(segment.from, segment.to, segment.ease(p))
  }
  Object.assign(rig, state)
}

/** Intensidade do Easter Egg (0 = calmo, 1 = PÂNICO). */
export const fx = { panic: 0 }

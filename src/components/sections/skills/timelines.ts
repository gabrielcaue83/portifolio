import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MORPH_SHAPES } from '../../../lib/shapes'
import { tv } from '../../../lib/tv'
import { BALL_TOTAL, CONTACTS, GHOSTS, GROUND, ballAt } from './ballPath'

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin)

/**
 * Roteiro de cada canal da TV. Cada função devolve uma timeline que a
 * timeline mestre (presa ao scroll) encaixa no lugar certo. Duração em
 * "unidades de scroll": 1 unidade ≈ 1 altura de tela.
 *
 * Regra: tudo é fromTo com início explícito + immediateRender: false, e o
 * estado inicial vem de gsap.set. Com invalidateOnRefresh, um .to() regrava o
 * início a partir do estado atual da tela e "vaza" (ex.: balão aparecendo antes da hora).
 */

const $ = <T extends Element = Element>(root: Element, sel: string) => root.querySelector<T>(sel)!
const $$ = (root: Element, sel: string) => Array.from(root.querySelectorAll(sel))

/** Balão "POW!" que estoura e some. */
function pop(tl: gsap.core.Timeline, el: Element, at: number, hold = 0.35) {
  const rotation = gsap.utils.random(-12, 12)
  gsap.set(el, { autoAlpha: 0, scale: 0 })
  tl.fromTo(
    el,
    { autoAlpha: 0, scale: 0, rotation: -30 },
    { autoAlpha: 1, scale: 1, rotation, duration: 0.08, ease: 'back.out(3)', immediateRender: false },
    at,
  ).fromTo(
    el,
    { autoAlpha: 1, scale: 1, rotation },
    { autoAlpha: 0, scale: 0, duration: 0.08, ease: 'back.in(2)', immediateRender: false },
    at + hold,
  )
}

function infoIn(tl: gsap.core.Timeline, root: Element) {
  const info = $(root, '.world-info')
  gsap.set(info, { autoAlpha: 0 }) // escondido enquanto o mundo aparece pequeno na tela da TV
  tl.fromTo(
    info,
    { autoAlpha: 0, y: 40, rotation: -3 },
    { autoAlpha: 1, y: 0, rotation: 0, duration: 0.25, ease: 'back.out(2)', immediateRender: false },
    0,
  )
}

/** Canal 1 · Motion design: a bolinha quica pela tela, deixando o spacing desenhado. */
export function buildMotion(root: Element) {
  const ball = $(root, '[data-ball]')
  const squash = $(root, '[data-squash]')
  const shadow = $(root, '[data-shadow]')
  const ghosts = $$(root, '[data-ghost]') as SVGCircleElement[]
  const pops = $$(root, '[data-pop]')
  const proxy = { u: 0 }
  const D = 2.4

  const render = () => {
    const b = ballAt(proxy.u)
    gsap.set(ball, { x: b.x, y: b.y })
    gsap.set(squash, { scaleX: b.sx, scaleY: b.sy, transformOrigin: '50% 100%' })
    const height = Math.min((GROUND - b.y) / 550, 1)
    gsap.set(shadow, { attr: { cx: b.x }, scale: 1 - height * 0.55, opacity: 0.35 - height * 0.22, transformOrigin: '50% 50%' })
    ghosts.forEach((g, i) => g.setAttribute('opacity', GHOSTS[i].u <= proxy.u ? '0.35' : '0'))
  }
  render()

  const tl = gsap.timeline()
  infoIn(tl, root)
  tl.fromTo(proxy, { u: 0 }, { u: BALL_TOTAL, duration: D, ease: 'none', onUpdate: render, immediateRender: false }, 0.1)
  const at = (u: number) => 0.1 + (u / BALL_TOTAL) * D
  pop(tl, pops[0], at(CONTACTS[0]) - 0.04)
  pop(tl, pops[1], at(CONTACTS[0] + 0.1))
  pop(tl, pops[2], at(CONTACTS[1]) - 0.04)
  pop(tl, pops[3], at(CONTACTS[2]) - 0.04, 0.6)
  return tl
}

/** Canal 2 · Animação vetorial: morph entre formas, fundo trocando de cor e traço se desenhando. */
export function buildVector(root: Element) {
  const shape = $(root, '[data-morph]')
  const shadow = $(root, '[data-morph-shadow]')
  const spin = $(root, '[data-spin]')
  const sign = $(root, '[data-sign]')
  const pops = $$(root, '[data-pop]')

  const tl = gsap.timeline()
  infoIn(tl, root)
  tl.fromTo(sign, { drawSVG: '0%' }, { drawSVG: '100%', duration: 2.2, ease: 'none', immediateRender: false }, 0.1)

  gsap.set(sign, { drawSVG: '0%' })
  MORPH_SHAPES.slice(1).forEach((s, i) => {
    const prev = MORPH_SHAPES[i]
    const t = 0.35 + i * 0.65
    const opts = { immediateRender: false }
    tl.fromTo([shape, shadow], { morphSVG: prev.d }, { morphSVG: s.d, duration: 0.4, ease: 'power2.inOut', ...opts }, t)
      .fromTo(shape, { fill: prev.fill }, { fill: s.fill, duration: 0.3, ...opts }, t)
      .fromTo(root, { backgroundColor: prev.bg }, { backgroundColor: s.bg, duration: 0.3, ...opts }, t)
      .fromTo(spin, { rotation: -14 }, { rotation: 0, svgOrigin: '0 0', duration: 0.45, ease: 'back.out(3)', ...opts }, t)
  })
  pop(tl, pops[0], 0.42)
  pop(tl, pops[1], 1.1)
  pop(tl, pops[2], 1.75, 0.5)
  tl.to({}, { duration: 0.2 })
  return tl
}

/** Canal 3 · 3D: só conduz o progresso; quem desenha é o PlanetScene. */
export function buildPlanet(root: Element) {
  const tl = gsap.timeline()
  infoIn(tl, root)
  tl.fromTo(tv, { planet: 0 }, { planet: 1, duration: 2.3, ease: 'none', immediateRender: false }, 0)
  pop(tl, $(root, '[data-pop]'), 1.9, 0.4)
  return tl
}

/** Canal 4 · Sites: o site se monta, o cursor clica e a janela vira celular. */
export function buildSites(root: Element, narrow: boolean) {
  const browser = $(root, '[data-browser]')
  const url = $(root, '[data-url]')
  const parts = $$(root, '[data-part]')
  const cards = $$(root, '[data-card]')
  const btn = $(root, '[data-bbtn]')
  const cursor = $(root, '[data-bcursor]')
  const pops = $$(root, '[data-pop]')
  const URL = 'caue.dev/seu-projeto'
  const typed = { n: 0 }

  const opts = { immediateRender: false }
  gsap.set(browser, { scale: 0.6, autoAlpha: 0, width: narrow ? '92%' : '56%' })
  gsap.set(parts, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(cards, { y: 80, scaleY: 0.4, autoAlpha: 0, transformOrigin: '50% 100%' })
  gsap.set(cursor, { left: '30%', top: '86%', autoAlpha: 1 })
  url.textContent = ''

  const tl = gsap.timeline()
  infoIn(tl, root)
  tl.fromTo(browser, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(1.6)', immediateRender: false }, 0)
    .fromTo(
      typed,
      { n: 0 },
      {
        n: URL.length,
        duration: 0.35,
        ease: 'none',
        immediateRender: false,
        onUpdate: () => void (url.textContent = URL.slice(0, Math.round(typed.n))),
      },
      0.2,
    )
    .fromTo(parts, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.18, stagger: 0.12, ease: 'back.out(2)', immediateRender: false }, 0.5)
    .fromTo(
      cards,
      { y: 80, scaleY: 0.4, autoAlpha: 0, transformOrigin: '50% 100%' },
      { y: 0, scaleY: 1, autoAlpha: 1, duration: 0.25, stagger: 0.1, ease: 'back.out(2.2)', immediateRender: false },
      0.95,
    )
    .fromTo(cursor, { left: '30%', top: '86%' }, { left: '78%', top: '30%', duration: 0.35, ease: 'power2.inOut', immediateRender: false }, 1.3)
    .fromTo(btn, { scale: 1 }, { scale: 0.85, duration: 0.05, ...opts }, 1.66)
    .fromTo(
      btn,
      { scale: 0.85, backgroundColor: '#B6FF3B', color: '#0E0E0E' },
      { scale: 1.15, backgroundColor: '#FF2E93', color: '#F2EEE3', duration: 0.15, ease: 'back.out(3)', ...opts },
      1.71,
    )
    .fromTo(cards, { y: 0 }, { y: -10, duration: 0.08, stagger: 0.04, yoyo: true, repeat: 1, ...opts }, 1.71)
  pop(tl, pops[0], 1.68)
  // Responsivo: a janela encolhe até virar celular e o layout se reorganiza
  tl.fromTo(
    browser,
    { width: narrow ? '92%' : '56%' },
    { width: narrow ? '58%' : '24%', duration: 0.5, ease: 'power2.inOut', immediateRender: false },
    2.05,
  )
    .fromTo(cursor, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1, ...opts }, 2.05)
  pop(tl, pops[1], 2.4, 0.4)
  tl.to({}, { duration: 0.25 })
  return tl
}

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { TV_SCREEN } from '../../../lib/shapes'
import { tv } from '../../../lib/tv'
import { audio } from '../../audio/audioManager'
import { Underline } from '../../ui/Decor'
import { buildMotion, buildPlanet, buildSites, buildVector } from './timelines'
import { TvFrame } from './TvFrame'
import { WorldMotion } from './WorldMotion'
import { WorldPlanet } from './WorldPlanet'
import { WorldSites } from './WorldSites'
import { WorldVector } from './WorldVector'

gsap.registerPlugin(ScrollTrigger)

const CHANNELS = ['Motion design', 'Animação vetorial', '3D com Three.js', 'Sites que se mexem']
const ENTER = 1.2
const SWITCH = 0.5
const EXIT = 1.4
const FULL = 'inset(0px 0px 0px 0px round 0px)'

/**
 * Habilidades como mundos: o scroll entra na tela do Chiado e cada habilidade
 * é um canal. Trocar de canal tem chiado de TV; no fim a gente sai da TV.
 */
export function Skills() {
  const room = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ narrow: '(max-width: 980px)', wide: '(min-width: 981px)' }, (ctx) => {
        const roomEl = room.current
        if (!roomEl) return
        const narrow = Boolean(ctx.conditions?.narrow)
        const q = <T extends Element = HTMLElement>(s: string) => roomEl.querySelector<T>(s)!
        const stage = q('.tv-stage')
        const frameWrap = q('.tv-frame-wrap')
        const frame = q<SVGSVGElement>('.tv-frame')
        const copy = [q('.tv-copy'), q('.tv-hint')]
        const outro = q('.tv-outro')
        const hud = q('.hud')
        const hudCh = q('.hud-ch')
        const dots = Array.from(roomEl.querySelectorAll('.hud-dots i'))
        const stat = q('.tv-static')
        const statLabel = q('.tv-static b')
        const worlds = Array.from(roomEl.querySelectorAll<HTMLElement>('.world'))

        /** Recorte do palco = exatamente a tela do Chiado (medido sem as transformações). */
        const screenClip = () => {
          const rr = roomEl.getBoundingClientRect()
          const wr = frameWrap.getBoundingClientRect()
          const s = wr.width / TV_SCREEN.vw
          const l = wr.left - rr.left + TV_SCREEN.x * s
          const t = wr.top - rr.top + TV_SCREEN.y * s
          const w = TV_SCREEN.w * s
          const h = TV_SCREEN.h * s
          return `inset(${t}px ${rr.width - l - w}px ${rr.height - t - h}px ${l}px round ${TV_SCREEN.r * s}px)`
        }
        const screenOrigin = `${((TV_SCREEN.x + TV_SCREEN.w / 2) / TV_SCREEN.vw) * 100}% ${((TV_SCREEN.y + TV_SCREEN.h / 2) / TV_SCREEN.vh) * 100}%`

        gsap.set(worlds, { autoAlpha: 0 })
        gsap.set(worlds[0], { autoAlpha: 1 })
        gsap.set([hud, stat, outro], { autoAlpha: 0 })
        gsap.set(stage, { clipPath: screenClip() })

        const builders = [buildMotion, buildVector, buildPlanet, (el: Element) => buildSites(el, narrow)]
        /** [início, fim] de cada canal na timeline, para o HUD e o canvas 3D. */
        const spans: [number, number][] = []
        let channel = -1

        const sync = (time: number) => {
          const idx = spans.findIndex(([, end]) => time < end)
          const current = time < ENTER * 0.8 ? -1 : idx === -1 ? spans.length - 1 : idx
          tv.planetVisible = time > spans[2][0] - SWITCH && time < spans[2][1] + SWITCH
          if (current === channel) return
          if (channel !== -1 && current !== -1) audio.play('click')
          channel = current
          const shown = Math.max(current, 0)
          hudCh.textContent = `CH 0${shown + 1} · ${CHANNELS[shown]}`
          statLabel.textContent = `CH 0${shown + 1}`
          dots.forEach((d, i) => d.classList.toggle('on', i === shown))
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          // No onUpdate da timeline (e não do ScrollTrigger): com scrub, a animação
          // continua andando depois que o scroll para, e o HUD tem que acompanhar
          onUpdate: () => sync(tl.time()),
          scrollTrigger: {
            trigger: roomEl,
            start: 'top top',
            end: () => `+=${innerHeight * (narrow ? 10 : 12)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onLeave: () => (tv.planetVisible = false),
            onLeaveBack: () => (tv.planetVisible = false),
          },
        })

        // Entrando na TV: a tela do Chiado cresce até virar a sua tela
        // (fromTo explícito em tudo: com invalidateOnRefresh, .to() regrava o início e vaza estado)
        const once = { immediateRender: false }
        tl.fromTo(stage, { clipPath: screenClip }, { clipPath: FULL, duration: ENTER, ease: 'power2.inOut' }, 0)
          .fromTo(
            frame,
            { scale: 1, autoAlpha: 1 },
            { scale: 3.4, autoAlpha: 0, transformOrigin: screenOrigin, duration: ENTER, ease: 'power2.in', ...once },
            0,
          )
          .fromTo(copy, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -80, duration: ENTER * 0.5, ...once }, 0)
          .fromTo(hud, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ...once }, ENTER * 0.85)

        let t = ENTER
        worlds.forEach((world, i) => {
          if (i > 0) {
            // Troca de canal: chiado colorido no meio
            tl.fromTo(stat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ...once }, t)
              .fromTo(worlds[i - 1], { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, ...once }, t + 0.18)
              .fromTo(world, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, ...once }, t + 0.18)
              .fromTo(stat, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, ...once }, t + 0.3)
            t += SWITCH
          }
          const sub = builders[i](world)
          tl.add(sub, t)
          spans.push([t, t + sub.duration()])
          t += sub.duration()
        })

        // Saindo da TV
        tl.fromTo(hud, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, ...once }, t)
          .fromTo(stage, { clipPath: FULL }, { clipPath: screenClip, duration: EXIT, ease: 'power2.inOut', immediateRender: false }, t)
          .fromTo(
            frame,
            { scale: 3.4, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, transformOrigin: screenOrigin, duration: EXIT, ease: 'power2.out', immediateRender: false },
            t,
          )
          .fromTo(outro, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, t + EXIT * 0.6)
          .to({}, { duration: 0.4 })

        sync(0)
        return () => {
          tv.planetVisible = false
        }
      })
    },
    { scope: room },
  )

  return (
    <section className="skills" id="habilidades">
      <div ref={room} className="tv-room">
        <div className="tv-intro">
          <div className="tv-copy">
            <span className="kicker">Habilidades</span>
            <h2 className="h2">
              Entra na{' '}
              <span className="hl">
                TV
                <Underline />
              </span>
            </h2>
            <p className="sub">Cada habilidade é um canal. Rola a página que o Chiado te leva pra dentro de cada mundo.</p>
          </div>
          <div className="tv-frame-wrap">
            <TvFrame />
          </div>
          <span className="tv-hint">↓ rola pra entrar</span>
        </div>

        <div className="tv-outro">
          <div>
            <span className="kicker">Fim da programação</span>
            <h2 className="h2">
              Gostou do <span className="hl">show?</span>
            </h2>
            <p className="sub mx-auto">Tem muito mais aqui embaixo ↓</p>
          </div>
        </div>

        <div className="tv-stage">
          <WorldMotion />
          <WorldVector />
          <WorldPlanet />
          <WorldSites />
          <div className="scan-lines" aria-hidden />
          <div className="tv-static" aria-hidden>
            <b>CH 01</b>
          </div>
          <div className="hud" aria-live="polite">
            <span className="hud-ch">CH 01 · Motion design</span>
            <span className="hud-dots" aria-hidden>
              {CHANNELS.map((c) => (
                <i key={c} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

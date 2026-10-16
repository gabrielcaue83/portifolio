import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { useId, useImperativeHandle, useRef, type Ref } from 'react'
import { PANIC_EVENT } from '../../lib/panic'
import { audio } from '../audio/audioManager'

gsap.registerPlugin(MorphSVGPlugin)

const MOUTH = {
  smile: 'M116 178 Q142 206 168 178 Q142 192 116 178 Z',
  wow: 'M128 180 Q142 214 156 180 Q142 166 128 180 Z',
  grin: 'M106 175 Q142 218 178 175 Q142 186 106 175 Z',
  flat: 'M122 186 Q142 192 162 186 Q142 189 122 186 Z',
}

export type Mood = keyof typeof MOUTH

export type MascotHandle = {
  jump: () => void
  talk: (on: boolean) => void
  mood: (name: Mood) => void
}

const K = '#0E0E0E'
const A = '#B6FF3B'
const M = '#FF2E93'
const O = '#FF8A00'
const P = '#F2EEE3'
const BOINGS = ['BOING!', 'POING!', 'UÉ!', 'IUHUL!']

type MascotProps = {
  ref?: Ref<MascotHandle>
  /** Clicar faz ele pular (padrão: sim) */
  jumpOnClick?: boolean
}

/** Chiado, o mascote: uma TV antiga com braços e pernas. */
export function Mascot({ ref, jumpOnClick = true }: MascotProps) {
  const slot = useRef<HTMLDivElement>(null)
  const api = useRef<MascotHandle | null>(null)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  useImperativeHandle(ref, () => ({
    jump: () => api.current?.jump(),
    talk: (on) => api.current?.talk(on),
    mood: (name) => api.current?.mood(name),
  }))

  useGSAP(
    (_, contextSafe) => {
      const root = slot.current
      if (!root || !contextSafe) return
      const q = <T extends Element>(s: string) => root.querySelector<T>(s)!
      const qa = (s: string) => Array.from(root.querySelectorAll(s))
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      const svg = q<SVGSVGElement>('svg')
      const body = q('.m-root')
      const shadow = q('.m-shadow')
      const mouth = q('.m-mouth')
      const face = q('.m-face')
      const stat = q('.m-static')
      const eyes = qa('.m-eyeL, .m-eyeR')
      const pupils = qa('.m-pupil')

      const mood = contextSafe((name: Mood, d = 0.25) => {
        gsap.to(mouth, { morphSVG: MOUTH[name], duration: d, ease: 'back.out(2)', overwrite: true })
      })

      if (reduce) {
        api.current = { jump: () => {}, talk: () => {}, mood }
        return
      }

      // Vida própria: respira, antenas balançam, acena, pisca e dá "chiado" de vez em quando
      gsap.to(q('.m-upper'), { y: -9, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(shadow, { scaleX: 0.9, transformOrigin: '50% 50%', duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(q('.m-antL'), { rotation: -12, svgOrigin: '138 60', duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(q('.m-antR'), { rotation: 12, svgOrigin: '182 60', duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.27 })
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.2 })
        .to(q('.m-armR'), { rotation: 18, svgOrigin: '268 180', duration: 0.16, ease: 'sine.inOut', yoyo: true, repeat: 5 })
      gsap.to(q('.m-armL'), { rotation: -6, svgOrigin: '52 180', duration: 0.84, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap
        .timeline({ repeat: -1, repeatRefresh: true })
        .to({}, { duration: 'random(1.6, 4.6)' })
        .to(eyes, { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.in' })

      gsap
        .timeline({ repeat: -1, repeatRefresh: true })
        .to({}, { duration: 'random(5, 11)' })
        .set(stat, { opacity: 1 })
        .set(face, { x: 6 })
        .set(stat, { opacity: 0 }, '+=0.06')
        .set(face, { x: -4 }, '<')
        .set(stat, { opacity: 0.8, y: 12 }, '+=0.06')
        .set(face, { x: 0 }, '<')
        .set(stat, { opacity: 0, y: 0 }, '+=0.06')

      // Olhos seguem o mouse
      const px = pupils.map((p) => gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3' }))
      const py = pupils.map((p) => gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3' }))
      let mx = innerWidth / 2
      let my = innerHeight / 3
      const onMove = (e: PointerEvent) => {
        mx = e.clientX
        my = e.clientY
      }
      const look = () => {
        const r = svg.getBoundingClientRect()
        if (r.bottom < 0 || r.top > innerHeight) return
        const cx = r.left + (r.width * 142) / 320
        const cy = r.top + (r.height * 150) / 400
        const dx = mx - cx
        const dy = my - cy
        const d = Math.max(Math.hypot(dx, dy), 1)
        const k = Math.min(1, d / 260)
        px.forEach((f) => f((dx / d) * 7 * k))
        py.forEach((f) => f((dy / d) * 9 * k))
      }
      addEventListener('pointermove', onMove, { passive: true })
      gsap.ticker.add(look)

      let jumping = false
      const jump = contextSafe(() => {
        if (jumping) return
        jumping = true
        audio.play('boing')
        mood('wow', 0.15)
        gsap
          .timeline({
            onComplete: () => {
              jumping = false
              mood('smile')
            },
          })
          .to(body, { scaleY: 0.82, scaleX: 1.12, svgOrigin: '160 300', duration: 0.12, ease: 'power2.out' })
          .to(body, { y: -90, scaleY: 1.14, scaleX: 0.9, duration: 0.32, ease: 'power2.out' })
          .to(shadow, { scale: 0.5, opacity: 0.08, transformOrigin: '50% 50%', duration: 0.32, ease: 'power2.out' }, '<')
          .to(body, { rotation: 360, svgOrigin: '160 300', duration: 0.5, ease: 'power1.inOut' }, '<0.05')
          .to(body, { y: 0, scaleY: 1.08, scaleX: 0.94, duration: 0.28, ease: 'power2.in' }, '>-0.1')
          .to(shadow, { scale: 1, opacity: 0.22, duration: 0.28, ease: 'power2.in' }, '<')
          .to(body, { scaleY: 0.8, scaleX: 1.14, svgOrigin: '160 300', duration: 0.08 })
          .to(body, { scaleY: 1, scaleX: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, .35)' })
          .set(body, { rotation: 0 })

        // Balão "BOING!" de quadrinho
        const b = document.createElement('span')
        b.className = 'boing'
        b.textContent = gsap.utils.random(BOINGS)
        b.style.left = `${gsap.utils.random(0, 50)}%`
        b.style.top = `${gsap.utils.random(0, 30)}%`
        root.appendChild(b)
        gsap.fromTo(b, { scale: 0, rotation: -30 }, { scale: 1, rotation: gsap.utils.random(-12, 12), duration: 0.4, ease: 'back.out(3)' })
        gsap.to(b, { scale: 0, opacity: 0, duration: 0.25, delay: 0.9, onComplete: () => b.remove() })
      })

      const talkTl = gsap
        .timeline({ paused: true, repeat: -1 })
        .call(() => mood('wow', 0.08))
        .call(() => mood('flat', 0.08), undefined, 0.11)
        .to({}, { duration: 0.22 })
      const talk = contextSafe((on: boolean) => {
        if (on) talkTl.restart()
        else {
          talkTl.pause()
          mood('smile')
        }
      })

      // Pânico: perde o sinal por uns segundos
      const onPanic = contextSafe(() => {
        mood('wow', 0.1)
        gsap
          .timeline({ onComplete: () => mood('smile') })
          .to(stat, { opacity: 1, duration: 0.05, repeat: 24, yoyo: true, ease: 'steps(1)' })
          .to(face, { x: 'random(-8, 8)', duration: 0.05, repeat: 24, yoyo: true, repeatRefresh: true }, 0)
          .set(face, { x: 0 })
          .set(stat, { opacity: 0 })
      })
      addEventListener(PANIC_EVENT, onPanic)

      api.current = { jump, talk, mood }
      return () => {
        removeEventListener('pointermove', onMove)
        removeEventListener(PANIC_EVENT, onPanic)
        gsap.ticker.remove(look)
      }
    },
    { scope: slot },
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      api.current?.jump()
    }
  }

  return (
    <div
      ref={slot}
      className="mascot-slot"
      {...(jumpOnClick && {
        role: 'button',
        tabIndex: 0,
        title: 'Clica em mim!',
        'aria-label': 'Chiado, o mascote. Clique para ele pular.',
        onClick: () => api.current?.jump(),
        onKeyDown: onKey,
      })}
    >
      <svg className="mascot" viewBox="0 0 320 400" role="img" aria-label="Chiado, o mascote: uma TV antiga com braços e pernas">
        <defs>
          <pattern id={`scan${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1.4" fill={A} opacity=".12" />
          </pattern>
          <clipPath id={`clip${uid}`}>
            <rect x="64" y="80" width="156" height="148" rx="24" />
          </clipPath>
        </defs>
        <ellipse className="m-shadow" cx="160" cy="388" rx="92" ry="10" fill={K} opacity=".22" />
        <g className="m-root" filter="url(#boil)">
          <g fill="none" stroke={K} strokeWidth="12" strokeLinecap="round">
            <path className="m-legL" d="M122 236 C118 300 104 330 104 358" />
            <path className="m-legR" d="M198 236 C202 300 216 330 216 358" />
          </g>
          <ellipse cx="96" cy="368" rx="30" ry="15" fill={M} stroke={K} strokeWidth="5" />
          <ellipse cx="224" cy="368" rx="30" ry="15" fill={M} stroke={K} strokeWidth="5" />
          <g className="m-upper">
            <g className="m-armL">
              <path d="M52 180 C26 196 18 228 24 252" fill="none" stroke={K} strokeWidth="12" strokeLinecap="round" />
              <circle cx="25" cy="258" r="16" fill={A} stroke={K} strokeWidth="5" />
            </g>
            <g className="m-armR">
              <path d="M268 180 C294 166 300 138 296 116" fill="none" stroke={K} strokeWidth="12" strokeLinecap="round" />
              <circle cx="296" cy="108" r="16" fill={A} stroke={K} strokeWidth="5" />
            </g>
            <g fill="none" stroke={K} strokeWidth="5" strokeLinecap="round">
              <g className="m-antL">
                <line x1="138" y1="60" x2="108" y2="16" />
                <circle cx="106" cy="12" r="9" fill={A} />
              </g>
              <g className="m-antR">
                <line x1="182" y1="60" x2="214" y2="20" />
                <circle cx="216" cy="15" r="9" fill={M} />
              </g>
            </g>
            <g className="m-body">
              <rect x="38" y="56" width="244" height="196" rx="36" fill={O} stroke={K} strokeWidth="6" />
              <path d="M54 100 Q54 74 80 72" fill="none" stroke={P} strokeWidth="6" strokeLinecap="round" opacity=".75" />
              <rect x="64" y="80" width="156" height="148" rx="24" fill={K} stroke={K} strokeWidth="5" />
              <g clipPath={`url(#clip${uid})`}>
                <g className="m-face">
                  <g className="m-eyeL">
                    <ellipse cx="112" cy="140" rx="17" ry="22" fill={A} />
                    <circle className="m-pupil" cx="112" cy="144" r="8" fill={K} />
                  </g>
                  <g className="m-eyeR">
                    <ellipse cx="172" cy="140" rx="17" ry="22" fill={A} />
                    <circle className="m-pupil" cx="172" cy="144" r="8" fill={K} />
                  </g>
                  <circle cx="88" cy="184" r="8" fill={M} opacity=".9" />
                  <circle cx="196" cy="184" r="8" fill={M} opacity=".9" />
                  <path className="m-mouth" d={MOUTH.smile} fill={A} />
                </g>
                <g className="m-static" opacity="0">
                  <rect x="64" y="96" width="156" height="10" fill={P} />
                  <rect x="64" y="128" width="156" height="6" fill={A} />
                  <rect x="64" y="160" width="156" height="14" fill={M} />
                  <rect x="64" y="200" width="156" height="5" fill={P} />
                </g>
                <rect x="64" y="80" width="156" height="148" fill={`url(#scan${uid})`} />
                <path d="M80 98 Q94 88 112 90" stroke={P} strokeWidth="5" fill="none" opacity=".3" strokeLinecap="round" />
              </g>
              <circle cx="251" cy="104" r="12" fill={P} stroke={K} strokeWidth="5" />
              <line x1="251" y1="104" x2="251" y2="94" stroke={K} strokeWidth="4" strokeLinecap="round" />
              <circle cx="251" cy="146" r="12" fill={P} stroke={K} strokeWidth="5" />
              <line x1="251" y1="146" x2="259" y2="140" stroke={K} strokeWidth="4" strokeLinecap="round" />
              <g stroke={K} strokeWidth="4" strokeLinecap="round">
                <line x1="239" y1="184" x2="263" y2="184" />
                <line x1="239" y1="198" x2="263" y2="198" />
                <line x1="239" y1="212" x2="263" y2="212" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

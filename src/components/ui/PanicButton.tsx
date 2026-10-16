import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { triggerPanic } from '../../lib/panic'
import { audio } from '../audio/audioManager'

/** Botão vermelho com tampa de segurança: primeiro levanta a tampa, depois... não aperte. */
export function PanicButton() {
  const root = useRef<HTMLDivElement>(null)
  const cover = useRef<HTMLButtonElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const { contextSafe } = useGSAP({ scope: root })

  // contextSafe no momento do evento: as animações entram no contexto e são limpas no unmount
  const setCover = (next: boolean) => {
    contextSafe(() => {
      gsap.to(cover.current, {
        rotateX: next ? 115 : 0,
        duration: next ? 0.5 : 0.7,
        ease: next ? 'back.out(2)' : 'bounce.out',
      })
    })()
    setOpen(next)
  }

  const openCover = () => {
    audio.play('click')
    setCover(true)
  }

  const press = () => {
    contextSafe(() => {
      gsap.fromTo(button.current, { scaleY: 0.75 }, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      gsap.delayedCall(3.2, () => setCover(false))
    })()
    triggerPanic()
  }

  return (
    <div ref={root} className="cartoon-box space-y-4 rounded-3xl bg-white p-6 text-center">
      <p className="font-display text-xl uppercase">Em caso de emergência</p>

      <div className="relative mx-auto grid size-48 place-items-center rounded-2xl border-4 border-black bg-[repeating-linear-gradient(-45deg,#ffe600_0_14px,#000_14px_28px)] [perspective:600px]">
        <div className="grid size-36 place-items-center rounded-full border-4 border-black bg-neutral-300">
          <button
            ref={button}
            type="button"
            onClick={press}
            disabled={!open}
            data-cursor={open ? 'não!' : ''}
            aria-label="Botão do pânico. Não aperte."
            className="size-28 rounded-full border-4 border-black bg-pop-red font-display text-lg text-white uppercase shadow-[inset_0_-10px_0_0_rgba(0,0,0,0.3)] transition-transform [-webkit-text-stroke:1px_black] active:translate-y-1"
          >
            Pânico
          </button>
        </div>

        {/* Tampa de acrílico: gira para cima na dobradiça superior */}
        <button
          ref={cover}
          type="button"
          onClick={openCover}
          disabled={open}
          aria-label="Levantar a tampa de segurança"
          data-cursor="abrir?"
          style={{ transformOrigin: '50% 0%' }}
          className="absolute inset-2 rounded-xl border-4 border-black bg-pop-cyan/35 shadow-[inset_6px_6px_0_rgba(255,255,255,0.6)] disabled:pointer-events-none"
        />
      </div>

      <p className="font-bold" aria-live="polite">
        {open ? 'Tem certeza? 👀' : 'Levante a tampa… se tiver coragem.'}
      </p>
    </div>
  )
}

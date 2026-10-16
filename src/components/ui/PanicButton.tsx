import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { triggerPanic } from '../../lib/panic'
import { audio } from '../audio/audioManager'

/** Easter egg: botão vermelho com tampa de segurança. Primeiro levanta a tampa, depois... não aperte. */
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
    <div
      ref={root}
      className="flex items-center gap-4 rounded-2xl border-[3px] border-ink bg-paper p-3 pr-5 shadow-cartoon"
    >
      <div className="relative grid size-28 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-[repeating-linear-gradient(-45deg,#B6FF3B_0_10px,#0E0E0E_10px_20px)] [perspective:500px]">
        <div className="grid size-20 place-items-center rounded-full border-[3px] border-ink bg-paper2">
          <button
            ref={button}
            type="button"
            onClick={press}
            disabled={!open}
            aria-label="Botão do pânico. Não aperte."
            className="size-16 rounded-full border-[3px] border-ink bg-mag font-comic text-[11px] text-paper uppercase shadow-[inset_0_-7px_0_0_rgba(0,0,0,0.3)] active:translate-y-0.5"
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
          style={{ transformOrigin: '50% 0%' }}
          className="absolute inset-1.5 rounded-lg border-[3px] border-ink bg-paper/35 shadow-[inset_5px_5px_0_rgba(255,255,255,0.6)] disabled:pointer-events-none"
        />
      </div>
      <div>
        <p className="font-mono text-xs font-bold tracking-widest uppercase">Em caso de emergência</p>
        <p className="font-comic text-sm leading-tight" aria-live="polite">
          {open ? 'Tem certeza? 👀' : 'Levanta a tampa… se tiver coragem.'}
        </p>
      </div>
    </div>
  )
}

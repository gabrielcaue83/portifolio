import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState, type FormEvent } from 'react'
import { CONFIG, igLink, mailLink, waLink } from '../../lib/config'
import { Underline } from '../ui/Decor'
import { Mascot, type MascotHandle } from '../ui/Mascot'
import { PanicButton } from '../ui/PanicButton'

const PICKS = ['Identidade visual', 'Motion pra redes', 'Site / landing page', 'Tudo junto']

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const mascot = useRef<MascotHandle>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [error, setError] = useState('')

  useGSAP(
    () => {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
        gsap.to('.sign', { rotation: -4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  const toggle = (p: string) => setPicked((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const via = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value ?? 'wa'
    const data = new FormData(e.currentTarget)
    const nome = String(data.get('nome') ?? '').trim()
    const msg = String(data.get('msg') ?? '').trim()
    if (!nome) {
      setError('Faltou seu nome! Escreve ali em cima pra eu saber quem é.')
      e.currentTarget.querySelector<HTMLInputElement>('input[name="nome"]')?.focus()
      return
    }
    setError('')
    const texto =
      `Oi, Cauê! Sou ${nome}.\nPreciso de: ${picked.length ? picked.join(', ') : 'ainda estou decidindo'}.` +
      (msg ? `\nSobre o projeto: ${msg}` : '')
    if (via === 'mail')
      location.href = `${mailLink}?subject=${encodeURIComponent(`Projeto — ${nome}`)}&body=${encodeURIComponent(texto)}`
    else window.open(waLink(texto), '_blank', 'noopener')
  }

  const grin = (on: boolean) => mascot.current?.mood(on ? 'grin' : 'smile')

  return (
    <section className="contact" id="contato" ref={root}>
      <div className="wrap contact-grid">
        <div>
          <span className="kicker">Contato</span>
          <h2 className="h2">
            Bora{' '}
            <span className="hl">
              criar?
              <Underline />
            </span>
          </h2>
          <form className="panelf" noValidate onSubmit={onSubmit}>
            <label className="field">
              <span>Seu nome</span>
              <input name="nome" autoComplete="name" placeholder="Como posso te chamar?" required />
            </label>
            <fieldset className="field">
              <legend>O que você precisa</legend>
              <div className="picks">
                {PICKS.map((p) => (
                  <button key={p} type="button" className="pick" aria-pressed={picked.includes(p)} onClick={() => toggle(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="field">
              <span>Conta rapidinho sobre o projeto</span>
              <textarea name="msg" rows={3} placeholder="Ex.: tenho uma loja e quero um logo animado e um site" />
            </label>
            <div className="err" role="alert">
              {error}
            </div>
            <div className="formbtns">
              <button className="btn btn-acid" type="submit" value="wa" onPointerEnter={() => grin(true)} onPointerLeave={() => grin(false)}>
                Enviar no WhatsApp →
              </button>
              <button className="btn btn-paper" type="submit" value="mail" onPointerEnter={() => grin(true)} onPointerLeave={() => grin(false)}>
                Enviar por e-mail
              </button>
            </div>
          </form>
          <div className="direct">
            <a href={waLink()} target="_blank" rel="noopener">
              WhatsApp {CONFIG.whatsappTexto}
            </a>
            <a href={igLink} target="_blank" rel="noopener">
              @{CONFIG.instagram}
            </a>
            <a href={mailLink}>{CONFIG.email}</a>
          </div>
          <div className="mt-8 w-fit">
            <PanicButton />
          </div>
        </div>
        <div className="contact-art">
          <div className="bubble">
            <span>
              Me chama!
              <br />
              Eu não mordo.
            </span>
          </div>
          <Mascot ref={mascot} />
          <div className="sign">orçamento grátis</div>
        </div>
      </div>
    </section>
  )
}

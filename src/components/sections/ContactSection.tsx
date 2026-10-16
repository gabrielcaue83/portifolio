import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { audio } from '../audio/audioManager'
import { Button } from '../ui/Button'
import { PanicButton } from '../ui/PanicButton'

// TODO: troque pelo seu e-mail de contato
const CONTACT_EMAIL = 'seu-email@exemplo.com'

const YEAR = new Date().getFullYear()

const PROJECT_TYPES = ['Site', '3D / WebGL', 'Animação', 'Outro']

const field =
  'w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold shadow-cartoon outline-none transition placeholder:text-black/40 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:bg-pop-yellow/40 focus:shadow-cartoon-lg'

export function ContactSection() {
  const [sent, setSent] = useState(false)

  // Sem backend: monta um e-mail pronto no app de e-mail do visitante
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name'))
    const subject = `[${data.get('type')}] Projeto com ${name}`
    const body = `${data.get('message')}\n\n— ${name} (${data.get('email')})`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    audio.play('boing')
    setSent(true)
  }

  return (
    <section id="contact" className="relative px-4 pt-[48svh] pb-10 md:px-12 md:pt-28">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="cartoon-box inline-block rounded-full bg-white px-4 py-1 text-sm font-black uppercase">
              Contato
            </span>
            <h2 className="text-outline text-5xl text-white md:text-7xl">Bora conversar?</h2>
          </div>

          <form onSubmit={onSubmit} className="cartoon-box space-y-5 rounded-3xl bg-pop-cyan p-6 md:p-8">
            <label className="block space-y-2">
              <span className="font-display uppercase">Seu nome</span>
              <input name="name" required autoComplete="name" placeholder="Johnny Bravo" className={field} />
            </label>
            <label className="block space-y-2">
              <span className="font-display uppercase">E-mail</span>
              <input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" className={field} />
            </label>

            <fieldset className="space-y-2">
              <legend className="font-display uppercase">Tipo de projeto</legend>
              <div className="flex flex-wrap gap-2 pt-2">
                {PROJECT_TYPES.map((type, i) => (
                  <label key={type} className="cursor-pointer">
                    <input type="radio" name="type" value={type} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-full border-[3px] border-black bg-white px-4 py-1.5 font-black shadow-cartoon-sm transition peer-checked:bg-pop-pink peer-checked:text-white peer-focus-visible:outline-4 peer-focus-visible:outline-pop-yellow">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block space-y-2">
              <span className="font-display uppercase">Mensagem</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Conta a ideia maluca…"
                className={`${field} resize-none`}
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" variant="pink" data-cursor="envia!">
                Enviar <Send strokeWidth={3} />
              </Button>
              <p aria-live="polite" className="font-black">
                {sent && 'Abrindo seu app de e-mail ✉️'}
              </p>
            </div>
          </form>

          <PanicButton />
        </div>
      </div>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t-4 border-black pt-6 font-black">
        <span>© {YEAR} · Creative Web Dev</span>
        <span>Feito com Three.js, GSAP e muito café ☕</span>
      </footer>
    </section>
  )
}

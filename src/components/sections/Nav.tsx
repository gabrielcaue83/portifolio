import { useEffect, useState } from 'react'
import { waLink } from '../../lib/config'

const LINKS = [
  ['#sobre', 'Sobre'],
  ['#habilidades', 'Habilidades'],
  ['#servicos', 'Serviços'],
  ['#trampos', 'Trampos'],
  ['#contato', 'Contato'],
]

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className="nav">
        <div className="wrap">
          <a className="logo" href="#topo" aria-label="Cauê Gabriel, voltar ao topo">
            CG
          </a>
          <nav className="links" aria-label="Seções">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="btn btn-acid small" href={waLink()} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <button
            className="burger"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>
      {open && (
        <nav className="drawer" aria-label="Menu">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener" style={{ color: 'var(--mag)' }}>
            WhatsApp ↗
          </a>
        </nav>
      )}
    </>
  )
}

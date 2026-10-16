import gsap from 'gsap'
import { Underline } from '../ui/Decor'

const SERVICES = [
  {
    title: 'Identidade visual',
    text: 'A cara da sua marca, pronta pra ser usada em tudo.',
    items: ['Logo e variações', 'Paleta e tipografia', 'Mascote e ilustrações', 'Guia simples de uso'],
    icon: (
      <path d="M30 6 L36 22 L54 23 L40 34 L45 52 L30 42 L15 52 L20 34 L6 23 L24 22 Z" fill="#F2EEE3" stroke="#0E0E0E" strokeWidth="3.5" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Motion pra redes',
    text: 'Posts e vídeos curtos que param o dedo de quem está rolando o feed.',
    items: ['Logo animado', 'Posts e carrosséis', 'Vinhetas e stories', 'Animações vetoriais'],
    icon: (
      <>
        <rect x="7" y="10" width="46" height="40" rx="9" fill="#F2EEE3" stroke="#0E0E0E" strokeWidth="3.5" />
        <path d="M25 21 L39 30 L25 39 Z" fill="#FF2E93" stroke="#0E0E0E" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Sites & landing pages',
    text: 'Página rápida, animada e feita pra virar contato no WhatsApp.',
    items: ['Landing page de divulgação', 'Site institucional', 'Animações com GSAP', 'Elementos 3D com Three.js'],
    icon: (
      <>
        <rect x="5" y="9" width="50" height="42" rx="7" fill="#F2EEE3" stroke="#0E0E0E" strokeWidth="3.5" />
        <line x1="5" y1="20" x2="55" y2="20" stroke="#0E0E0E" strokeWidth="3.5" />
        <circle cx="12" cy="14.5" r="2" fill="#0E0E0E" />
        <circle cx="19" cy="14.5" r="2" fill="#0E0E0E" />
        <rect x="13" y="28" width="20" height="5" rx="2" fill="#0E0E0E" />
        <rect x="13" y="38" width="13" height="6" rx="3" fill="#FF2E93" stroke="#0E0E0E" strokeWidth="2" />
      </>
    ),
  },
]

/** Ícone balança quando o mouse entra no card. */
const wiggle = (e: React.PointerEvent<HTMLElement>) => {
  const ico = e.currentTarget.querySelector('.ico')
  if (ico) gsap.fromTo(ico, { rotation: 0 }, { keyframes: { rotation: [0, -14, 12, -8, 5, 0] }, duration: 0.6, ease: 'power1.inOut' })
}

export function Services() {
  return (
    <section className="services" id="servicos">
      <div className="wrap">
        <span className="kicker">Serviços</span>
        <h2 className="h2">
          O que dá pra fazer{' '}
          <span className="hl">
            junto
            <Underline />
          </span>
        </h2>
        <div className="svc">
          {SERVICES.map((s) => (
            <article key={s.title} className="card pop" onPointerEnter={wiggle}>
              <div className="ico">
                <svg viewBox="0 0 60 60" aria-hidden>
                  {s.icon}
                </svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { WorldInfo } from './WorldInfo'

/** Canal 4: um site se montando na sua frente, ganhando clique e virando celular. */
export function WorldSites() {
  return (
    <div className="world" data-world="sites" style={{ background: 'var(--mag)' }}>
      <div className="dots" />
      <div className="browser" data-browser>
        <div className="b-top">
          <i />
          <i />
          <i />
          <span className="b-url" data-url />
        </div>
        <div className="b-body">
          <div className="b-nav" data-part>
            <span className="b-logo" />
            <i />
            <i />
            <i />
          </div>
          <div className="b-hero">
            <div className="b-title" data-part>
              Sua marca <span>se mexendo</span>
            </div>
            <span className="b-btn" data-part data-bbtn>
              Fale comigo →
            </span>
          </div>
          <div className="b-lines" data-part>
            <i />
            <i />
          </div>
          <div className="b-cards">
            <i data-card />
            <i data-card />
            <i data-card />
          </div>
        </div>
        <svg className="b-cursor" data-bcursor viewBox="0 0 22 26" aria-hidden>
          <path d="M2 2 L2 22 L8 16 L12 24 L16 22 L12 14 L20 14 Z" fill="#F2EEE3" stroke="#0E0E0E" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="pop-word" data-pop="0" style={{ right: '8%', top: '20%', background: 'var(--acid)', color: 'var(--ink)' }}>
        CLICK!
      </span>
      <span className="pop-word" data-pop="1" style={{ right: '10%', top: '58%', background: 'var(--orange)' }}>
        RESPONSIVO!
      </span>
      <WorldInfo
        title="Sites que se mexem"
        text="Landing pages com animação no scroll, microinterações e carregamento rápido, pensadas primeiro pro celular."
        chips={['ScrollTrigger', 'HTML · CSS · JS', 'Responsivo']}
      />
    </div>
  )
}

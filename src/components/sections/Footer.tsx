import { CONFIG, igLink, mailLink } from '../../lib/config'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <span>© {YEAR} Cauê Gabriel · feito à mão com GSAP, Three.js e muito rabisco</span>
        <span>
          <a href={igLink} target="_blank" rel="noopener">
            @{CONFIG.instagram}
          </a>{' '}
          · <a href={mailLink}>{CONFIG.email}</a>
        </span>
        <a className="top-btn" href="#topo">
          Voltar pro começo ↑
        </a>
      </div>
    </footer>
  )
}

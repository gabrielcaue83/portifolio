const K = '#0E0E0E'
const A = '#B6FF3B'
const M = '#FF2E93'
const O = '#FF8A00'
const P = '#F2EEE3'

/** O Chiado de corpo inteiro, parado, com a tela vazia (o conteúdo vem do palco por cima). */
export function TvFrame() {
  return (
    <svg className="tv-frame" viewBox="0 0 320 400" aria-hidden>
      <ellipse cx="160" cy="388" rx="92" ry="10" fill={K} opacity=".4" />
      <g filter="url(#boil)">
        <g fill="none" stroke={K} strokeWidth="12" strokeLinecap="round">
          <path d="M122 236 C118 300 104 330 104 358" />
          <path d="M198 236 C202 300 216 330 216 358" />
        </g>
        <ellipse cx="96" cy="368" rx="30" ry="15" fill={M} stroke={K} strokeWidth="5" />
        <ellipse cx="224" cy="368" rx="30" ry="15" fill={M} stroke={K} strokeWidth="5" />
        <path d="M52 180 C26 196 18 228 24 252" fill="none" stroke={K} strokeWidth="12" strokeLinecap="round" />
        <circle cx="25" cy="258" r="16" fill={A} stroke={K} strokeWidth="5" />
        <path d="M268 180 C294 166 300 138 296 116" fill="none" stroke={K} strokeWidth="12" strokeLinecap="round" />
        <circle cx="296" cy="108" r="16" fill={A} stroke={K} strokeWidth="5" />
        <g fill="none" stroke={P} strokeWidth="5" strokeLinecap="round">
          <line x1="138" y1="60" x2="108" y2="16" />
          <line x1="182" y1="60" x2="214" y2="20" />
        </g>
        <circle cx="106" cy="12" r="9" fill={A} stroke={K} strokeWidth="4" />
        <circle cx="216" cy="15" r="9" fill={M} stroke={K} strokeWidth="4" />
        <rect x="38" y="56" width="244" height="196" rx="36" fill={O} stroke={P} strokeWidth="6" />
        <path d="M54 100 Q54 74 80 72" fill="none" stroke={P} strokeWidth="6" strokeLinecap="round" opacity=".75" />
        <rect x="64" y="80" width="156" height="148" rx="24" fill={K} stroke={K} strokeWidth="5" />
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
    </svg>
  )
}

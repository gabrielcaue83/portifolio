import { BALL_R, GHOSTS, GROUND } from './ballPath'
import { usePortrait } from './usePortrait'
import { WorldInfo } from './WorldInfo'

const POPS = [
  { text: 'SQUASH!', at: 0, style: { left: '30%', top: '62%' } },
  { text: 'STRETCH', at: 1, style: { left: '46%', top: '22%', background: 'var(--orange)' } },
  { text: 'TIMING', at: 2, style: { left: '62%', top: '58%', background: 'var(--acid)', color: 'var(--ink)' } },
  { text: 'EXAGERO!', at: 3, style: { left: '76%', top: '40%' } },
]

/** Canal 1: a mesa de animação. Uma bolinha atravessa a tela inteira ensinando os princípios. */
export function WorldMotion() {
  const portrait = usePortrait()
  return (
    <div className="world" data-world="motion" style={{ background: 'var(--paper2)' }}>
      <div className="dots" />
      <svg
        className="world-svg"
        viewBox={portrait ? '0 -100 1600 1500' : '0 0 1600 900'}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <line x1="-400" y1={GROUND + BALL_R} x2="2000" y2={GROUND + BALL_R} stroke="#0E0E0E" strokeWidth="8" strokeLinecap="round" />
        <text x="180" y="850" fontFamily="Space Mono, monospace" fontSize="26" fontWeight="700" fill="#0E0E0E">
          SPACING: perto no alto, longe embaixo
        </text>
        <g>
          {GHOSTS.map((g, i) => (
            <circle
              key={i}
              data-ghost
              cx={g.x}
              cy={g.y}
              r={BALL_R}
              fill="none"
              stroke="#0E0E0E"
              strokeWidth="3"
              strokeDasharray="6 9"
              opacity="0"
            />
          ))}
        </g>
        <ellipse data-shadow cx="0" cy={GROUND + BALL_R + 6} rx="78" ry="14" fill="#0E0E0E" opacity=".3" />
        <g data-ball>
          <g data-squash>
            <circle r={BALL_R} fill="#FF2E93" stroke="#0E0E0E" strokeWidth="9" />
            <path d="M-32 -22 Q-18 -42 4 -42" stroke="#F2EEE3" strokeWidth="11" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      {POPS.map((p) => (
        <span key={p.text} className="pop-word" data-pop={p.at} style={p.style}>
          {p.text}
        </span>
      ))}
      <WorldInfo
        className="info-top-right"
        title="Motion design"
        text="Timing, exagero e squash & stretch: os princípios clássicos da animação aplicados em logo, post e interface."
        chips={['GSAP Timeline', 'Easing', '12 princípios']}
      />
    </div>
  )
}

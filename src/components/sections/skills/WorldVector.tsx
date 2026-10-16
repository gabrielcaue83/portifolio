import { MORPH_SHAPES } from '../../../lib/shapes'
import { usePortrait } from './usePortrait'
import { WorldInfo } from './WorldInfo'

const first = MORPH_SHAPES[0]

/** Canal 2: uma forma gigante que muda de formato e um traço que se desenha sozinho. */
export function WorldVector() {
  const portrait = usePortrait()
  return (
    <div className="world" data-world="vector" style={{ background: first.bg }}>
      <div className="dots" />
      <svg
        className="world-svg"
        viewBox={portrait ? '300 -40 1000 1100' : '0 0 1600 900'}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <g transform="translate(800 420)">
          <g data-spin>
            <g transform="scale(2.5) translate(-100 -100)">
              <path data-morph-shadow d={first.d} fill="#0E0E0E" transform="translate(8 8)" />
              <path data-morph d={first.d} fill={first.fill} stroke="#0E0E0E" strokeWidth="5" strokeLinejoin="round" />
            </g>
          </g>
        </g>
        <path
          data-sign
          d="M470 820 C540 720 600 880 670 780 S790 700 830 810 S960 870 1020 760 S1180 730 1230 820"
          fill="none"
          stroke="#0E0E0E"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
      <span className="pop-word" data-pop="0" style={{ left: '58%', top: '18%' }}>
        MORPH!
      </span>
      <span className="pop-word" data-pop="1" style={{ left: '22%', top: '30%', background: 'var(--orange)' }}>
        DRAW!
      </span>
      <span className="pop-word" data-pop="2" style={{ left: '66%', top: '56%', background: 'var(--paper)', color: 'var(--ink)' }}>
        NÍTIDO!
      </span>
      <WorldInfo
        title="Animação vetorial"
        text="SVG que muda de forma, desenha o próprio traço e pesa quase nada. Fica nítido em qualquer tela."
        chips={['SVG', 'MorphSVG', 'DrawSVG']}
      />
    </div>
  )
}

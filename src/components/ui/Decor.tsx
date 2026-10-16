/** Peças visuais reutilizáveis: onda entre seções e sublinhado rabiscado. */

const WAVES = {
  a: 'M0 46 L0 24 Q60 0 120 24 T240 24 T360 24 T480 24 T600 24 T720 24 T840 24 T960 24 T1080 24 T1200 24 T1320 24 T1440 24 L1440 46 Z',
  b: 'M0 46 L0 22 C120 46 240 0 360 22 S600 46 720 22 S960 0 1080 22 S1320 46 1440 22 L1440 46 Z',
}

export function Wave({ from, to, variant = 'a' }: { from: string; to: string; variant?: keyof typeof WAVES }) {
  return (
    <svg className="wave" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden style={{ background: from }}>
      <path d={WAVES[variant]} style={{ fill: to }} />
    </svg>
  )
}

export function Underline() {
  return (
    <svg className="u" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
      <path d="M3 12 C40 3 70 18 100 10 S160 3 197 12" />
    </svg>
  )
}

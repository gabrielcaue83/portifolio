/**
 * Trajetória da bolinha do canal de Motion design (viewBox 1600x900).
 * Tudo sai de uma função só: posição, squash & stretch e os "fantasmas"
 * que mostram o spacing (perto no alto, longe perto do chão).
 */

export const GROUND = 700
export const BALL_R = 60

type Seg =
  | { kind: 'drop'; x0: number; x1: number; top: number; dur: number }
  | { kind: 'arc'; x0: number; x1: number; apex: number; dur: number }
  | { kind: 'roll'; x0: number; x1: number; dur: number }

const SEGS: Seg[] = [
  { kind: 'drop', x0: 180, x1: 520, top: 150, dur: 0.32 },
  { kind: 'arc', x0: 520, x1: 900, apex: 250, dur: 0.34 },
  { kind: 'arc', x0: 900, x1: 1180, apex: 450, dur: 0.26 },
  { kind: 'arc', x0: 1180, x1: 1380, apex: 590, dur: 0.18 },
  { kind: 'roll', x0: 1380, x1: 1470, dur: 0.14 },
]

const starts: number[] = []
let acc = 0
for (const s of SEGS) {
  starts.push(acc)
  acc += s.dur
}

/** Duração total da trajetória (unidade arbitrária, mapeada no scroll). */
export const BALL_TOTAL = acc

/** Instantes em que a bolinha toca o chão. */
export const CONTACTS = SEGS.slice(0, 4).map((s, i) => starts[i] + s.dur)

const SQUASH_WINDOW = 0.022
const MAX_DROP = GROUND - 150

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function ballAt(u: number) {
  const clamped = Math.min(Math.max(u, 0), BALL_TOTAL)
  let i = SEGS.length - 1
  while (i > 0 && clamped < starts[i]) i--
  const seg = SEGS[i]
  const s = Math.min((clamped - starts[i]) / seg.dur, 1)

  let x = lerp(seg.x0, seg.x1, s)
  let y = GROUND
  let speed = 0 // 0..1, velocidade vertical relativa
  if (seg.kind === 'drop') {
    y = seg.top + (GROUND - seg.top) * s * s
    speed = s * Math.sqrt((GROUND - seg.top) / MAX_DROP)
  } else if (seg.kind === 'arc') {
    const h = GROUND - seg.apex
    y = GROUND - h * 4 * s * (1 - s)
    speed = Math.abs(1 - 2 * s) * Math.sqrt(h / MAX_DROP)
  } else {
    x = lerp(seg.x0, seg.x1, 1 - (1 - s) * (1 - s)) // rolando e freando
  }

  // Stretch na velocidade, squash no contato com o chão
  let sy = 1 + speed * 0.28
  let sx = 1 - speed * 0.16
  const near = Math.min(...CONTACTS.map((c) => Math.abs(clamped - c)))
  if (near < SQUASH_WINDOW) {
    const q = 1 - near / SQUASH_WINDOW
    sy = 1 - 0.42 * q
    sx = 1 + 0.42 * q
  }
  return { x, y, sx, sy }
}

/** Amostras em intervalos de tempo iguais: o espaçamento entre elas É o timing. */
export const GHOSTS = Array.from({ length: 34 }, (_, i) => {
  const u = (i / 33) * BALL_TOTAL
  return { u, ...ballAt(u) }
})

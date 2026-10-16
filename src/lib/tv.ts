/**
 * Estado compartilhado entre a timeline da TV (DOM/GSAP) e o mundo 3D (Canvas).
 * Objeto mutável: o scroll não passa pelo React.
 */
export const tv = {
  /** Progresso dentro do canal 3D (0 a 1), dirigido pelo scroll */
  planet: 0,
  /** O canal 3D está na tela? Fora dele o canvas não renderiza */
  planetVisible: false,
}

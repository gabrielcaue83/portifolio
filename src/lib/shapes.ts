/** Estrelinha de 4 pontas usada em letreiros, cliques e brilhos. */
export const STAR_PATH = 'M0-22C3-3 3-3 22 0 3 3 3 3 0 22-3 3-3 3-22 0-3-3-3-3 0-22Z'

/** Formas do canal de animação vetorial (viewBox 0 0 200 200), na ordem do morph. */
export const MORPH_SHAPES = [
  { d: 'M100 18 L122 74 L182 76 L134 112 L152 170 L100 136 L48 170 L66 112 L18 76 L78 74 Z', fill: '#FF2E93', bg: '#B6FF3B' },
  { d: 'M100 22 C140 18 178 50 176 96 C174 140 146 178 100 176 C56 174 24 146 26 100 C28 56 58 26 100 22 Z', fill: '#FF8A00', bg: '#FF2E93' },
  { d: 'M100 172 C60 140 20 112 20 72 C20 44 42 26 66 26 C82 26 94 34 100 46 C106 34 118 26 134 26 C158 26 180 44 180 72 C180 112 140 140 100 172 Z', fill: '#FF2E93', bg: '#FF8A00' },
  { d: 'M116 16 L46 110 L94 110 L80 184 L154 84 L106 84 Z', fill: '#B6FF3B', bg: '#0E0E0E' },
]

/** Posição da tela do Chiado no viewBox 320x400: a "janela" por onde se entra nos mundos. */
export const TV_SCREEN = { x: 64, y: 80, w: 156, h: 148, r: 24, vw: 320, vh: 400 }

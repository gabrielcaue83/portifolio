/** Dispara o Easter Egg. Quem escuta é o PanicOverlay (e os mascotes). */
export const PANIC_EVENT = 'panic'

export function triggerPanic() {
  window.dispatchEvent(new Event(PANIC_EVENT))
}

/** Intensidade do pânico (0 = calmo, 1 = PÂNICO), lida pelo pós-processamento 3D. */
export const fx = { panic: 0 }

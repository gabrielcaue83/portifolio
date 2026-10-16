/** Dispara o Easter Egg. Quem escuta é o PanicOverlay. */
export const PANIC_EVENT = 'panic'

export function triggerPanic() {
  window.dispatchEvent(new Event(PANIC_EVENT))
}

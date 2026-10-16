/** Disparado quando a íris de abertura começa a abrir: o Hero entra nesse momento. */
export const INTRO_EVENT = 'intro:open'

export const introState = { opened: false }

export function openIntro() {
  if (introState.opened) return
  introState.opened = true
  window.dispatchEvent(new Event(INTRO_EVENT))
}

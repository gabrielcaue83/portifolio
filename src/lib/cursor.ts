/** Permite que objetos 3D (que não são elementos do DOM) acionem o estado de hover do cursor. */
export const CURSOR_LABEL_EVENT = 'cursor:label'

export function setCursorLabel(label: string | null) {
  window.dispatchEvent(new CustomEvent<string | null>(CURSOR_LABEL_EVENT, { detail: label }))
}

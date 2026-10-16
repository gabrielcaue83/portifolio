import type Lenis from '@studio-freight/lenis'
import { createContext, useContext } from 'react'

export const LenisContext = createContext<Lenis | null>(null)

/**
 * Instância global do Lenis (para `scrollTo`, `stop`, `start`...).
 * É `null` antes de montar e quando o usuário prefere movimento reduzido.
 */
export function useLenis() {
  return useContext(LenisContext)
}

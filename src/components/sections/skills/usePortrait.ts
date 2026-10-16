import { useEffect, useState } from 'react'

const QUERY = '(max-aspect-ratio: 1/1)'

/** Tela em pé (celular): os mundos usam um enquadramento mais alto. */
export function usePortrait() {
  const [portrait, setPortrait] = useState(() => matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = matchMedia(QUERY)
    const onChange = () => setPortrait(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return portrait
}

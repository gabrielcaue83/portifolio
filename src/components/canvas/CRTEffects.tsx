import { useFrame } from '@react-three/fiber'
import {
  ChromaticAberration,
  EffectComposer,
  Noise,
  Scanline,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction, type ChromaticAberrationEffect, type ScanlineEffect } from 'postprocessing'
import { useEffect, useRef } from 'react'
import { Vector2 } from 'three'
import { fx } from '../../lib/rig'

// Leve: só alguns pixels de separação RGB, mais forte nas bordas (radialModulation)
const BASE_OFFSET = new Vector2(0.0015, 0.001)

/** Pós-processamento estilo TV de tubo: aberração cromática, scanlines rolando, ruído e vinheta. */
export function CRTEffects() {
  const scanline = useRef<ScanlineEffect>(null)
  const aberration = useRef<ChromaticAberrationEffect>(null)

  useEffect(() => {
    // scrollSpeed não é exposto como prop pelo wrapper do R3F
    if (scanline.current) scanline.current.scrollSpeed = 0.015
  }, [])

  useFrame(() => {
    // No pânico a TV "perde o sinal": aberração forte e tremida
    const jitter = fx.panic * (0.01 + Math.random() * 0.012)
    aberration.current?.offset.set(BASE_OFFSET.x + jitter, BASE_OFFSET.y + jitter * 0.6)
  })

  return (
    <EffectComposer multisampling={4}>
      <ChromaticAberration
        ref={aberration}
        offset={BASE_OFFSET}
        radialModulation
        modulationOffset={0.2}
      />
      <Scanline
        ref={scanline}
        blendFunction={BlendFunction.OVERLAY}
        density={0.75}
        opacity={0.18}
      />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.25} />
      <Vignette offset={0.25} darkness={0.5} />
    </EffectComposer>
  )
}

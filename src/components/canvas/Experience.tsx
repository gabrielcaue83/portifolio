import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CRTEffects } from './CRTEffects'
import { Scene } from './Scene'

/**
 * Canvas global, fixo atrás de todo o conteúdo.
 * Os eventos de ponteiro vêm do `body`, então o 3D reage ao mouse (e a cliques)
 * mesmo com o canvas sem `pointer-events` e coberto pelas seções.
 */
export function Experience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        flat // sem tone mapping: as cores pop saem chapadas, como definidas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
        <Scene />
        <CRTEffects />
      </Canvas>
    </div>
  )
}

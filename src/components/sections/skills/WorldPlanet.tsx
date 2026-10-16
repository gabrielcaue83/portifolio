import { Canvas } from '@react-three/fiber'
import { CRTEffects } from '../../canvas/CRTEffects'
import { ErrorBoundary } from '../../ui/ErrorBoundary'
import { PlanetScene } from './PlanetScene'
import { WorldInfo } from './WorldInfo'

/** Canal 3: um planeta toon em tela cheia. A câmera mergulha nele com o scroll. */
export function WorldPlanet() {
  return (
    <div className="world" data-world="planet" style={{ background: 'var(--ink)' }}>
      <ErrorBoundary
        fallback={() => (
          <div className="grid h-full place-items-center p-6 text-center font-mono text-paper">
            O 3D não carregou neste navegador.
          </div>
        )}
      >
        <Canvas
          frameloop="demand"
          flat
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
          camera={{ position: [0, 5, 17], fov: 32 }}
        >
          <PlanetScene />
          <CRTEffects />
        </Canvas>
      </ErrorBoundary>
      <span className="pop-word" data-pop="0" style={{ right: '10%', top: '24%', background: 'var(--acid)', color: 'var(--ink)' }}>
        ZOOM!
      </span>
      <span className="world-hint hint-mouse">arrasta · clica</span>
      <span className="world-hint hint-touch">toca no planeta</span>
      <WorldInfo
        title="3D com Three.js"
        text="3D com cara de desenho: sombra em faixas, contorno preto e física de borracha, rodando direto no navegador."
        chips={['Three.js', 'Toon shading', 'WebGL']}
      />
    </div>
  )
}

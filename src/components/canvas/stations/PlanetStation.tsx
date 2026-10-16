import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { fx, STATION_Y } from '../../../lib/rig'
import { ToonMesh } from '../ToonMesh'

const STARS = [
  [-2.6, 1.6, -1],
  [2.8, 1.9, -2],
  [2.2, -1.8, 0.5],
  [-2.2, -1.5, -1.5],
] as const

/** Planeta com anel da seção Contato. No modo pânico ele gira descontrolado. */
export function PlanetStation() {
  const planet = useRef<Group>(null)
  const stars = useRef<Group>(null)

  useFrame((_, delta) => {
    if (planet.current) planet.current.rotation.y += delta * (0.25 + fx.panic * 8)
    if (stars.current) stars.current.rotation.z += delta * (0.05 + fx.panic * 3)
  })

  return (
    <group position={[0, STATION_Y.contact, 0]}>
      <group ref={planet} rotation={[0.2, 0, 0.35]}>
        <ToonMesh geometry={<sphereGeometry args={[1.4, 64, 32]} />} color="#ff3ea5" outline={0.07} />
        <ToonMesh
          geometry={<torusGeometry args={[2.3, 0.22, 16, 128]} />}
          color="#ffe600"
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, 0.3]}
          outline={0.04}
        />
      </group>
      <group ref={stars}>
        {STARS.map((pos, i) => (
          <ToonMesh
            key={i}
            geometry={<octahedronGeometry args={[0.2]} />}
            color="#ffffff"
            position={[...pos]}
            outline={0.04}
            outlineMode="scale"
          />
        ))}
      </group>
    </group>
  )
}

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type Group } from 'three'
import { STATION_Y } from '../../../lib/rig'
import { ToonMesh } from '../ToonMesh'

const RINGS = [
  { tilt: [0.4, 0, 0.2], speed: 0.8, color: '#ffe600' },
  { tilt: [-0.6, 0.5, 0], speed: -0.6, color: '#ff3ea5' },
  { tilt: [1.2, -0.3, 0.4], speed: 1.1, color: '#39ff14' },
] as const

/** Átomo cartoon da seção Motion: inclina na direção do mouse. */
export function OrbitStation() {
  const root = useRef<Group>(null)
  const rings = useRef<(Group | null)[]>([])

  useFrame(({ pointer }, delta) => {
    if (!root.current) return
    const k = 1 - Math.exp(-3 * delta)
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, pointer.x * 0.8, k)
    root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.6, k)
    rings.current.forEach((ring, i) => {
      if (ring) ring.rotation.z += delta * RINGS[i].speed
    })
  })

  return (
    <group ref={root} position={[0, STATION_Y.motion, 0]}>
      <ToonMesh geometry={<sphereGeometry args={[1.1, 48, 24]} />} color="#00e5ff" outline={0.06} />
      {RINGS.map((r, i) => (
        <group key={i} rotation={[...r.tilt]}>
          <group ref={(el) => void (rings.current[i] = el)}>
            <ToonMesh
              geometry={<torusGeometry args={[2.3, 0.06, 12, 96]} />}
              color="#ffffff"
              outline={0.03}
            />
            <ToonMesh
              geometry={<sphereGeometry args={[0.26, 24, 12]} />}
              color={r.color}
              position={[2.3, 0, 0]}
            />
          </group>
        </group>
      ))}
    </group>
  )
}

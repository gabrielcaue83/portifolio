import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useRef } from 'react'
import type { Group } from 'three'
import { setCursorLabel } from '../../../lib/cursor'
import { fx, STATION_Y } from '../../../lib/rig'
import { audio } from '../../audio/audioManager'
import { ToonMesh } from '../ToonMesh'

/** Nó toon do Hero. Clique para dar um giro turbo. */
export function HeroStation() {
  const group = useRef<Group>(null)
  const spin = useRef({ boost: 0 })
  const width = useThree((s) => s.viewport.width)
  const isWide = width > 6

  useFrame((_, delta) => {
    if (!group.current) return
    const speed = 1 + spin.current.boost + fx.panic * 10
    group.current.rotation.x += delta * 0.3 * speed
    group.current.rotation.y += delta * 0.5 * speed
  })

  const onClick = () => {
    gsap.fromTo(spin.current, { boost: 14 }, { boost: 0, duration: 1.6, ease: 'power3.out' })
    audio.play('boing')
  }

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <group
        ref={group}
        position={isWide ? [width * 0.22, STATION_Y.hero, 0] : [width * 0.2, STATION_Y.hero - 1.9, 0]}
        scale={isWide ? 0.8 : 0.5}
        onClick={onClick}
        onPointerOver={() => setCursorLabel('gira!')}
        onPointerOut={() => setCursorLabel(null)}
      >
        <ToonMesh
          geometry={<torusKnotGeometry args={[1, 0.35, 160, 24]} />}
          color="#ff3ea5"
          outline={0.06}
        />
      </group>
    </Float>
  )
}

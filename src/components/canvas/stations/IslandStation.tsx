import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useRef } from 'react'
import type { Group } from 'three'
import { setCursorLabel } from '../../../lib/cursor'
import { rig, STATION_Y } from '../../../lib/rig'
import { audio } from '../../audio/audioManager'
import { ToonMesh } from '../ToonMesh'
import { toonUniforms } from '../toonMaterial'

type Vec3 = [number, number, number]

const TREES: { pos: Vec3; scale: number }[] = [
  { pos: [-1.2, 0.55, -0.7], scale: 1 },
  { pos: [1.1, 0.5, -1.1], scale: 0.8 },
  { pos: [-0.4, 0.6, 1.3], scale: 0.65 },
]

const GEMS: { pos: Vec3; color: string }[] = [
  { pos: [1.5, 1.2, 0.7], color: '#ff3ea5' },
  { pos: [-1.6, 1.5, 0.6], color: '#00e5ff' },
  { pos: [0.3, 1.7, -1.5], color: '#ffe600' },
]

const CLOUDS: { pos: Vec3; speed: number }[] = [
  { pos: [-3.2, 2.6, -2], speed: 0.4 },
  { pos: [3.4, 2.2, -1], speed: 0.3 },
  { pos: [0.5, 3.4, -3.5], speed: 0.5 },
]

function Tree({ pos, scale }: { pos: Vec3; scale: number }) {
  return (
    <group position={pos} scale={scale}>
      <ToonMesh geometry={<capsuleGeometry args={[0.13, 0.5, 6, 12]} />} color="#b5651d" position={[0, 0.3, 0]} />
      <ToonMesh geometry={<sphereGeometry args={[0.55, 32, 16]} />} color="#1fbf3a" position={[0, 0.95, 0]} />
      <ToonMesh geometry={<sphereGeometry args={[0.38, 32, 16]} />} color="#39ff14" position={[0.1, 1.4, 0.05]} />
    </group>
  )
}

function Mushroom() {
  return (
    <group position={[0.9, 0.55, 0.9]}>
      <ToonMesh geometry={<capsuleGeometry args={[0.16, 0.35, 6, 12]} />} color="#fff3d6" position={[0, 0.2, 0]} />
      <ToonMesh
        geometry={<sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />}
        color="#ff2e2e"
        position={[0, 0.45, 0]}
      />
      <ToonMesh geometry={<sphereGeometry args={[0.08, 12, 8]} />} color="#ffffff" position={[0.18, 0.8, 0.22]} />
      <ToonMesh geometry={<sphereGeometry args={[0.06, 12, 8]} />} color="#ffffff" position={[-0.2, 0.75, 0.2]} />
    </group>
  )
}

/** Cristal flutuante: hover cresce, clique pula e faz "boing". */
function Gem({ pos, color, index }: { pos: Vec3; color: string; index: number }) {
  const bob = useRef<Group>(null)
  const body = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!bob.current) return
    bob.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 2 + index * 2) * 0.12
    bob.current.rotation.y = clock.elapsedTime * 0.8 + index
  })

  const onClick = () => {
    if (!body.current) return
    gsap
      .timeline()
      .to(body.current.position, { y: 1.2, duration: 0.3, ease: 'power2.out' })
      .to(body.current.rotation, { y: `+=${Math.PI * 2}`, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(body.current.position, { y: 0, duration: 0.6, ease: 'bounce.out' })
    audio.play('boing')
  }

  const setHover = (on: boolean) => {
    if (body.current) gsap.to(body.current.scale, { x: on ? 1.3 : 1, y: on ? 1.3 : 1, z: on ? 1.3 : 1, duration: 0.3, ease: 'back.out(3)' })
    setCursorLabel(on ? 'clique!' : null)
  }

  return (
    <group ref={bob} position={pos}>
      <group
        ref={body}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
      >
        <ToonMesh
          geometry={<octahedronGeometry args={[0.28]} />}
          color={color}
          outline={0.04}
          outlineMode="scale"
          scale={[1, 1.5, 1]}
        />
      </group>
    </group>
  )
}

function Cloud({ pos, speed }: { pos: Vec3; speed: number }) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = pos[0] + Math.sin(clock.elapsedTime * speed) * 0.6
  })
  return (
    <group ref={ref} position={pos}>
      <ToonMesh geometry={<sphereGeometry args={[0.5, 24, 12]} />} color="#ffffff" />
      <ToonMesh geometry={<sphereGeometry args={[0.38, 24, 12]} />} color="#ffffff" position={[0.55, -0.1, 0]} />
      <ToonMesh geometry={<sphereGeometry args={[0.32, 24, 12]} />} color="#ffffff" position={[-0.5, -0.12, 0.05]} />
    </group>
  )
}

function Sun() {
  const ref = useRef<Group>(null)
  useFrame(() => {
    const dir = toonUniforms.uLightDir.value
    ref.current?.position.set(dir.x * 5, dir.y * 4 - 0.5, -4)
  })
  return (
    <group ref={ref}>
      <ToonMesh geometry={<sphereGeometry args={[0.7, 32, 16]} />} color="#fff27a" outline={0.05} />
    </group>
  )
}

/** Ilha flutuante cel-shaded. O scroll gira a ilha, baixa o sol e reduz as bandas de luz. */
export function IslandStation() {
  const island = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (island.current) island.current.rotation.y = rig.spin * Math.PI * 1.5 + clock.elapsedTime * 0.06
  })

  return (
    <group position={[0, STATION_Y.three, 0]}>
      <Sun />
      {CLOUDS.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}

      <group ref={island}>
        {/* Grama: esfera achatada */}
        <ToonMesh geometry={<sphereGeometry args={[2.6, 64, 32]} />} color="#39ff14" scale={[1, 0.28, 1]} outline={0.12} />
        {/* Terra: esfera esticada para baixo, o "bloco" da ilha flutuante */}
        <ToonMesh
          geometry={<sphereGeometry args={[2.4, 64, 32]} />}
          color="#c06a2b"
          position={[0, -0.9, 0]}
          scale={[1, 0.6, 1]}
          outline={0.08}
        />
        {TREES.map((t, i) => (
          <Tree key={i} {...t} />
        ))}
        <Mushroom />
        {GEMS.map((g, i) => (
          <Gem key={i} index={i} {...g} />
        ))}
      </group>
    </group>
  )
}

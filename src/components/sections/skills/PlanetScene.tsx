import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3, type Group } from 'three'
import { tv } from '../../../lib/tv'
import { audio } from '../../audio/audioManager'
import { ToonMesh } from '../../canvas/ToonMesh'
import { toonUniforms } from '../../canvas/toonMaterial'

const CRATERS: [number, number, number, number][] = [
  [-0.45, 0.55, 0.7, 0.16],
  [0.55, -0.35, 0.76, 0.12],
  [-0.2, -0.7, 0.68, 0.1],
  [0.7, 0.45, 0.55, 0.09],
]

/** PRNG determinístico para as estrelas ficarem sempre no mesmo lugar. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

const camTarget = new Vector3()

/**
 * Planeta cartoon do canal 3D. A câmera voa de longe até a carinha conforme o
 * scroll (tv.planet); arrastar gira com inércia e clicar faz ele quicar.
 */
export function PlanetScene() {
  const world = useRef<Group>(null)
  const planet = useRef<Group>(null)
  const moonPivot = useRef<Group>(null)
  const ringPivot = useRef<Group>(null)
  const face = useRef<Group>(null)
  const { gl, invalidate } = useThree()

  const stars = useMemo(() => {
    const rand = seeded(42)
    return Array.from({ length: 40 }, (_, i) => ({
      pos: [(rand() - 0.5) * 22, (rand() - 0.5) * 14, -4 - rand() * 8] as [number, number, number],
      color: i % 3 ? '#F2EEE3' : '#B6FF3B',
    }))
  }, [])

  // Arrastar com inércia + clique = quique de borracha
  const drag = useRef({ active: false, touch: false, lx: 0, ly: 0, vx: 0.006, vy: 0, moved: 0 })
  useEffect(() => {
    toonUniforms.uSteps.value = 3
    toonUniforms.uLightDir.value.set(3, 4, 5).normalize()
    const el = gl.domElement
    const d = drag.current
    const down = (e: PointerEvent) => {
      d.active = true
      // No toque, arrastar é do scroll: só o toque rápido (tap) faz o planeta quicar
      d.touch = e.pointerType !== 'mouse'
      d.moved = 0
      d.lx = e.clientX
      d.ly = e.clientY
      if (!d.touch) el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!d.active) return
      const dx = e.clientX - d.lx
      const dy = e.clientY - d.ly
      d.lx = e.clientX
      d.ly = e.clientY
      d.moved += Math.abs(dx) + Math.abs(dy)
      if (d.touch) return
      d.vx = dx * 0.006
      d.vy = dy * 0.006
    }
    const up = () => {
      if (!d.active) return
      d.active = false
      if (d.moved < 6 && planet.current) {
        const p = planet.current
        audio.play('boing')
        gsap
          .timeline()
          .to(p.scale, { x: 1.25, y: 0.72, z: 1.25, duration: 0.1, ease: 'power2.out' })
          .to(p.position, { y: 0.8, duration: 0.3, ease: 'power2.out' })
          .to(p.scale, { x: 0.88, y: 1.15, z: 0.88, duration: 0.3 }, '<')
          .to(p.position, { y: 0, duration: 0.28, ease: 'power2.in' })
          .to(p.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'elastic.out(1, .3)' })
        d.vx += 0.08
      }
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)

    // Só desenha quando o canal 3D está no ar (frameloop "demand")
    const tick = () => {
      if (tv.planetVisible) invalidate()
    }
    gsap.ticker.add(tick)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      gsap.ticker.remove(tick)
    }
  }, [gl, invalidate])

  useFrame(({ camera, clock }, delta) => {
    const d = drag.current
    const t = clock.elapsedTime
    if (!d.active) {
      d.vx += (0.006 - d.vx) * 0.03
      d.vy *= 0.92
    }
    if (world.current) {
      world.current.rotation.y += d.vx
      world.current.rotation.x = MathUtils.clamp(world.current.rotation.x + d.vy, -0.6, 0.6)
    }
    if (moonPivot.current) moonPivot.current.rotation.y = t * 0.9
    if (ringPivot.current) ringPivot.current.rotation.z = 0.32 + Math.sin(t * 0.8) * 0.05
    if (face.current) face.current.position.y = Math.sin(t * 2) * 0.01

    // Voo de câmera: de longe (planeta pequeno) até a carinha, dando a volta pelo anel
    const p = gsap.parseEase('power2.inOut')(tv.planet)
    const angle = MathUtils.lerp(-1.6, 0, p)
    const radius = MathUtils.lerp(17, 4.4, p)
    camTarget.set(Math.sin(angle) * radius, MathUtils.lerp(5, 0.3, p), Math.cos(angle) * radius)
    camera.position.lerp(camTarget, 1 - Math.exp(-6 * delta))
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={world}>
        <group ref={planet}>
          <ToonMesh geometry={<sphereGeometry args={[1, 48, 32]} />} color="#FF8A00" outline={0.05} />
          {CRATERS.map(([x, y, z, r], i) => {
            const pos = new Vector3(x, y, z).normalize().multiplyScalar(0.97)
            return (
              <mesh key={i} position={pos} scale={[1, 1, 0.35]} onUpdate={(m) => m.lookAt(0, 0, 0)}>
                <sphereGeometry args={[r, 16, 12]} />
                <meshBasicMaterial color="#d96f00" />
              </mesh>
            )
          })}
          <group ref={face}>
            {[-0.3, 0.3].map((x) => (
              <group key={x}>
                <mesh position={[x, 0.16, 0.95]} scale={[1, 1.45, 0.45]}>
                  <sphereGeometry args={[0.12, 16, 12]} />
                  <meshBasicMaterial color="#0E0E0E" />
                </mesh>
                <mesh position={[x + 0.035, 0.24, 1.0]}>
                  <sphereGeometry args={[0.035, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}
            <mesh position={[0, -0.1, 0.97]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.2, 0.032, 8, 24, Math.PI]} />
              <meshBasicMaterial color="#0E0E0E" />
            </mesh>
            {[-0.52, 0.52].map((x) => (
              <mesh key={x} position={[x, -0.08, 0.86]} onUpdate={(m) => m.lookAt(x * 3, -0.3, 4)}>
                <circleGeometry args={[0.09, 20]} />
                <meshBasicMaterial color="#FF2E93" />
              </mesh>
            ))}
          </group>
        </group>
        <group ref={ringPivot} rotation={[1.2, 0, 0.32]}>
          <ToonMesh geometry={<torusGeometry args={[1.7, 0.1, 16, 120]} />} color="#FF2E93" outline={0.035} scale={[1, 1, 0.5]} />
        </group>
        <group ref={moonPivot}>
          <ToonMesh geometry={<sphereGeometry args={[0.26, 24, 16]} />} color="#B6FF3B" outline={0.03} position={[2.35, 0.55, 0]} />
        </group>
      </group>
      {stars.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshBasicMaterial color={s.color} />
        </mesh>
      ))}
    </>
  )
}

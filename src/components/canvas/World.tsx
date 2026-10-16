import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Color, MathUtils, Vector3, type DirectionalLight } from 'three'
import { fx, rig, solveRig } from '../../lib/rig'
import { toonUniforms } from './toonMaterial'

const sky = new Color()
const PANIC_RED = new Color('#ff2e2e')
const DAY = new Color('#ffffff')
const SUNSET = new Color('#ffc59e')
const cameraTarget = new Vector3()
const lookTarget = new Vector3()
const look = new Vector3(rig.lx, rig.ly, rig.lz)

/**
 * Aplica o estado do trilho (dirigido pelo ScrollTrigger) ao mundo 3D:
 * câmera, céu e luz do cel-shading. Também soma o parallax do mouse e o
 * tremor do Panic Button.
 */
export function World() {
  const light = useRef<DirectionalLight>(null)

  useFrame(({ camera, pointer }, delta) => {
    solveRig()

    sky.setHSL(((rig.h % 1) + 1) % 1, rig.s, rig.l).lerp(PANIC_RED, fx.panic * 0.6)

    // O sol desce do meio-dia ao horizonte conforme `rig.sun`
    const angle = MathUtils.lerp(1.1, 0.22, rig.sun)
    toonUniforms.uLightDir.value.set(Math.cos(angle) * 0.8, Math.sin(angle), 0.6).normalize()
    toonUniforms.uLightColor.value.copy(DAY).lerp(SUNSET, rig.sun)
    toonUniforms.uSteps.value = rig.steps
    light.current?.position.copy(toonUniforms.uLightDir.value).multiplyScalar(10)

    // Damping exponencial: suave e independente do FPS
    const k = 1 - Math.exp(-5 * delta)
    cameraTarget.set(rig.px + pointer.x * 0.5, rig.py + pointer.y * 0.3, rig.pz)
    camera.position.lerp(cameraTarget, k)
    look.lerp(lookTarget.set(rig.lx, rig.ly, rig.lz), k)

    if (fx.panic > 0) {
      camera.position.x += (Math.random() - 0.5) * 0.3 * fx.panic
      camera.position.y += (Math.random() - 0.5) * 0.3 * fx.panic
    }
    camera.lookAt(look)
  })

  return (
    <>
      <primitive object={sky} attach="background" />
      {/* Só o MeshToonMaterial (confete) usa luzes da cena; o shader toon lê os uniforms */}
      <ambientLight intensity={0.8} />
      <directionalLight ref={light} intensity={2} />
    </>
  )
}

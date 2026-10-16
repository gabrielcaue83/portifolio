import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BackSide,
  Color,
  DataTexture,
  Euler,
  InstancedMesh,
  Matrix4,
  NearestFilter,
  Quaternion,
  RedFormat,
  Vector3,
} from 'three'
import { STATION_Y } from '../../../lib/rig'

const COUNT = 90
const COLORS = ['#ffe600', '#00e5ff', '#39ff14', '#ff7a00', '#ffffff', '#9b5cff']

/** PRNG determinístico: o confete fica no mesmo lugar a cada carregamento. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rampa de 3 tons com filtro "nearest": o MeshToonMaterial vira cel-shading duro. */
function createGradientMap() {
  const texture = new DataTexture(new Uint8Array([70, 150, 255]), 3, 1, RedFormat)
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter
  texture.needsUpdate = true
  return texture
}

const matrix = new Matrix4()
const quaternion = new Quaternion()
const euler = new Euler()
const scaleVec = new Vector3()

/** Nuvem de confete 3D que a câmera atravessa na seção GSAP. */
export function ConfettiStation() {
  const body = useRef<InstancedMesh>(null)
  const outline = useRef<InstancedMesh>(null)
  const gradientMap = useMemo(() => createGradientMap(), [])

  const items = useMemo(() => {
    const rand = mulberry32(7)
    const list = []
    while (list.length < COUNT) {
      const pos = new Vector3((rand() - 0.5) * 14, 6 - rand() * 22, -10 + rand() * 14)
      // Deixa livre o corredor por onde a câmera passa
      if (Math.abs(pos.x) < 1.6 && pos.z > -2) continue
      list.push({
        pos,
        rot: new Vector3(rand() * 6, rand() * 6, rand() * 6),
        speed: 0.3 + rand() * 1.2,
        scale: 0.15 + rand() * 0.35,
        color: new Color(COLORS[Math.floor(rand() * COLORS.length)]),
      })
    }
    return list
  }, [])

  useLayoutEffect(() => {
    items.forEach((item, i) => body.current?.setColorAt(i, item.color))
    if (body.current?.instanceColor) body.current.instanceColor.needsUpdate = true
  }, [items])

  useFrame(({ clock }) => {
    if (!body.current || !outline.current) return
    const t = clock.elapsedTime
    items.forEach((item, i) => {
      euler.set(item.rot.x + t * item.speed, item.rot.y + t * item.speed * 0.7, item.rot.z)
      quaternion.setFromEuler(euler)
      scaleVec.setScalar(item.scale)
      matrix.compose(item.pos, quaternion, scaleVec)
      body.current!.setMatrixAt(i, matrix)
      scaleVec.setScalar(item.scale * 1.22)
      matrix.compose(item.pos, quaternion, scaleVec)
      outline.current!.setMatrixAt(i, matrix)
    })
    body.current.instanceMatrix.needsUpdate = true
    outline.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={[0, STATION_Y.gsap, 0]}>
      <instancedMesh ref={body} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </instancedMesh>
      <instancedMesh ref={outline} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="black" side={BackSide} />
      </instancedMesh>
    </group>
  )
}

import type { ThreeElements } from '@react-three/fiber'
import { useMemo, type ReactNode } from 'react'
import { createOutlineMaterial, createToonMaterial } from './toonMaterial'

type ToonMeshProps = Omit<ThreeElements['group'], 'children'> & {
  /** Elemento de geometria, ex: `<sphereGeometry />` */
  geometry: ReactNode
  color: string
  outline?: number
  /**
   * `normal` extruda pelas normais (formas lisas). `scale` aumenta a casca inteira,
   * melhor para formas facetadas (octaedro, cone) cujas normais separadas abririam buracos.
   */
  outlineMode?: 'normal' | 'scale'
}

/** Mesh cel-shaded com contorno preto (inverted hull), estilo desenho animado. */
export function ToonMesh({
  geometry,
  color,
  outline = 0.04,
  outlineMode = 'normal',
  ...props
}: ToonMeshProps) {
  const material = useMemo(() => createToonMaterial(color), [color])
  const outlineMaterial = useMemo(
    () => createOutlineMaterial(outlineMode === 'normal' ? outline : 0),
    [outline, outlineMode],
  )

  return (
    <group {...props}>
      <mesh material={material}>{geometry}</mesh>
      <mesh material={outlineMaterial} scale={outlineMode === 'scale' ? 1 + outline * 3 : 1}>
        {geometry}
      </mesh>
    </group>
  )
}

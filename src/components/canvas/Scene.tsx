import { ConfettiStation } from './stations/ConfettiStation'
import { HeroStation } from './stations/HeroStation'
import { IslandStation } from './stations/IslandStation'
import { OrbitStation } from './stations/OrbitStation'
import { PlanetStation } from './stations/PlanetStation'
import { World } from './World'

/**
 * Um único mundo 3D com uma "estação" por seção, empilhadas no eixo Y.
 * A câmera desce de uma para a outra conforme o scroll (ver CameraDirector).
 */
export function Scene() {
  return (
    <>
      <World />
      <HeroStation />
      <IslandStation />
      <ConfettiStation />
      <OrbitStation />
      <PlanetStation />
    </>
  )
}

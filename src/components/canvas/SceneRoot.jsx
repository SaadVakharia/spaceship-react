import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Nebula } from '../three/environment/Nebula'
import { Stars } from '../three/environment/Stars'
import { IntroScene } from '../three/intro/IntroScene'

// Preload 2D planet textures so the 3D loader tracks them
useTexture.preload('/textures/playstation_planet.png')
useTexture.preload('/textures/driving_planet.png')
useTexture.preload('/textures/vr_planet.png')
useTexture.preload('/textures/pc_planet.png')

export function SceneRoot({ scrollProgress = 0 }) {
  const { gl } = useThree()

  useEffect(() => {
    gl.setClearColor('#000000', 1)
  }, [gl])

  return (
    <>
      <Nebula />
      <Stars />
      <IntroScene scrollProgress={scrollProgress} />
    </>
  )
}

import { useRef } from 'react'
import { Spaceship } from './Spaceship'
import { BlackHole } from './BlackHole'
import { Stars } from '../environment/Stars'
import { useIntroAnimation } from './useIntroAnimation'

export function IntroScene({ scrollProgress }) {
  const spaceshipRef = useRef()
  const introGroupRef = useRef()

  useIntroAnimation(scrollProgress, spaceshipRef, introGroupRef)

  return (
    <group ref={introGroupRef}>
      <directionalLight
        intensity={1.8}
        position={[0, 10, 0]}
        castShadow
        shadowBias={-0.0001}
      />

      <Spaceship ref={spaceshipRef} />
      <Stars />

      <BlackHole position={[-60, 0, 0]} scrollProgress={scrollProgress} />
    </group>
  )
}

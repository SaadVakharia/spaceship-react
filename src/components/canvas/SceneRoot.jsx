import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Nebula } from '../three/environment/Nebula'
import { IntroScene } from '../three/intro/IntroScene'
import { PlanetsScene } from '../three/planets/PlanetsScene'
import { PLANETS_START } from '../../config/scroll'

export function SceneRoot({ scrollProgress = 0 }) {
  const { gl } = useThree()

  useEffect(() => {
    gl.setClearColor('#000000', 1)
  }, [gl])

  const showPlanets = scrollProgress >= PLANETS_START - 0.3

  return (
    <>
      <Nebula />
      <IntroScene scrollProgress={scrollProgress} />
      <PlanetsScene scrollProgress={scrollProgress} visible={showPlanets} />
    </>
  )
}

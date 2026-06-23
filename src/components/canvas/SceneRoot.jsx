import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Nebula } from '../three/environment/Nebula'
import { Stars } from '../three/environment/Stars'
import { IntroScene } from '../three/intro/IntroScene'

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

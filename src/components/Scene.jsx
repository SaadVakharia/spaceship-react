import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Spaceship } from './Spaceship'
import { Stars } from './Stars'
import { BlackHole } from './Blackhole'
import { Nebula } from './Nebula'

export function Scene({ scrollProgress = 0 }) {
  const { camera, gl } = useThree()

  const spaceshipRef = useRef()
  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)

  useEffect(() => {
    gl.setClearColor('#000000', 1)
  }, [gl])

  useEffect(() => {
    scrollTarget.current = scrollProgress
  }, [scrollProgress])

  useFrame(() => {
    scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.05
    const scroll = scrollCurrent.current

    const isMobile = window.innerWidth < 768
    const radius       = isMobile ? 24 : 12
    const cameraHeight = isMobile ? 16 : 8

    // 0→1: camera orbit
    const orbitProgress = THREE.MathUtils.clamp(scroll, 0, 1)
    const orbitAngle    = THREE.MathUtils.lerp(Math.PI * 0.65, 0, orbitProgress)

    const finalCameraX = radius
    const finalCameraY = cameraHeight
    const finalCameraZ = 0

    if (scroll < 1) {
      camera.position.set(
        Math.cos(orbitAngle) * radius,
        cameraHeight,
        Math.sin(orbitAngle) * radius
      )
    } else {
      camera.position.set(finalCameraX, finalCameraY, finalCameraZ)

      const shakeStrength = THREE.MathUtils.smoothstep(Math.max(0, scroll - 1), 1, 3) * 0.05
      camera.position.x += (Math.random() - 0.5) * shakeStrength
      camera.position.y += (Math.random() - 0.5) * shakeStrength
      camera.position.z += (Math.random() - 0.5) * shakeStrength
    }

    // Spaceship — original behavior
    const time = performance.now() * 0.001

    if (spaceshipRef.current) {
      const flyProgress = Math.max(0, scroll - 1)
      const shipX = scroll < 1 ? 0 : -flyProgress * 30

      const bobY = Math.sin(time) * 0.05
      const swayZ = Math.cos(time * 2) * 0.05

      const turbulence = flyProgress > 1.2
        ? (Math.random() - 0.5) * 0.02
        : 0

      spaceshipRef.current.position.set(shipX, bobY + turbulence, swayZ + turbulence)
      spaceshipRef.current.rotation.set(
        Math.sin(time * 1.5) * 0.05,
        0,
        Math.cos(time * 2.2) * 0.05
      )
      spaceshipRef.current.scale.set(1, 1, 1)

      camera.lookAt(spaceshipRef.current.position)
    }
  })

  return (
    <>
      <Nebula />

      <directionalLight
        intensity={1.8}
        position={[0, 10, 0]}
        castShadow
        shadowBias={-0.0001}
      />

      <Spaceship ref={spaceshipRef} />
      <Stars />

      <BlackHole
        position={[-60, 0, 0]}
        scrollProgress={scrollProgress}
      />
    </>
  )
}
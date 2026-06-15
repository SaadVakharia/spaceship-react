import { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { Spaceship } from './Spaceship'
import { Stars } from './Stars'
import { BlackHole } from './Blackhole'

export function Scene({ scrollProgress = 0 }) {
  const { scene, camera, gl } = useThree()

  const spaceshipRef = useRef()

  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)

  useEffect(() => {
    gl.setClearColor('#000000', 1)
  }, [gl])

  useEffect(() => {
    scrollTarget.current = scrollProgress
  }, [scrollProgress])

  const pmrem = useMemo(() => new THREE.PMREMGenerator(gl), [gl])
  const envMapRT = useRef(null)
  const envMapApplied = useRef(false)

  useFrame(() => {
    // Smooth interpolation
    scrollCurrent.current +=
      (scrollTarget.current - scrollCurrent.current) * 0.05

    const scroll = scrollCurrent.current

    // 0 -> 1 : camera orbit
    const orbitProgress = THREE.MathUtils.clamp(scroll, 0, 1)

    // >1 : ship flies
    const flyProgress = Math.max(0, scroll - 1)

    const isMobile = window.innerWidth < 768

    const radius = isMobile ? 24 : 12
    const cameraHeight = isMobile ? 16 : 8

    // Camera rotates around the origin
    const orbitAngle = THREE.MathUtils.lerp(
      Math.PI * 0.65,
      0,
      orbitProgress
    )

    // Final camera position after orbit
    const finalCameraX = radius
    const finalCameraY = cameraHeight
    const finalCameraZ = 0

    // -----------------------------
    // CAMERA
    // -----------------------------

    if (scroll < 1) {
      // Orbit normally
      camera.position.set(
        Math.cos(orbitAngle) * radius,
        cameraHeight,
        Math.sin(orbitAngle) * radius
      )
    } else {
      // Freeze at final orbit location
      camera.position.set(
        finalCameraX,
        finalCameraY,
        finalCameraZ
      )

      // Small camera shake near the black hole
      const shakeStrength =
        THREE.MathUtils.smoothstep(flyProgress, 1, 3) * 0.05

      camera.position.x +=
        (Math.random() - 0.5) * shakeStrength

      camera.position.y +=
        (Math.random() - 0.5) * shakeStrength

      camera.position.z +=
        (Math.random() - 0.5) * shakeStrength
    }

    // -----------------------------
    // SPACESHIP
    // -----------------------------

    const time = performance.now() * 0.001

    if (spaceshipRef.current) {
      // Ship movement
      const shipX = scroll < 1 ? 0 : -flyProgress * 30

      // Idle floating
      const bobY = Math.sin(time) * 0.05
      const swayZ = Math.cos(time * 2) * 0.05

      // Optional turbulence near the black hole
      const turbulence =
        flyProgress > 1.2
          ? (Math.random() - 0.5) * 0.02
          : 0

      spaceshipRef.current.position.set(
        shipX,
        bobY + turbulence,
        swayZ + turbulence
      )

      // Gentle rocking motion
      spaceshipRef.current.rotation.set(
        Math.sin(time * 1.5) * 0.05,
        0,
        Math.cos(time * 2.2) * 0.05
      )

      spaceshipRef.current.scale.set(1, 1, 1)

      // Keep the camera looking at the ship
      camera.lookAt(spaceshipRef.current.position)
    }

    // -----------------------------
    // ENV MAP
    // -----------------------------

    if (spaceshipRef.current && !envMapApplied.current) {
      spaceshipRef.current.visible = false

      if (envMapRT.current) {
        envMapRT.current.dispose()
      }

      envMapRT.current = pmrem.fromScene(scene)

      spaceshipRef.current.visible = true

      spaceshipRef.current.traverse((child) => {
        if (child.material?.envMapIntensity !== undefined) {
          child.material.envMap = envMapRT.current.texture
          child.material.envMapIntensity = 1.5

          if (child.material.normalScale) {
            child.material.normalScale.set(0.3, 0.3)
          }

          child.material.needsUpdate = true
        }
      })

      envMapApplied.current = true
    }
  })

  return (
    <>
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
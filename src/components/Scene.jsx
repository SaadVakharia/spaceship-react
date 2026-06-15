import { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { Spaceship } from './Spaceship'
import { Stars } from './Stars'
import { BlackHole } from './BlackHole'

export function Scene({ scrollProgress = 0 }) {
  const { scene, camera, gl } = useThree()

  const spaceshipRef = useRef()

  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)

  // Cache the final camera position once the orbit is complete
  const lockedCameraPosition = useRef(new THREE.Vector3())
  const cameraLocked = useRef(false)

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
    // Smooth scrolling
    scrollCurrent.current +=
      (scrollTarget.current - scrollCurrent.current) * 0.05

    const scroll = scrollCurrent.current

    // 0 → 1 : orbit
    const orbitProgress = THREE.MathUtils.clamp(scroll, 0, 1)

    // > 1 : fly away
    const flyProgress = Math.max(0, scroll - 1)

    const radius = 12
    const cameraHeight = 8

    // Camera orbits around origin
    const orbitAngle = THREE.MathUtils.lerp(
      Math.PI * 0.65,
      0,
      orbitProgress
    )

    if (!cameraLocked.current) {
      camera.position.set(
        Math.cos(orbitAngle) * radius,
        cameraHeight,
        Math.sin(orbitAngle) * radius
      )

      camera.lookAt(0, 0, 0)

      // Lock the camera once orbit finishes
      if (orbitProgress >= 0.999) {
        lockedCameraPosition.current.copy(camera.position)
        cameraLocked.current = true
      }
    } else {
      // Freeze camera forever
      camera.position.copy(lockedCameraPosition.current)
    }

    // -----------------------------
    // Ship movement
    // -----------------------------

    if (spaceshipRef.current) {
      if (!cameraLocked.current) {
        // Stay at origin while camera orbits
        spaceshipRef.current.position.set(0, 0, 0)
      } else {
        // IMPORTANT:
        // Your model is rotated -90° around Y in Spaceship.jsx,
        // so its nose points along -X.
        spaceshipRef.current.position.set(
          -flyProgress * 30,
          0,
          0
        )
      }

      // Keep transform fixed
      spaceshipRef.current.rotation.set(0, 0, 0)
      spaceshipRef.current.scale.set(1, 1, 1)
    }

    // Keep looking at current ship position
    if (spaceshipRef.current) {
      camera.lookAt(spaceshipRef.current.position)
    }

    // Generate env map once
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
        position={[-250, 0, 0]}
        scrollProgress={scrollCurrent.current}
      />
    </>
  )
}
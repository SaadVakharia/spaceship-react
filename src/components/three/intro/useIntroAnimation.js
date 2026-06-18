import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { INTRO_END, PLANETS_START } from '../../../config/scroll'

export function useIntroAnimation(scrollProgress, spaceshipRef, introGroupRef) {
  const { camera } = useThree()
  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)

  useEffect(() => {
    scrollTarget.current = scrollProgress
  }, [scrollProgress])

  useFrame(() => {
    scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.05
    const scroll = scrollCurrent.current

    const introOpacity = scroll < INTRO_END
      ? 1
      : Math.max(0, 1 - (scroll - INTRO_END) / (PLANETS_START - INTRO_END))

    if (introGroupRef.current) {
      introGroupRef.current.visible = introOpacity > 0.01
    }

    if (scroll >= PLANETS_START - 0.3) return

    const isMobile = window.innerWidth < 768
    const radius = isMobile ? 24 : 12
    const cameraHeight = isMobile ? 16 : 8

    const orbitProgress = THREE.MathUtils.clamp(scroll, 0, 1)
    const orbitAngle = THREE.MathUtils.lerp(Math.PI * 0.65, 0, orbitProgress)

    if (scroll < 1) {
      camera.position.set(
        Math.cos(orbitAngle) * radius,
        cameraHeight,
        Math.sin(orbitAngle) * radius
      )
    } else if (scroll < PLANETS_START) {
      camera.position.set(radius, cameraHeight, 0)

      const shakeStrength = THREE.MathUtils.smoothstep(Math.max(0, scroll - 1), 1, 3) * 0.05
      camera.position.x += (Math.random() - 0.5) * shakeStrength
      camera.position.y += (Math.random() - 0.5) * shakeStrength
      camera.position.z += (Math.random() - 0.5) * shakeStrength
    }

    const time = performance.now() * 0.001

    if (spaceshipRef.current) {
      const flyProgress = Math.max(0, scroll - 1)
      const shipX = scroll < 1 ? 0 : -flyProgress * 30
      const bobY = Math.sin(time) * 0.05
      const swayZ = Math.cos(time * 2) * 0.05
      const turbulence = flyProgress > 1.2 ? (Math.random() - 0.5) * 0.02 : 0

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
}

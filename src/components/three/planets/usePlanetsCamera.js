import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EXPERIENCES } from '../../../config/experiences'
import { PLANETS_START } from '../../../config/scroll'
import { getActivePlanetIndex } from '../../../lib/scroll/planet'
import { Planet } from './Planet'
import { Stars } from '../environment/Stars'

const CAMERA_OFFSET = new THREE.Vector3(0, 1.2, 9)
const BLEND_START = 0.72

export function usePlanetsCamera(scrollProgress, visible, groupRef) {
  const { camera } = useThree()
  const scrollCurrent = useRef(0)

  useFrame(() => {
    scrollCurrent.current += (scrollProgress - scrollCurrent.current) * 0.06
    const scroll = scrollCurrent.current

    if (!visible || scroll < PLANETS_START - 0.2) return

    const planetScroll = THREE.MathUtils.clamp(scroll - PLANETS_START, 0, EXPERIENCES.length)
    const activeIndex = getActivePlanetIndex(scroll)
    const localT = planetScroll - activeIndex

    const current = EXPERIENCES[activeIndex]
    const next = EXPERIENCES[Math.min(activeIndex + 1, EXPERIENCES.length - 1)]
    const blend = localT > BLEND_START ? (localT - BLEND_START) / (1 - BLEND_START) : 0

    const planetPos = new THREE.Vector3(...current.position)
      .lerp(new THREE.Vector3(...next.position), blend)

    const desiredCamera = planetPos.clone().add(CAMERA_OFFSET)

    camera.position.lerp(desiredCamera, 0.08)
    camera.lookAt(planetPos)

    if (groupRef.current) {
      const fadeIn = THREE.MathUtils.smoothstep(scroll - PLANETS_START, 0, 0.4)
      groupRef.current.visible = fadeIn > 0.01
    }
  })
}

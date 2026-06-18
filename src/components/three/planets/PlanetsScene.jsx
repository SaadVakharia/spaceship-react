import { useRef } from 'react'
import { EXPERIENCES } from '../../../config/experiences'
import { PLANETS_START } from '../../../config/scroll'
import { getActivePlanetIndex } from '../../../lib/scroll/planet'
import { Planet } from './Planet'
import { Stars } from '../environment/Stars'
import { usePlanetsCamera } from './usePlanetsCamera'

const BLEND_START = 0.72

export function PlanetsScene({ scrollProgress = 0, visible = false }) {
  const groupRef = useRef()

  usePlanetsCamera(scrollProgress, visible, groupRef)

  const planetScroll = Math.max(0, scrollProgress - PLANETS_START)
  const activeIndex = getActivePlanetIndex(scrollProgress)
  const localT = planetScroll - activeIndex

  if (!visible) return null

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <directionalLight intensity={0.6} position={[4, 6, 8]} />

      {EXPERIENCES.map((experience, index) => {
        const isActive = index === activeIndex
        const isNext = index === activeIndex + 1
        const transition = isActive
          ? localT
          : isNext && localT > BLEND_START
            ? (localT - BLEND_START) / (1 - BLEND_START)
            : 0

        return (
          <group key={experience.id} position={experience.position}>
            <Planet
              color={experience.color}
              glow={experience.glow}
              ring={experience.ring}
              active={isActive || isNext}
              transition={isActive ? Math.min(localT, 0.5) : transition}
            />
          </group>
        )
      })}

      <Stars />
    </group>
  )
}

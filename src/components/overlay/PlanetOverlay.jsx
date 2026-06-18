import {
  getPlanetOverlayOpacity,
  getPlanetSegment,
  shouldShowPlanetOverlay,
} from '../../lib/scroll/planet'
import { EXPERIENCES } from '../../config/experiences'
import { ExperienceProgress } from './ExperienceProgress'
import '../../styles/overlays.css'

export function PlanetOverlay({ scrollProgress }) {
  if (!shouldShowPlanetOverlay(scrollProgress)) return null

  const { activeIndex, localT, experience, isLast } = getPlanetSegment(scrollProgress)
  const opacity = getPlanetOverlayOpacity(scrollProgress, localT, isLast)

  return (
    <div className="planet-overlay">
      <div
        className="planet-overlay__content"
        style={{
          opacity,
          transform: `translateY(${(1 - opacity) * 24}px)`,
        }}
      >
        <p className="planet-overlay__label">
          Experience {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(EXPERIENCES.length).padStart(2, '0')}
        </p>

        <h2 className="planet-overlay__title">{experience.title}</h2>
        <p className="planet-overlay__subtitle">{experience.subtitle}</p>
      </div>

      <ExperienceProgress activeIndex={activeIndex} />
    </div>
  )
}

import { EXPERIENCES } from '../../config/experiences'
import { PLANETS_START } from '../../config/scroll'

export function getPlanetScroll(scrollProgress) {
  return Math.max(0, scrollProgress - PLANETS_START)
}

export function getActivePlanetIndex(scrollProgress) {
  const planetScroll = getPlanetScroll(scrollProgress)
  return Math.min(EXPERIENCES.length - 1, Math.floor(planetScroll))
}

export function getPlanetSegment(scrollProgress) {
  const planetScroll = getPlanetScroll(scrollProgress)
  const activeIndex = getActivePlanetIndex(scrollProgress)
  const localT = planetScroll - activeIndex

  return {
    planetScroll,
    activeIndex,
    localT,
    experience: EXPERIENCES[activeIndex],
    isLast: activeIndex === EXPERIENCES.length - 1,
  }
}

export function getSegmentOpacity(localT, isLast) {
  if (localT < 0.12) return localT / 0.12
  if (!isLast && localT > 0.82) return Math.max(0, (1 - localT) / 0.18)
  return 1
}

export function getPlanetOverlayOpacity(scrollProgress, localT, isLast) {
  const segmentOpacity = getSegmentOpacity(localT, isLast)
  const fadeIn = Math.min(1, (scrollProgress - PLANETS_START + 0.1) / 0.35)
  return segmentOpacity * fadeIn
}

export function shouldShowPlanetOverlay(scrollProgress) {
  return scrollProgress >= PLANETS_START - 0.1
}

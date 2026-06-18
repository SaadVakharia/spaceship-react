import { BLACK_OVERLAY, HERO, PLANETS_START, SCROLL_HINT } from '../../config/scroll'

export function getBlackOverlayOpacity(scroll) {
  if (scroll < BLACK_OVERLAY.fadeInStart) return 0

  if (scroll < PLANETS_START) {
    return Math.min(1, (scroll - BLACK_OVERLAY.fadeInStart) / BLACK_OVERLAY.fadeInDuration)
  }

  return Math.max(0, 1 - (scroll - PLANETS_START) / BLACK_OVERLAY.fadeOutDuration)
}

export function shouldShowScrollHint(scroll) {
  return scroll < SCROLL_HINT.hideAfter
}

export function shouldShowHero(scroll) {
  return scroll < HERO.hideAfter
}

export function getHeroOpacity(scroll) {
  return Math.max(0, 1 - scroll / HERO.fadeDuration)
}

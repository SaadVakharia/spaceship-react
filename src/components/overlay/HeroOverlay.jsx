import { HERO_COPY } from '../../config/brand'
import '../../styles/layout.css'

export function HeroOverlay({ opacity }) {
  return (
    <div className="hero-overlay" style={{ opacity }}>
      <h1 className="hero-overlay__title">{HERO_COPY.title}</h1>
      <p className="hero-overlay__subtitle">{HERO_COPY.subtitle}</p>
    </div>
  )
}

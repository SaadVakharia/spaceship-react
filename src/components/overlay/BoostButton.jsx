import { Rocket } from 'lucide-react'
import { PLANETS_START } from '../../config/scroll'
import '../../styles/boost-button.css'

export function BoostButton({ scrollProgress, scrollTo }) {
  // Fade out as it enters the 2D zone (completely hidden by 3.2)
  const opacity = scrollProgress >= 3.2 ? 0 : 1 - (scrollProgress / 3.2)

  if (opacity <= 0.001) return null

  return (
    <button
      className="boost-button"
      style={{ opacity, pointerEvents: opacity < 0.5 ? 'none' : 'auto' }}
      onClick={() => scrollTo(PLANETS_START)}
      title="Skip to 2D section"
    >
      <div className="boost-button__icon">
        <Rocket size={18} strokeWidth={1.5} />
      </div>
      <span className="boost-button__label">BOOST</span>
      <div className="boost-button__glow" />
    </button>
  )
}

import { PLANETS_START, CONTACT_AT } from '../../config/scroll'
import '../../styles/scrollbar.css'

export function Scrollbar({ scrollProgress }) {
  // Fade in as we enter the 2D zone (starts fading in at 3.2, fully visible at 3.5)
  const opacity = scrollProgress < 3.2 ? 0 : scrollProgress < 3.5 ? (scrollProgress - 3.2) / 0.3 : 1
  
  // Calculate progress ratio exactly to the Contact section (8.5)
  const total2DScroll = CONTACT_AT - PLANETS_START
  let progressRatio = (scrollProgress - PLANETS_START) / total2DScroll
  
  // Clamp between 0 and 1
  progressRatio = Math.max(0, Math.min(1, progressRatio))

  if (opacity <= 0.001) return null

  // Use a fixed thumb height (25% of track)
  const thumbHeight = 25
  // Max translation is 300% of the thumb's own height (since 25% * 4 = 100% of track)
  const translateY = progressRatio * 300

  return (
    <div className="custom-scrollbar" style={{ opacity }}>
      <div className="custom-scrollbar__track">
        <div 
          className="custom-scrollbar__thumb" 
          style={{ 
            height: `${thumbHeight}%`,
            transform: `translateY(${translateY}%)`
          }}
        />
      </div>
    </div>
  )
}

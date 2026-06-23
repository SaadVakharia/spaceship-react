import { EXPERIENCES } from '../../config/experiences'
import { PLANETS_START } from '../../config/scroll'
import { ExperienceProgress } from './ExperienceProgress'
import '../../styles/overlays.css'

function Planet2D({ id, color, glow }) {
  const textureUrl = `/textures/${id}_planet.png`

  if (id === 'driving') {
    return (
      <div className="planet-sphere-container">
        <div className="planet-atmosphere" style={{ '--glow-color': glow }} />
        
        {/* Back Ring: clipped to show top half behind planet */}
        <div className="planet-ring planet-ring--back" style={{ '--ring-color': glow }} />
        
        <div className="planet-sphere">
          <div 
            className="planet-texture" 
            style={{ backgroundImage: `url(${textureUrl})` }} 
          />
          <div className="planet-shading" />
          <div className="planet-highlight" />
        </div>
        
        {/* Front Ring: clipped to show bottom half in front of planet */}
        <div className="planet-ring planet-ring--front" style={{ '--ring-color': glow }} />
      </div>
    )
  }

  return (
    <div className="planet-sphere-container">
      <div className="planet-atmosphere" style={{ '--glow-color': glow }} />
      <div className="planet-sphere">
        <div 
          className="planet-texture" 
          style={{ backgroundImage: `url(${textureUrl})` }} 
        />
        <div className="planet-shading" />
        <div className="planet-highlight" />
      </div>
    </div>
  )
}

export function PlanetOverlay({ scrollProgress }) {
  const visible = scrollProgress >= PLANETS_START - 0.2

  if (!visible) return null

  // Calculate active index of actual planets (which start at 4.5)
  const planetScrollProgress = Math.max(0, scrollProgress - 4.5)
  const activePlanetIndex = Math.min(EXPERIENCES.length - 1, Math.floor(planetScrollProgress))

  // Branding Offset calculations
  const brandingOffset = scrollProgress - 3.5
  const brandingTranslateY = -brandingOffset * 100
  const brandingOpacity = Math.max(0, 1 - Math.abs(brandingOffset) * 1.2)
  const brandingScale = 1 - Math.min(0.5, Math.abs(brandingOffset) * 0.5)

  return (
    <div className="planet-overlay-2d">
      
      {/* Branding Section */}
      {brandingOpacity > 0.001 && (
        <div
          className="planet-section planet-section--branding"
        >
          <div 
            className="planet-section__visual"
            style={{ 
              transform: `scale(${brandingScale})`,
              opacity: brandingOpacity,
            }}
          >
            <div className="branding-portal-container">
              <div className="branding-portal-glow" />
              <div className="branding-portal">
                <svg className="portal-svg" viewBox="0 0 100 100">
                  <polygon points="50,18 78,74 22,74" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
                  <polygon points="50,30 68,69 32,69" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinejoin="round" strokeDasharray="3 3" />
                  <circle cx="50" cy="54" r="11" fill="none" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="planet-section__content"
            style={{
              transform: `translateY(${brandingTranslateY}vh)`,
              opacity: brandingOpacity,
            }}
          >
            <span className="planet-section__label">Welcome to</span>
            <h1 className="branding-title">ESCAPE GAMING</h1>
            <p className="branding-subtitle">THE BEST GAMING ZONE IN BANDRA</p>
            <p className="branding-description">
              Step in to the world of extreme gaming at Escape Gaming Zone in Bandra, home to the best PS5 gaming and VR lounges in Mumbai. For both casual and serious gamers, we’ve got what it takes to elevate your play. Scroll down to explore our sectors.
            </p>
          </div>
        </div>
      )}

      {/* Planet Sections */}
      {EXPERIENCES.map((experience, index) => {
        const offset = scrollProgress - (4.5 + index)
        const translateY = -offset * 100
        const opacity = Math.max(0, 1 - Math.abs(offset) * 1.2)
        const scale = 1 - Math.min(0.5, Math.abs(offset) * 0.5)

        if (opacity <= 0.001) return null

        const isEven = index % 2 === 0
        const layoutClass = isEven ? 'planet-section--left' : 'planet-section--right'

        return (
          <div
            key={experience.id}
            className={`planet-section ${layoutClass}`}
          >
            <div 
              className="planet-section__visual"
              style={{ 
                transform: `scale(${scale})`,
                opacity, // fades in place
              }}
            >
              <Planet2D
                id={experience.id}
                color={experience.color}
                glow={experience.glow}
              />
            </div>

            <div 
              className="planet-section__content"
              style={{
                transform: `translateY(${translateY}vh)`, // translates vertically
                opacity,
              }}
            >
              <span className="planet-section__label">
                Experience {String(index + 1).padStart(2, '0')} /{' '}
                {String(EXPERIENCES.length).padStart(2, '0')}
              </span>
              <h2 className="planet-section__title">{experience.title}</h2>
              <p className="planet-section__subtitle">{experience.subtitle}</p>
              <p className="planet-section__description">{experience.description}</p>
              
              <ul className="planet-section__features">
                {experience.features.map((feature, fIdx) => (
                  <li key={fIdx} className="planet-section__feature-item">
                    <span 
                      className="feature-dot" 
                      style={{ 
                        backgroundColor: experience.glow,
                        boxShadow: `0 0 8px ${experience.glow}` 
                      }} 
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}

      {/* Experience indicators: hide during the intro/branding screen */}
      {scrollProgress >= 4.0 && (
        <ExperienceProgress activeIndex={activePlanetIndex} />
      )}
    </div>
  )
}

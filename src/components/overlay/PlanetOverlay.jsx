import { EXPERIENCES } from '../../config/experiences'
import { PLANETS_START } from '../../config/scroll'
import '../../styles/overlays.css'

function Planet2D({ id }) {
  const textureUrl = `/textures/${id}_planet.png`

  return (
    <div className="planet-sphere-container">
      <div className="planet-sphere">
        <div
          className="planet-texture"
          style={{ backgroundImage: `url(${textureUrl})` }}
        />
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
  // Use a slow fade-in (0.7) but a fast fade-out (1.5) so it doesn't bleed into Experience 1
  const brandingOpacityMultiplier = brandingOffset < 0 ? 0.7 : 1.5
  const brandingOpacity = Math.max(0, 1 - Math.abs(brandingOffset) * brandingOpacityMultiplier)
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
              <div className="branding-logo-wrapper">
                <img src="/logo.png" alt="Escape Gaming Logo" className="branding-logo" />
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
              Step in to the world of extreme gaming at Escape Gaming Zone in Bandra, home to the best PS5 gaming and VR lounges in Mumbai. For both casual and serious gamers, we’ve got what it takes to elevate your play.
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
        
        // Add dynamic rotation so the planet revolves into place
        const rotate = offset * -60
        
        // Add horizontal swing so it flies in from the side
        const translateX = offset * 25 // 25vw side-to-side movement
        
        // Add a cinematic depth-of-field blur effect
        const blur = Math.abs(offset) * 15

        if (opacity <= 0.001) return null

        const layoutClass = index % 2 === 0 ? 'planet-section--right' : 'planet-section--left'

        return (
          <div
            key={experience.id}
            className={`planet-section ${layoutClass}`}
          >
            <div
              className="planet-section__visual"
              style={{
                transform: `translateX(${translateX}vw) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                filter: `blur(${blur}px)`,
              }}
            >
              <Planet2D id={experience.id} />
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

    </div>
  )
}

import { EXPERIENCES } from '../../config/experiences'
import { PLANETS_START } from '../../config/scroll'
import { SEO_CONTENT } from '../../config/seoContent'
import '../../styles/overlays.css'

function Planet2D({ id }) {
  const textureUrl = `/textures/${id}_planet.webp`

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

  // ── Branding (2 sections: 3.5 → 4.5) ──
  const brandingStayStart = 3.5
  const brandingStayEnd = 4.5
  let brandingOffset
  if (scrollProgress < brandingStayStart) {
    brandingOffset = scrollProgress - brandingStayStart
  } else if (scrollProgress > brandingStayEnd) {
    brandingOffset = scrollProgress - brandingStayEnd
  } else {
    brandingOffset = 0
  }
  const brandingTranslateY = -brandingOffset * 100
  const brandingOpacityMultiplier = brandingOffset < 0 ? 0.7 : 1.5
  const brandingOpacity = Math.max(0, 1 - Math.abs(brandingOffset) * brandingOpacityMultiplier)
  const brandingScale = 1 - Math.min(0.5, Math.abs(brandingOffset) * 0.5)

  // Calculate active pagination section for branding (0 or 1)
  const brandActiveSection = Math.max(0, Math.min(1, Math.round(scrollProgress - 3.5)))

  // Branding body cross-fade
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const brand1Offset = scrollProgress - 3.5
  const brand1Opacity = isMobile
    ? (brandActiveSection === 0 ? 1 : 0)
    : Math.max(0, 1 - Math.abs(brand1Offset) * 1.5)
  const brand2Offset = scrollProgress - 4.5
  const brand2Opacity = isMobile
    ? (brandActiveSection === 1 ? 1 : 0)
    : Math.max(0, 1 - Math.abs(brand2Offset) * 1.5)

  return (
    <div className="planet-overlay-2d">

      {/* ═══ Branding Section ═══ */}
      {brandingOpacity > 0.001 && (
        <div className="planet-section planet-section--branding">
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

          <div className="planet-section__content-stack" style={{ opacity: brandingOpacity }}>
            <div className="planet-section__content planet-section__content--static">
              <span className="planet-section__label">Welcome to</span>
              <h1 className="branding-title">ESCAPE GAMING</h1>
              <p className="branding-subtitle">THE BEST GAMING ZONE IN BANDRA</p>
              <div className="planet-section__pagination">
                {[0, 1].map(i => (
                  <div key={i} className={`pagination-line ${i === brandActiveSection ? 'active' : ''}`} />
                ))}
              </div>
            </div>

            <div className="planet-section__body-stack">
              <div
                className="planet-section__body"
                style={{ opacity: brand1Opacity, pointerEvents: brand1Opacity > 0.5 ? 'auto' : 'none' }}
              >
                <p className="branding-description">
                  {SEO_CONTENT.about.intro}
                </p>
              </div>
              <div
                className="planet-section__body"
                style={{ opacity: brand2Opacity, pointerEvents: brand2Opacity > 0.5 ? 'auto' : 'none' }}
              >
                <ul className="planet-section__features">
                  {SEO_CONTENT.about.whyChooseUs.map((feature, idx) => (
                    <li key={idx} className="planet-section__feature-item">
                      <span className="feature-dot" style={{ backgroundColor: '#fff', boxShadow: '0 0 8px #fff' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Planet Sections (3 sections each) ═══ */}
      {EXPERIENCES.map((experience, index) => {
        // Each planet gets 3 scroll units
        const baseScroll = 5.5 + index * 3
        const stayEnd = baseScroll + 2

        // Dead-zone clamp: planet locked during all 3 sections
        let offset
        if (scrollProgress < baseScroll) {
          offset = scrollProgress - baseScroll
        } else if (scrollProgress > stayEnd) {
          offset = scrollProgress - stayEnd
        } else {
          offset = 0
        }

        // Original animation formulas
        const translateX = offset * 25
        const opacity = Math.max(0, 1 - Math.abs(offset) * 1.2)
        const scale = 1 - Math.min(0.5, Math.abs(offset) * 0.5)
        const rotate = offset * -60
        const blur = Math.abs(offset) * 15

        if (opacity <= 0.001) return null

        const layoutClass = index % 2 === 0 ? 'planet-section--right' : 'planet-section--left'
        const isRight = layoutClass === 'planet-section--right'
        const seoData = SEO_CONTENT.planets[experience.id]

        // Calculate active pagination section for planet (0, 1, or 2)
        const activeSection = Math.max(0, Math.min(2, Math.round(scrollProgress - baseScroll)))

        // 3 body cross-fades
        const sec1Offset = scrollProgress - baseScroll
        const sec1Opacity = isMobile
          ? (activeSection === 0 ? 1 : 0)
          : Math.max(0, 1 - Math.abs(sec1Offset) * 1.5)

        const sec2Offset = scrollProgress - (baseScroll + 1)
        const sec2Opacity = isMobile
          ? (activeSection === 1 ? 1 : 0)
          : Math.max(0, 1 - Math.abs(sec2Offset) * 1.5)

        const sec3Offset = scrollProgress - (baseScroll + 2)
        const sec3Opacity = isMobile
          ? (activeSection === 2 ? 1 : 0)
          : Math.max(0, 1 - Math.abs(sec3Offset) * 1.5)

        return (
          <div key={experience.id} className={`planet-section ${layoutClass}`}>

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
              className={`planet-section__content-stack ${isRight ? 'planet-section__content-stack--right' : ''}`}
              style={{ opacity }}
            >
              {/* Static header */}
              <div className="planet-section__content planet-section__content--static">
                <span className="planet-section__label">
                  Experience {String(index + 1).padStart(2, '0')} /{' '}
                  {String(EXPERIENCES.length).padStart(2, '0')}
                </span>
                <h2 className="planet-section__title">{experience.title}</h2>
                <p className="planet-section__subtitle">{experience.subtitle}</p>
                <div className="planet-section__pagination">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`pagination-line ${i === activeSection ? 'active' : ''}`} />
                  ))}
                </div>
              </div>

              {/* 3-way swappable body */}
              <div className="planet-section__body-stack">
                {/* Body 1: SEO paragraph 1 + Features */}
                <div
                  className="planet-section__body"
                  style={{ opacity: sec1Opacity, pointerEvents: sec1Opacity > 0.5 ? 'auto' : 'none' }}
                >
                  <p className="planet-section__description">
                    {seoData.paragraphs[0]}
                  </p>
                </div>

                {/* Body 2: SEO paragraph 2 */}
                <div
                  className="planet-section__body"
                  style={{ opacity: sec2Opacity, pointerEvents: sec2Opacity > 0.5 ? 'auto' : 'none' }}
                >
                  <p className="planet-section__description">
                    {seoData.paragraphs[1]}
                  </p>
                </div>

                {/* Body 3: SEO paragraph 3 */}
                <div
                  className="planet-section__body"
                  style={{ opacity: sec3Opacity, pointerEvents: sec3Opacity > 0.5 ? 'auto' : 'none' }}
                >
                  {seoData.paragraphs[2] && (
                    <p className="planet-section__description">
                      {seoData.paragraphs[2]}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )
      })}

    </div>
  )
}

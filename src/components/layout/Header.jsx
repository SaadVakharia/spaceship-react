import { useState } from 'react'
import { SITE_NAME } from '../../config/brand'
import { PLANETS_START } from '../../config/scroll'
import '../../styles/layout.css'

// Each nav item maps to a snap-point in the scroll system
const NAV_ITEMS = [
  { label: 'PS5',      scrollTarget: 4.5 },
  { label: 'Driving',  scrollTarget: 5.5 },
  { label: 'VR',       scrollTarget: 6.5 },
  { label: 'PC',       scrollTarget: 7.5 },
  { label: 'Contact',  scrollTarget: 8.5 },
]

export function Header({ scrollProgress, scrollTo }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (target) => {
    scrollTo(target)
    setMenuOpen(false)
  }

  // Determine the active nav item based on current scroll position
  const activeTarget = NAV_ITEMS.reduce((found, item) => {
    if (scrollProgress >= item.scrollTarget - 0.5) return item.scrollTarget
    return found
  }, null)

  const inNav = scrollProgress >= PLANETS_START

  return (
    <header className="site-header">
      {/* Brand */}
      <button
        className="site-header__brand"
        onClick={() => scrollTo(0)}
        aria-label="Go to top"
      >
        <img src="/logo.png" alt={SITE_NAME} className="site-header__logo" />
      </button>

      {/* Desktop nav — only in 2D zone */}
      {inNav && (
        <nav className="site-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`site-nav__link${activeTarget === item.scrollTarget ? ' site-nav__link--active' : ''}`}
              onClick={() => handleNav(item.scrollTarget)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Mobile hamburger — only in 2D zone */}
      {inNav && (
        <button
          className={`site-nav__hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="site-nav__drawer" role="dialog" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`site-nav__drawer-link${activeTarget === item.scrollTarget ? ' site-nav__link--active' : ''}`}
              onClick={() => handleNav(item.scrollTarget)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

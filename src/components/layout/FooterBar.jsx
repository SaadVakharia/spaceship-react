import { PLANETS_START } from '../../config/scroll'
import '../../styles/footer.css'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/escape.gaming.co/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919167862341',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    label: 'Google Maps',
    href: 'https://maps.app.goo.gl/wcyzCkLW1Fjf8gE6A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

export function FooterBar({ scrollProgress }) {
  const visible = scrollProgress >= PLANETS_START

  return (
    <footer
      className="site-footer"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Left — copyright */}
      <span className="site-footer__copy">
        © {new Date().getFullYear()} Escape Gaming · Bandra, Mumbai
      </span>

      {/* Center — tagline */}
      <span className="site-footer__tagline">
        BANDRA'S PREMIER GAMING ZONE
      </span>

      {/* Right — socials */}
      <div className="site-footer__socials">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__social-link"
            aria-label={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </footer>
  )
}

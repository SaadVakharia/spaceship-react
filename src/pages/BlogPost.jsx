import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWPPostBySlug } from '../services/wpService'
import { SEOHead } from '../components/seo/SEOHead'
import { Starfield } from '../components/overlay/Starfield'
import { SOCIALS } from '../components/layout/FooterBar'
import { SITE_NAME } from '../config/brand'
import '../styles/blog.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    async function load() {
      const res = await fetchWPPostBySlug(slug)
      if (!isMounted) return
      if (res.error || !res.post) {
        setError(res.error || 'Post not found')
      } else {
        setPost(res.post)
      }
      setLoading(false)
    }

    load()
    return () => { isMounted = false }
  }, [slug])

  if (loading) {
    return (
      <div className="blog-page-container">
        <Starfield scrollProgress={5.0} />
        <header className="blog-header-bar">
          <Link to="/" className="blog-header-brand" aria-label="Go to home">
            <img src="/logo.png" alt={SITE_NAME} className="blog-header-logo" />
          </Link>
          <Link to="/blog" className="blog-header-nav-link">
            <span>←</span>
            <span>ALL TRANSMISSIONS</span>
          </Link>
        </header>

        <div className="blog-loading-container" style={{ minHeight: '60vh' }}>
          <div className="blog-loading-spinner" />
          <span>DECODING TRANSMISSION...</span>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-page-container">
        <Starfield scrollProgress={5.0} />
        <header className="blog-header-bar">
          <Link to="/" className="blog-header-brand" aria-label="Go to home">
            <img src="/logo.png" alt={SITE_NAME} className="blog-header-logo" />
          </Link>
          <Link to="/blog" className="blog-header-nav-link">
            <span>←</span>
            <span>ALL TRANSMISSIONS</span>
          </Link>
        </header>

        <div style={{ textAlign: 'center', padding: '8rem 1.5rem', margin: 'auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Transmission Not Found
          </h2>
          <p style={{ marginTop: '0.75rem', color: 'var(--color-muted)' }}>{error}</p>
          <Link to="/blog" className="blog-booking-cta-btn" style={{ display: 'inline-block', marginTop: '2rem' }}>
            ← BACK TO BLOG
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page-container">
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonicalUrl={`/blog/${post.slug}`}
        ogImage={post.featuredImage || '/logo.png'}
        ogType="article"
      />

      {/* Cosmic background starfield */}
      <Starfield scrollProgress={5.0} />

      {/* Fixed Site Header */}
      <header className="blog-header-bar">
        <Link to="/" className="blog-header-brand" aria-label="Go to home">
          <img src="/logo.png" alt={SITE_NAME} className="blog-header-logo" />
        </Link>
        <Link to="/blog" className="blog-header-nav-link">
          <span>←</span>
          <span>ALL TRANSMISSIONS</span>
        </Link>
      </header>

      {/* Article Body */}
      <article className="blog-article-container">
        <header className="blog-article-header">
          <span className="blog-eyebrow">TRANSMISSION // {post.date}</span>
          <h1 className="blog-article-title">{post.title}</h1>
        </header>

        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="blog-article-cover"
            decoding="async"
            fetchPriority="high"
          />
        )}

        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Booking CTA Callout */}
        <div className="blog-booking-callout">
          <h3>Ready to Play at Escape Gaming Zone?</h3>
          <p>
            Experience 4K PS5 gaming, 240Hz RTX esports battle stations, and immersive VR racing simulation in Bandra West, Mumbai.
          </p>
          <a
            href="https://wa.me/919167862341?text=Hi%20Escape%20Gaming%20Zone,%20I'd%20like%20to%20book%20a%20gaming%20session!"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-booking-cta-btn"
          >
            <span>BOOK SESSION ON WHATSAPP</span>
            <span>→</span>
          </a>
        </div>
      </article>

      {/* Identical Seamless Footer */}
      <footer className="blog-footer-bar">
        <span className="blog-footer-copy">
          © {new Date().getFullYear()} Escape Gaming · Bandra, Mumbai
        </span>

        <span className="blog-footer-tagline">
          BANDRA'S PREMIER GAMING ZONE
        </span>

        <div className="blog-footer-socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-footer-social-link"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

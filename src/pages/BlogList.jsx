import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWPPosts } from '../services/wpService'
import { SEOHead } from '../components/seo/SEOHead'
import { Starfield } from '../components/overlay/Starfield'
import { SOCIALS } from '../components/layout/FooterBar'
import { SITE_NAME } from '../config/brand'
import '../styles/blog.css'

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetchWPPosts()
      if (res.error && (!res.posts || res.posts.length === 0)) {
        setError(res.error)
      } else {
        setPosts(res.posts || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="blog-page-container">
      <SEOHead
        title="Blog | Escape Gaming Zone Bandra"
        description="Read the latest news, gaming tournaments, and updates from Escape Gaming Zone in Bandra, Mumbai."
        canonicalUrl="/blog"
      />

      {/* Cosmic background starfield identical to main site */}
      <Starfield scrollProgress={5.0} />

      {/* Fixed Site Header */}
      <header className="blog-header-bar">
        <Link to="/" className="blog-header-brand" aria-label="Go to home">
          <img src="/logo.png" alt={SITE_NAME} className="blog-header-logo" />
        </Link>
        <Link to="/" className="blog-header-nav-link">
          <span>←</span>
          <span>BACK TO EXPERIENCE</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="blog-content-wrapper">
        <section className="blog-hero-section">
          <span className="blog-eyebrow">TRANSMISSIONS</span>
          <h1 className="blog-hero-title">BLOG</h1>
          <p className="blog-hero-subtext">
            Latest tournament news, community highlights, and stories from Escape Gaming Zone in Bandra West.
          </p>
        </section>

        {loading ? (
          <div className="blog-loading-container">
            <div className="blog-loading-spinner" />
            <span>CONNECTING TO SATELLITE FEED...</span>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#f87171' }}>
            <p>Could not load blogs ({error})</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-muted)' }}>
            <p>No transmissions published yet.</p>
          </div>
        ) : (
          <div className="blog-cards-grid">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card-item">
                {post.featuredImage && (
                  <div className="blog-card-thumbnail">
                    <img src={post.featuredImage} alt={post.title} loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="blog-card-details">
                  <div className="blog-card-meta">{post.date}</div>
                  <h2 className="blog-card-heading">{post.title}</h2>
                  {post.excerpt && <p className="blog-card-snippet">{post.excerpt}</p>}
                  <span className="blog-card-action">
                    READ MORE <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

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

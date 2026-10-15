import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchWPPosts } from '../services/wpService'
import { SEOHead } from '../components/seo/SEOHead'
import { Starfield } from '../components/overlay/Starfield'
import { SOCIALS } from '../components/layout/FooterBar'
import { SITE_NAME } from '../config/brand'
import '../styles/blog.css'

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  const queryParam = searchParams.get('s') || ''

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

  // Filter posts based on category or search query
  const filteredPosts = useMemo(() => {
    let result = posts
    if (categoryParam) {
      result = result.filter((p) =>
        p.categories?.some(
          (c) =>
            c.slug.toLowerCase() === categoryParam.toLowerCase() ||
            c.name.toLowerCase() === categoryParam.toLowerCase()
        )
      )
    }
    if (queryParam) {
      const q = queryParam.toLowerCase()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
      )
    }
    return result
  }, [posts, categoryParam, queryParam])

  const hasFilter = Boolean(categoryParam || queryParam)
  const clearFilters = () => setSearchParams({})

  return (
    <div className="blog-page-container">
      <SEOHead
        title={
          categoryParam
            ? `Category: ${categoryParam.toUpperCase()} | Escape Gaming Zone`
            : queryParam
            ? `Search: ${queryParam} | Escape Gaming Zone`
            : "Blog | Escape Gaming Zone Bandra"
        }
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

          {hasFilter && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                Filter active: <strong style={{ color: '#fff' }}>{categoryParam ? `Category "${categoryParam}"` : `Search "${queryParam}"`}</strong>
              </span>
              <button
                onClick={clearFilters}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.05em'
                }}
              >
                CLEAR FILTER ✕
              </button>
            </div>
          )}
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
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-muted)' }}>
            <p>{hasFilter ? 'No transmissions found matching this criteria.' : 'No transmissions published yet.'}</p>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="blog-booking-cta-btn"
                style={{ display: 'inline-block', marginTop: '1.5rem' }}
              >
                VIEW ALL TRANSMISSIONS
              </button>
            )}
          </div>
        ) : (
          <div className="blog-cards-grid">
            {filteredPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card-item">
                {(post.thumbnailImage || post.featuredImage) && (
                  <div className="blog-card-thumbnail">
                    <img src={post.thumbnailImage || post.featuredImage} alt={post.title} loading="lazy" decoding="async" />
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

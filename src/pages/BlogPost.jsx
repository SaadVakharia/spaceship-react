import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchWPPostBySlug } from '../services/wpService'
import { SEOHead } from '../components/seo/SEOHead'
import { Starfield } from '../components/overlay/Starfield'
import { SOCIALS } from '../components/layout/FooterBar'
import { SITE_NAME } from '../config/brand'
import '../styles/blog.css'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({
    post: null,
    prevPost: null,
    nextPost: null,
    recentPosts: [],
    allCategories: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [commentForm, setCommentForm] = useState({ author: '', email: '', comment: '' })
  const [commentSubmitted, setCommentSubmitted] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    async function load() {
      const res = await fetchWPPostBySlug(slug)
      if (!isMounted) return
      if (res.error || !res.post) {
        setError(res.error || 'Post not found')
      } else {
        setData({
          post: res.post,
          prevPost: res.prevPost,
          nextPost: res.nextPost,
          recentPosts: res.recentPosts || [],
          allCategories: res.allCategories || [],
        })
      }
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [slug])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/blog?s=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentForm.comment.trim()) return
    setCommentSubmitted(true)
  }

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

  if (error || !data.post) {
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

  const { post, prevPost, nextPost, recentPosts, allCategories } = data

  return (
    <div className="blog-page-container">
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonicalUrl={`/blog/${post.slug}`}
        ogImage={post.featuredImage || '/logo.png'}
        ogType="article"
        publishedDate={post.rawDate}
      />

      {/* Cosmic background starfield */}
      <Starfield scrollProgress={5.0} />

      {/* Fixed Site Header */}
      <header className="blog-header-bar">
        <Link to="/" className="blog-header-brand" aria-label="Go to home">
          <img src="/logo.png" alt={SITE_NAME} className="blog-header-logo" />
        </Link>
        <div className="blog-header-nav-group">
          <Link to="/blog" className="blog-header-nav-link">
            <span>←</span>
            <span>BLOG HUB</span>
          </Link>
          <Link to="/" className="blog-header-nav-link">
            <span>EXPERIENCE</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* Hero Title Banner */}
      <section className="blog-single-hero">
        <div className="blog-single-hero-inner">
          <div className="blog-breadcrumbs">
            <Link to="/">HOME</Link>
            <span>/</span>
            <Link to="/blog">BLOG</Link>
            <span>/</span>
            <span className="blog-breadcrumbs-current">{post.title}</span>
          </div>
          <h1 className="blog-single-title">{post.title}</h1>
          <div className="blog-single-meta">
            <span className="blog-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {post.date}
            </span>
            <span className="blog-meta-sep">·</span>
            <span className="blog-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              by {post.author.name}
            </span>
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="blog-meta-sep">·</span>
                <span className="blog-meta-categories">
                  {post.categories.map((c) => (
                    <Link key={c.id} to={`/blog?category=${c.slug}`} className="blog-category-badge">
                      {c.name}
                    </Link>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2-Column Main Content & Sidebar Layout */}
      <div className="blog-single-content-container">
        <div className="blog-single-layout">
          {/* Main Article Column */}
          <main className="blog-main-col">
            {/* If format is quote, display aesthetic PlayerX quote card */}
            {post.format === 'quote' && (
              <div className="blog-quote-highlight">
                <span className="blog-quote-icon">“</span>
                <p className="blog-quote-text">{post.title}</p>
                <span className="blog-quote-author">— {post.author.name}</span>
              </div>
            )}

            {/* Featured Image if not a quote-format post */}
            {post.format !== 'quote' && (post.largeImage || post.featuredImage) && (
              <div className="blog-cover-wrapper">
                <img
                  src={post.largeImage || post.featuredImage}
                  alt={post.title}
                  className="blog-article-cover"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            )}

            {/* Article Prose with Elementor & Blockquote Support */}
            <article
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* In-Article Booking CTA */}
            <div className="blog-booking-callout">
              <h3>Play This at Escape Gaming Zone</h3>
              <p>
                Experience 4K PS5 gaming lounges, force-feedback VR racing cockpit simulators, and 240Hz PC esports setups in Bandra West, Mumbai.
              </p>
              <a
                href="https://wa.me/919167862341?text=Hi%20Escape%20Gaming%20Zone,%20I%20read%20your%20blog%20and%20want%20to%20book%20a%20gaming%20session!"
                target="_blank"
                rel="noopener noreferrer"
                className="blog-booking-cta-btn"
              >
                <span>BOOK VIA WHATSAPP (+91 91678 62341)</span>
                <span>→</span>
              </a>
            </div>

            {/* Single Post Navigation (Previous / Next) */}
            <nav className="blog-single-navigation" aria-label="Post Navigation">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="blog-nav-link blog-nav-prev">
                  <span className="blog-nav-arrow">←</span>
                  <div className="blog-nav-text">
                    <span className="blog-nav-sub">PREVIOUS TRANSMISSION</span>
                    <span className="blog-nav-title">{prevPost.title}</span>
                  </div>
                </Link>
              ) : (
                <div className="blog-nav-spacer" />
              )}

              {nextPost ? (
                <Link to={`/blog/${nextPost.slug}`} className="blog-nav-link blog-nav-next">
                  <div className="blog-nav-text" style={{ textAlign: 'right' }}>
                    <span className="blog-nav-sub">NEXT TRANSMISSION</span>
                    <span className="blog-nav-title">{nextPost.title}</span>
                  </div>
                  <span className="blog-nav-arrow">→</span>
                </Link>
              ) : (
                <div className="blog-nav-spacer" />
              )}
            </nav>

            {/* Comments / Leave Reply Section */}
            <section className="blog-comments-section" id="comments">
              <h3 className="blog-comments-title">Add Comment</h3>
              {commentSubmitted ? (
                <div className="blog-comment-success">
                  <p>✓ Thank you! Your comment has been received and is awaiting moderation.</p>
                </div>
              ) : (
                <form className="blog-comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Your Comment *"
                    required
                    rows={5}
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                  />
                  <div className="blog-comment-fields-row">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={commentForm.author}
                      onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="blog-comment-submit-btn">
                    SUBMIT COMMENT
                  </button>
                </form>
              )}
            </section>
          </main>

          {/* Gaming Sidebar Column */}
          <aside className="blog-sidebar-col">
            {/* Search Widget */}
            <div className="blog-sidebar-widget">
              <h4 className="blog-widget-heading">SEARCH</h4>
              <form onSubmit={handleSearchSubmit} className="blog-sidebar-search-form">
                <input
                  type="text"
                  placeholder="Type Your Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </form>
            </div>

            {/* Categories Widget */}
            {allCategories.length > 0 && (
              <div className="blog-sidebar-widget">
                <h4 className="blog-widget-heading">CATEGORIES</h4>
                <ul className="blog-sidebar-categories-list">
                  {allCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link to={`/blog?category=${cat.slug}`}>
                        <span>{cat.name}</span>
                        <span className="blog-cat-count">({cat.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Top Articles Widget */}
            {recentPosts.length > 0 && (
              <div className="blog-sidebar-widget">
                <h4 className="blog-widget-heading">TOP ARTICLES</h4>
                <div className="blog-top-articles-list">
                  {recentPosts.map((rPost) => (
                    <Link key={rPost.id} to={`/blog/${rPost.slug}`} className="blog-top-article-item">
                      {rPost.thumbnailImage ? (
                        <img
                          src={rPost.thumbnailImage}
                          alt={rPost.title}
                          className="blog-top-article-thumb"
                          loading="lazy"
                        />
                      ) : (
                        <div className="blog-top-article-thumb-placeholder">
                          🎮
                        </div>
                      )}
                      <div className="blog-top-article-info">
                        <h5 className="blog-top-article-title">{rPost.title}</h5>
                        <span className="blog-top-article-date">{rPost.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Arena Promo Widget */}
            <div className="blog-sidebar-widget blog-widget-promo">
              <span className="blog-promo-badge">BANDRA WEST</span>
              <h4>ESCAPE GAMING ZONE</h4>
              <p>Top PS5 4K Gaming, Force-Feedback VR Racing Cockpits, and RTX Esports PCs.</p>
              <a
                href="https://wa.me/919167862341?text=Hi%20Escape%20Gaming,%20I'd%20like%20to%20book%20a%20station!"
                target="_blank"
                rel="noopener noreferrer"
                className="blog-promo-btn"
              >
                QUICK BOOKING
              </a>
            </div>
          </aside>
        </div>
      </div>

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

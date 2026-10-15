/**
 * WordPress REST API Service for Escape Gaming Zone
 * Uses the local /wp-json proxy (configured in vite.config.js and vercel.json)
 * to avoid CORS errors in both local dev and production.
 */

const API_PATH = '/wp-json/wp/v2'
const FALLBACK_HOST = 'https://old.escapegamingzone.com/wp-json/wp/v2'

async function wpFetch(endpoint) {
  try {
    // First try the relative proxy path (avoids CORS)
    const res = await fetch(`${API_PATH}${endpoint}`)
    if (res.ok) return res
  } catch (err) {
    console.warn('Proxy fetch failed, attempting direct fetch:', err)
  }
  // Fallback to direct URL if proxy is unavailable
  return fetch(`${FALLBACK_HOST}${endpoint}`)
}

export function stripHtml(html = '') {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export function formatWPPost(p) {
  if (!p) return null

  let featuredImage = null
  const media = p._embedded?.['wp:featuredmedia']
  if (media && media.length > 0 && media[0]?.source_url) {
    featuredImage = media[0].source_url
  }

  const rawDate = p.date || ''
  let displayDate = rawDate
  try {
    displayDate = new Date(rawDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    displayDate = rawDate.slice(0, 10)
  }

  const cleanTitle = stripHtml(p.title?.rendered || 'Untitled Post')
  const cleanExcerpt = stripHtml(p.excerpt?.rendered || '').slice(0, 180)

  return {
    id: p.id,
    slug: p.slug,
    title: cleanTitle,
    content: p.content?.rendered || '',
    excerpt: cleanExcerpt ? `${cleanExcerpt}...` : '',
    date: displayDate,
    rawDate,
    featuredImage,
    metaTitle: `${cleanTitle} | Escape Gaming Zone`,
    metaDescription: cleanExcerpt || cleanTitle,
  }
}

export async function fetchWPPosts() {
  try {
    const response = await wpFetch('/posts?_embed=true&per_page=100')
    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`)
    }
    const data = await response.json()
    const posts = data.map(formatWPPost).filter(Boolean)
    return { posts, error: null }
  } catch (err) {
    console.error('Error fetching WP posts:', err)
    return { posts: [], error: err.message }
  }
}

export async function fetchWPPostBySlug(slug) {
  try {
    const response = await wpFetch(`/posts?slug=${encodeURIComponent(slug)}&_embed=true`)
    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`)
    }
    const data = await response.json()
    if (!data || data.length === 0) {
      return { post: null, error: 'Post not found' }
    }
    const post = formatWPPost(data[0])
    return { post, error: null }
  } catch (err) {
    console.error(`Error fetching post with slug "${slug}":`, err)
    return { post: null, error: err.message }
  }
}

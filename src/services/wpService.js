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
  let thumbnailImage = null
  let largeImage = null

  const media = p._embedded?.['wp:featuredmedia']
  if (media && media.length > 0) {
    const item = media[0]
    const sizes = item.media_details?.sizes || {}

    // Lightweight size for card grids (medium_large ~768px or medium ~300px)
    thumbnailImage = sizes.medium_large?.source_url || sizes.medium?.source_url || sizes.large?.source_url || item.source_url || null

    // Optimized size for full article header (large ~1024px, avoids huge raw camera uploads)
    largeImage = sizes.large?.source_url || sizes.medium_large?.source_url || item.source_url || null

    featuredImage = largeImage || item.source_url || null
  }

  // Extract author info (sanitize email usernames to clean brand name)
  const authorData = p._embedded?.author?.[0]
  const rawAuthorName = authorData?.name || 'Escape Gaming Zone'
  const cleanAuthorName = rawAuthorName.includes('@') ? 'Escape Gaming Zone' : rawAuthorName
  const author = {
    name: cleanAuthorName,
    avatar: authorData?.avatar_urls?.['96'] || authorData?.avatar_urls?.['48'] || null,
    description: authorData?.description || 'Gaming strategist & staff writer at Escape Gaming Zone Bandra.',
  }

  // Extract categories
  const termCats = p._embedded?.['wp:term']?.[0] || []
  const categories = termCats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

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
    format: p.format || 'standard',
    author,
    categories,
    featuredImage,
    thumbnailImage: thumbnailImage || featuredImage,
    largeImage: largeImage || featuredImage,
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

    // Aggregate unique categories
    const catMap = new Map()
    posts.forEach((p) => {
      (p.categories || []).forEach((c) => {
        catMap.set(c.slug, {
          name: c.name,
          slug: c.slug,
          count: (catMap.get(c.slug)?.count || 0) + 1,
        })
      })
    })

    return { posts, categories: Array.from(catMap.values()), error: null }
  } catch (err) {
    console.error('Error fetching WP posts:', err)
    return { posts: [], categories: [], error: err.message }
  }
}

export async function fetchWPPostBySlug(slug) {
  try {
    const response = await wpFetch('/posts?_embed=true&per_page=100')
    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`)
    }
    const data = await response.json()
    const posts = data.map(formatWPPost).filter(Boolean)
    const currIndex = posts.findIndex((p) => p.slug === slug)

    if (currIndex === -1) {
      return { post: null, error: 'Post not found' }
    }

    const post = posts[currIndex]
    const nextPost = currIndex > 0 ? posts[currIndex - 1] : null
    const prevPost = currIndex < posts.length - 1 ? posts[currIndex + 1] : null
    const recentPosts = posts.filter((p) => p.slug !== slug).slice(0, 4)

    // Aggregate unique categories across posts
    const catMap = new Map()
    posts.forEach((p) => {
      (p.categories || []).forEach((c) => {
        catMap.set(c.slug, {
          name: c.name,
          slug: c.slug,
          count: (catMap.get(c.slug)?.count || 0) + 1,
        })
      })
    })
    const allCategories = Array.from(catMap.values())

    return {
      post,
      prevPost,
      nextPost,
      recentPosts,
      allCategories,
      error: null,
    }
  } catch (err) {
    console.error(`Error fetching post with slug "${slug}":`, err)
    return { post: null, error: err.message }
  }
}

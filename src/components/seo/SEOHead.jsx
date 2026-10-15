import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://escapegamingzone.com'
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`
const SITE_NAME = 'Escape Gaming Zone'

export function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  publishedDate,
  modifiedDate,
  authorName = 'Escape Gaming Team',
  keywords = [],
  breadcrumbs = [],
  schema = null,
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const fullCanonical = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`) : SITE_URL
  const fullImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  // Base Schema for Escape Gaming Zone Organization
  const organizationSchema = {
    '@type': 'SportsActivityLocation',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    telephone: '+919167862341',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3rd floor, 304, Bandra Commercial Wing, Sayba Emerald Building, Station Rd, near Bandra Bus Depot',
      addressLocality: 'Bandra West',
      addressRegion: 'Mumbai',
      postalCode: '400050',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0596,
      longitude: 72.8295,
    },
  }

  // Breadcrumbs Schema
  const breadcrumbsSchema = breadcrumbs.length > 0 ? {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  } : null

  // Combine schemas into a graph
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      ...(breadcrumbsSchema ? [breadcrumbsSchema] : []),
      ...(schema ? [schema] : []),
    ],
  }

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Local SEO Geo Tags for Bandra, Mumbai */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Bandra, Mumbai" />
      <meta name="geo.position" content="19.0596;72.8295" />
      <meta name="ICBM" content="19.0596, 72.8295" />

      {/* OpenGraph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={fullImage} />

      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {authorName && <meta property="article:author" content={authorName} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaGraph)}
      </script>
    </Helmet>
  )
}

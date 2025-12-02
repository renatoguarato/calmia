import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  image?: string
  type?: string
  schema?: object
}

export function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  schema,
}: SEOProps) {
  useEffect(() => {
    // Update Title
    document.title = title

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, attr = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Meta Description & Robots
    updateMeta('description', description)
    updateMeta('robots', 'index, follow')

    // Open Graph / Facebook
    updateMeta('og:type', type, 'property')
    updateMeta('og:title', title, 'property')
    updateMeta('og:description', description, 'property')
    updateMeta('og:url', canonical || window.location.href, 'property')

    if (image) {
      updateMeta('og:image', image, 'property')
      updateMeta('og:image:width', '1200', 'property')
      updateMeta('og:image:height', '630', 'property')
    }

    // Twitter
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    if (image) {
      updateMeta('twitter:image', image)
    }

    // Canonical Link
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonical || window.location.href)

    // Schema.org JSON-LD
    if (schema) {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(schema)
    }

    return () => {
      // Optional cleanup if needed, but usually SEO tags persist on SPA until overwritten
    }
  }, [title, description, canonical, image, type, schema])

  return null
}

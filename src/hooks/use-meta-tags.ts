import { useEffect } from 'react'

export function useMetaTags(imagePath: string) {
  useEffect(() => {
    const fullUrl = `${window.location.origin}${imagePath}`

    const metaTags = [
      {
        selector: 'meta[property="og:image"]',
        attr: 'property',
        key: 'og:image',
        content: fullUrl,
      },
      {
        selector: 'meta[property="og:image:width"]',
        attr: 'property',
        key: 'og:image:width',
        content: '1200',
      },
      {
        selector: 'meta[property="og:image:height"]',
        attr: 'property',
        key: 'og:image:height',
        content: '630',
      },
      {
        selector: 'meta[name="twitter:image"]',
        attr: 'name',
        key: 'twitter:image',
        content: fullUrl,
      },
      {
        selector: 'meta[name="twitter:card"]',
        attr: 'name',
        key: 'twitter:card',
        content: 'summary_large_image',
      },
    ]

    metaTags.forEach(({ selector, attr, key, content }) => {
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    })
  }, [imagePath])
}

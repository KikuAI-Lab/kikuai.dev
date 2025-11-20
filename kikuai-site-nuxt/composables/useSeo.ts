import type { Product } from '~/types/products'

export const useProductSeo = (product: Product) => {
  const siteUrl = 'https://kikuai.dev'
  
  // Determine application category and operating system
  const getApplicationCategory = (slug: string): string => {
    if (slug === 'reliapi' || slug === 'routellm') return 'DeveloperApplication'
    if (slug === 'momentumai' || slug === 'insightsocial') return 'FinanceApplication'
    return 'WebApplication'
  }
  
  const getApplicationSubCategory = (slug: string): string | undefined => {
    return undefined
  }
  
  const getOperatingSystem = (slug: string): string => {
    return 'Web'
  }
  
  const sameAs = [
    product.links.github,
    product.links.rapidapi
  ].filter(Boolean) as string[]
  
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    alternateName: product.alternateName,
    description: product.oneLiner,
    applicationCategory: getApplicationCategory(product.slug),
    operatingSystem: getOperatingSystem(product.slug),
    softwareVersion: product.version,
    isAccessibleForFree: true,
    url: `${siteUrl}/products/${product.slug}`
  }
  
  // Add applicationSubCategory if needed
  const subCategory = getApplicationSubCategory(product.slug)
  if (subCategory) {
    jsonLd.applicationSubCategory = subCategory
  }
  
  // Add downloadUrl and license if needed
  if (false) {
    if (product.links.download) {
      jsonLd.downloadUrl = product.links.download
    }
    if (product.license) {
      jsonLd.license = `https://spdx.org/licenses/${product.license}.html`
    }
  }
  
  // Add sameAs only if there are links
  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs
  }
  
  return {
    title: product.name,
    meta: [
      { name: 'description', content: product.oneLiner },
      { property: 'og:title', content: product.og.title },
      { property: 'og:description', content: product.oneLiner },
      { property: 'og:image', content: `${siteUrl}${product.og.image}` },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${siteUrl}/products/${product.slug}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: product.og.title },
      { name: 'twitter:description', content: product.oneLiner },
      { name: 'twitter:image', content: `${siteUrl}${product.og.image}` }
    ],
    link: [
      { rel: 'canonical', href: `${siteUrl}/products/${product.slug}` }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      }
    ]
  }
}

// OG image generation - SVG version (lightweight, CSP-safe)
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug required' })
  }
  
  // Get product data
  const products = await import('~/data/products.json').then(m => m.default)
  const product = products.find((p: any) => p.slug === slug)
  
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  
  // Get icon SVG based on product slug (simplified inline versions)
  const iconSvgs: Record<string, string> = {
    tas: '<g transform="translate(540, 150) scale(2)"><path d="M32 12 L48 20 L48 32 C48 42 40 48 32 52 C24 48 16 42 16 32 L16 20 Z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="24" y1="28" x2="40" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="36" x2="36" y2="36" stroke="white" stroke-width="2" stroke-linecap="round"/></g>',
    patas: '<g transform="translate(540, 150) scale(2)"><circle cx="20" cy="20" r="3" stroke="white" stroke-width="2" fill="none"/><circle cx="44" cy="20" r="3" stroke="white" stroke-width="2" fill="none"/><circle cx="20" cy="44" r="3" stroke="white" stroke-width="2" fill="none"/><circle cx="44" cy="44" r="3" stroke="white" stroke-width="2" fill="none"/><path d="M20 20 L32 32 L44 20" stroke="white" stroke-width="1.5" fill="none"/><path d="M20 44 L32 32 L44 44" stroke="white" stroke-width="1.5" fill="none"/><line x1="32" y1="16" x2="32" y2="48" stroke="white" stroke-width="1.5"/></g>',
    reliapi: '<g transform="translate(540, 150) scale(2)"><rect x="8" y="28" width="16" height="8" stroke="white" stroke-width="2" fill="none" rx="1"/><rect x="40" y="28" width="16" height="8" stroke="white" stroke-width="2" fill="none" rx="1"/><path d="M24 32 L32 24 L40 32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M24 36 L32 44 L40 36" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="32" cy="32" r="3" stroke="white" stroke-width="2" fill="none"/></g>',
    routex: '<g transform="translate(540, 150) scale(2)"><circle cx="16" cy="16" r="4" stroke="white" stroke-width="2" fill="none"/><circle cx="48" cy="16" r="4" stroke="white" stroke-width="2" fill="none"/><circle cx="16" cy="48" r="4" stroke="white" stroke-width="2" fill="none"/><circle cx="48" cy="48" r="4" stroke="white" stroke-width="2" fill="none"/><path d="M20 16 L44 16" stroke="white" stroke-width="1.5"/><path d="M16 20 L16 44" stroke="white" stroke-width="1.5"/><path d="M48 20 L48 44" stroke="white" stroke-width="1.5"/><path d="M20 48 L44 48" stroke="white" stroke-width="1.5"/><circle cx="32" cy="32" r="3" stroke="white" stroke-width="2" fill="none"/></g>',
    momentumai: '<g transform="translate(540, 150) scale(2)"><circle cx="32" cy="32" r="20" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/><circle cx="32" cy="32" r="12" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M32 12 L32 32 L48 32" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="32" r="2" fill="white"/></g>',
    insightsocial: '<g transform="translate(540, 150) scale(2)"><circle cx="20" cy="20" r="6" stroke="white" stroke-width="2" fill="none"/><circle cx="44" cy="20" r="6" stroke="white" stroke-width="2" fill="none"/><circle cx="32" cy="44" r="6" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="24" x2="28" y2="40" stroke="white" stroke-width="1.5"/><line x1="40" y1="24" x2="36" y2="40" stroke="white" stroke-width="1.5"/><line x1="26" y1="22" x2="38" y2="22" stroke="white" stroke-width="1.5"/></g>'
  }
  
  const iconSvg = iconSvgs[slug] || iconSvgs.patas
  
  // Create OG image SVG (1200x630)
  const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#111315"/>
    ${iconSvg}
    <text x="600" y="400" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="600" fill="#EDEDED" text-anchor="middle">${product.name}</text>
    <text x="600" y="480" font-family="Inter, system-ui, sans-serif" font-size="24" fill="#B6B8BE" text-anchor="middle">${product.oneLiner}</text>
  </svg>`
  
  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  
  return ogSvg
})

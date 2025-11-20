// OG Image generator for Nuxt
// Generates OG images with brand mark in top-left corner

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = (query.title as string) || 'KikuAI'
  const product = (query.product as string) || ''
  
  // For now, return SVG-based OG image
  // In production, could use @vercel/og or similar
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#111315"/>
      <!-- Brand mark in top-left -->
      <g transform="translate(60, 60)">
        <path d="M0 0 L30 30 L0 60 M30 30 L60 0 M30 30 L60 60" stroke="#EDEDED" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
      <!-- Title -->
      <text x="60" y="400" font-family="Inter, sans-serif" font-size="64" font-weight="600" fill="#EDEDED">
        ${title}
      </text>
      ${product ? `<text x="60" y="480" font-family="Inter, sans-serif" font-size="32" fill="#B6B8BE">${product}</text>` : ''}
    </svg>
  `
  
  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return svg
})


export default defineEventHandler(async (event) => {
  const siteUrl = 'https://kikuai.dev'
  const products = await import('~/data/products.json').then(m => m.default)
  
  // Filter live and beta products, sort by status (live first)
  const items = products
    .filter((p: any) => p.status === 'live' || p.status === 'beta')
    .sort((a: any, b: any) => {
      if (a.status === 'live' && b.status !== 'live') return -1
      if (a.status !== 'live' && b.status === 'live') return 1
      return 0
    })
    .map((product: any) => {
      const pubDate = new Date().toUTCString()
      return `    <item>
      <title>${product.name} ${product.version}</title>
      <link>${siteUrl}/products/${product.slug}</link>
      <description>${product.oneLiner}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${siteUrl}/products/${product.slug}</guid>
      <category>${product.status}</category>
    </item>`
    })
    .join('\n')
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KikuAI Lab Products</title>
    <link>${siteUrl}</link>
    <description>Autonomous AI products built for integration, not attention.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
  
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return rss
})

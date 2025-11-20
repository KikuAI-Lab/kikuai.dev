import { prisma } from '~/server/utils/db'
import { verifyApiKey, extractKeyPrefix, getLookupPrefix } from '~/server/utils/api-key'
import { rateLimit } from '~/server/utils/redis'

const KEY_PREFIX = 'kiku_'

export default defineEventHandler(async (event) => {
  // Skip middleware for prerender and non-API routes
  const url = getRequestURL(event)
  
  // Skip for homepage and non-API routes
  if (url.pathname === '/' || !url.pathname.startsWith('/api/')) {
    return
  }
  
  // Skip for public API routes that don't need auth
  const publicRoutes = ['/api/demo', '/api/og', '/api/plans', '/api/debug', '/api/chat']
  if (publicRoutes.some(route => url.pathname.startsWith(route))) {
    console.log('[API-Auth Middleware] Skipping route:', url.pathname, 'matched public route')
    return
  }
  
  console.log('[API-Auth Middleware] Processing route:', url.pathname)
  
  // Only apply to API routes that require auth
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing Authorization header'
    })
  }
  
  const prefix = extractKeyPrefix(authHeader)
  if (!prefix) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key format'
    })
  }
  
  // Find API key by prefix (we store first 8 chars after prefix for lookup)
  const lookupPrefix = getLookupPrefix(prefix)
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      prefix: { startsWith: lookupPrefix },
      isActive: true
    },
    include: {
      user: {
        include: {
          subscriptions: {
            where: {
              status: 'active',
              OR: [
                { currentPeriodEnd: null },
                { currentPeriodEnd: { gte: new Date() } }
              ]
            },
            include: {
              plan: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      }
    }
  })
  
  if (!apiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key'
    })
  }
  
  const fullKey = prefix
  const isValid = await verifyApiKey(fullKey, apiKey.keyHash)
  
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key'
    })
  }
  
  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  })
  
  // Get active subscription and limits
  const activeSubscription = apiKey.user.subscriptions[0]
  if (!activeSubscription) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No active subscription'
    })
  }
  
  const limits = activeSubscription.plan.limits as { requests?: number; rate?: number }
  const productSlug = activeSubscription.plan.product.slug
  
  // Rate limiting
  const rateLimitKey = `api:${apiKey.id}`
  const rateLimitResult = await rateLimit(
    rateLimitKey,
    limits.rate || 100,
    60 // 1 minute window
  )
  
  if (!rateLimitResult.allowed) {
    setHeader(event, 'X-RateLimit-Limit', String(limits.rate || 100))
    setHeader(event, 'X-RateLimit-Remaining', String(rateLimitResult.remaining))
    setHeader(event, 'X-RateLimit-Reset', rateLimitResult.resetAt.toISOString())
    
    throw createError({
      statusCode: 429,
      statusMessage: 'Rate limit exceeded',
      data: {
        error: 'rate_limit_exceeded',
        reset_at: rateLimitResult.resetAt.toISOString()
      }
    })
  }
  
  // Check daily quota
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayUsage = await prisma.usageCounterDay.findUnique({
    where: {
      userId_apiKeyId_productSlug_date: {
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        productSlug,
        date: today
      }
    }
  })
  
  const dailyLimit = limits.requests || 10000
  const currentUsage = todayUsage?.requests || 0
  
  if (currentUsage >= dailyLimit) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    throw createError({
      statusCode: 402,
      statusMessage: 'Quota exceeded',
      data: {
        error: 'limit_exceeded',
        reset_at: tomorrow.toISOString()
      }
    })
  }
  
  // Attach to event context
  event.context.apiKey = apiKey
  event.context.user = apiKey.user
  event.context.subscription = activeSubscription
  event.context.productSlug = productSlug
  event.context.rateLimit = rateLimitResult
})

import { prisma } from '~/server/utils/db'

// This endpoint is called after successful API request to track usage
export default defineEventHandler(async (event) => {
  const apiKey = event.context.apiKey
  const user = event.context.user
  const productSlug = event.context.productSlug
  
  if (!apiKey || !user || !productSlug) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing context'
    })
  }
  
  const body = await readBody(event)
  const { endpoint, method, statusCode, responseTime } = body
  
  // Create usage event (async, don't wait)
  prisma.usageEvent.create({
    data: {
      apiKeyId: apiKey.id,
      userId: user.id,
      productSlug,
      endpoint: endpoint || 'unknown',
      method: method || 'GET',
      statusCode: statusCode || 200,
      responseTime: responseTime || null
    }
  }).catch(console.error)
  
  // Update daily counter (async)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  prisma.usageCounterDay.upsert({
    where: {
      userId_apiKeyId_productSlug_date: {
        userId: user.id,
        apiKeyId: apiKey.id,
        productSlug,
        date: today
      }
    },
    update: {
      requests: { increment: 1 },
      errors: statusCode >= 400 ? { increment: 1 } : undefined,
      totalResponseTime: responseTime ? { increment: responseTime } : undefined
    },
    create: {
      userId: user.id,
      apiKeyId: apiKey.id,
      productSlug,
      date: today,
      requests: 1,
      errors: statusCode >= 400 ? 1 : 0,
      totalResponseTime: responseTime || 0
    }
  }).catch(console.error)
  
  return { success: true }
})


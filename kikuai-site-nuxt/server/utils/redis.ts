// Lazy Redis import for Vercel serverless functions

let Redis: any = null
let redis: any = null

export function getRedis() {
  if (redis) {
    return redis
  }
  
  // Only import ioredis when actually needed (runtime, not build)
  if (!Redis) {
    try {
      // Dynamic import for serverless compatibility
      Redis = require('ioredis')
    } catch (e) {
      // ioredis not available
      // Return a mock implementation
      console.warn('Redis (ioredis) not available, using fallback')
      return {
        incr: async () => 1,
        ttl: async () => -1,
        expire: async () => 1,
        get: async () => null,
        set: async () => 'OK'
      }
    }
  }
  
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        return null // stop retrying
      }
      return Math.min(times * 50, 2000)
    }
  })
  
  return redis
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const redisClient = getRedis()
  const windowKey = `rate_limit:${key}`
  
  // If Redis is not available, allow all requests
  // In production, configure Redis URL in Vercel environment variables
  if (!redisClient || typeof redisClient.incr !== 'function') {
    return {
      allowed: true,
      remaining: limit,
      resetAt: new Date(Date.now() + windowSeconds * 1000)
    }
  }
  
  const current = await redisClient.incr(windowKey)
  const ttl = await redisClient.ttl(windowKey)
  
  if (current === 1) {
    await redisClient.expire(windowKey, windowSeconds)
  }
  
  const resetAt = new Date(Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000))
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetAt
  }
}

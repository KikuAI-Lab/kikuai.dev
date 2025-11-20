// Database client for Vercel

import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually used
// This prevents connection attempts during build/prerender time
let _prisma: PrismaClient | null = null

function getPrisma(): PrismaClient {
  // Return cached instance if available
  if (globalThis.prisma) {
    return globalThis.prisma
  }
  
  if (_prisma) {
    return _prisma
  }
  
  // Check if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('[Prisma] DATABASE_URL is not set! Database operations will fail.')
    console.error('[Prisma] Please set DATABASE_URL environment variable in Vercel.')
  } else {
    console.log('[Prisma] DATABASE_URL is set:', dbUrl.substring(0, 30) + '...')
  }
  
  // Don't check DATABASE_URL here - Prisma Client can be created without it
  // The connection will only be attempted when actually using the client
  // This allows the build to succeed even if DATABASE_URL is not set during build
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
  _prisma = client
  
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client
  }
  
  return client
}

// Export as getter function - only initializes when actually called
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})


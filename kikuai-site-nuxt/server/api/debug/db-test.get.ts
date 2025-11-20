// Debug endpoint to test database connection
import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const debug: any = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    },
    connection: {
      status: 'unknown',
      error: null as string | null,
      testQuery: null as any
    }
  }

  try {
    // Try to connect and run a simple query
    console.log('[DB Test] Attempting to connect to database...')
    
    // Test connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    debug.connection.status = 'connected'
    debug.connection.testQuery = result
    
    // Try to count users
    try {
      const userCount = await prisma.user.count()
      debug.connection.userCount = userCount
    } catch (countError: any) {
      debug.connection.countError = countError.message
    }
    
  } catch (error: any) {
    debug.connection.status = 'failed'
    debug.connection.error = error.message
    debug.connection.errorCode = error.code
    debug.connection.errorStack = error.stack?.substring(0, 500)
    
    console.error('[DB Test] Connection failed:', error.message)
    console.error('[DB Test] Error code:', error.code)
  }

  return debug
})


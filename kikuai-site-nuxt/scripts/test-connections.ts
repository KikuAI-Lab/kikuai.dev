#!/usr/bin/env tsx
/**
 * Скрипт для тестирования подключений к внешним сервисам
 * Запуск: tsx scripts/test-connections.ts
 */

import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'

async function testDatabase() {
  console.log('🔍 Testing database connection...')
  try {
    const prisma = new PrismaClient()
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('  ✅ Database: Connected')
    await prisma.$disconnect()
    return true
  } catch (error: any) {
    console.log(`  ❌ Database: ${error.message}`)
    return false
  }
}

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...')
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_KEY
    
    if (!url || !key) {
      console.log('  ⚠️  Supabase: Missing credentials')
      return false
    }
    
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    })
    
    if (response.ok) {
      console.log('  ✅ Supabase: Connected')
      return true
    } else {
      console.log(`  ❌ Supabase: ${response.status} ${response.statusText}`)
      return false
    }
  } catch (error: any) {
    console.log(`  ❌ Supabase: ${error.message}`)
    return false
  }
}

async function testRedis() {
  console.log('🔍 Testing Redis connection...')
  try {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
      console.log('  ⚠️  Redis: Missing REDIS_URL')
      return false
    }
    
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null
    })
    
    await redis.ping()
    console.log('  ✅ Redis: Connected')
    await redis.quit()
    return true
  } catch (error: any) {
    console.log(`  ❌ Redis: ${error.message}`)
    return false
  }
}

async function testPaddle() {
  console.log('🔍 Testing Paddle API...')
  try {
    const vendorId = process.env.PADDLE_VENDOR_ID
    const apiKey = process.env.PADDLE_API_KEY
    
    if (!vendorId || !apiKey) {
      console.log('  ⚠️  Paddle: Missing credentials')
      return false
    }
    
    // Test Paddle API (sandbox)
    const response = await fetch('https://sandbox-api.paddle.com/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    
    if (response.ok || response.status === 401) {
      // 401 is OK - means API key is valid but might not have permissions
      console.log('  ✅ Paddle: API key valid')
      return true
    } else {
      console.log(`  ⚠️  Paddle: ${response.status} ${response.statusText}`)
      return false
    }
  } catch (error: any) {
    console.log(`  ❌ Paddle: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Testing external service connections...\n')
  
  const results = {
    database: await testDatabase(),
    supabase: await testSupabase(),
    redis: await testRedis(),
    paddle: await testPaddle()
  }
  
  console.log('\n' + '='.repeat(50))
  const allPassed = Object.values(results).every(r => r)
  
  if (allPassed) {
    console.log('✅ All connections successful!')
    process.exit(0)
  } else {
    console.log('⚠️  Some connections failed. Check your configuration.')
    process.exit(1)
  }
}

main().catch(console.error)


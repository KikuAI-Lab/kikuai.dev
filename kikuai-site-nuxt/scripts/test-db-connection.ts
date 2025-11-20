#!/usr/bin/env tsx
/**
 * Тест подключения к базе данных
 */

import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config()

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Простой запрос для проверки подключения
    await prisma.$connect()
    console.log('✅ Connected successfully!')
    
    // Попробуем простой запрос
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test passed:', result)
    
    await prisma.$disconnect()
    console.log('✅ Disconnected successfully')
  } catch (error: any) {
    console.error('❌ Connection failed:')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    if (error.message?.includes('Can\'t reach database server')) {
      console.log('\n💡 Suggestions:')
      console.log('1. Check if you\'re using Connection Pooling URL (port 6543)')
      console.log('2. Check if password contains special characters that need encoding')
      console.log('3. Check Supabase Settings → Database → Connection string')
      console.log('4. Try resetting database password in Supabase')
    }
    
    process.exit(1)
  }
}

testConnection()


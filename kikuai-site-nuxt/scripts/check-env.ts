#!/usr/bin/env tsx
/**
 * Скрипт для проверки конфигурации окружения
 * Запуск: tsx scripts/check-env.ts
 */

import { config } from 'dotenv'

// Загрузить переменные из .env файла
config()

const requiredEnvVars = [
  'OPENROUTER_API_KEY'
]

const optionalEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'PADDLE_VENDOR_ID',
  'PADDLE_API_KEY',
  'PADDLE_PUBLIC_KEY',
  'PADDLE_WEBHOOK_SECRET',
  'API_SECRET_KEY'
]

console.log('🔍 Checking environment configuration...\n')

let hasErrors = false
let hasWarnings = false

// Check required variables
console.log('📋 Required variables:')
for (const varName of requiredEnvVars) {
  const value = process.env[varName]
  if (!value || value.trim() === '') {
    console.log(`  ❌ ${varName}: MISSING`)
    hasErrors = true
  } else if (value.includes('your-') || value.includes('xxx') || value.includes('placeholder')) {
    console.log(`  ⚠️  ${varName}: Contains placeholder value`)
    hasWarnings = true
  } else {
    // Mask sensitive values
    const masked = varName.includes('KEY') || varName.includes('SECRET') || varName.includes('PASSWORD')
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value
    console.log(`  ✅ ${varName}: ${masked}`)
  }
}

// Check optional variables
console.log('\n📋 Optional variables:')
for (const varName of optionalEnvVars) {
  const value = process.env[varName]
  if (!value || value.trim() === '') {
    console.log(`  ⚪ ${varName}: Not set (optional)`)
  } else {
    const masked = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value
    console.log(`  ✅ ${varName}: ${masked}`)
  }
}

// Validate formats
console.log('\n🔍 Validating formats...')

// DATABASE_URL
const dbUrl = process.env.DATABASE_URL
if (dbUrl && !dbUrl.startsWith('postgresql://')) {
  console.log('  ⚠️  DATABASE_URL should start with "postgresql://"')
  hasWarnings = true
}

// OPENROUTER_API_KEY
const openrouterKey = process.env.OPENROUTER_API_KEY
if (openrouterKey && !openrouterKey.startsWith('sk-or-v1-')) {
  console.log('  ⚠️  OPENROUTER_API_KEY should start with "sk-or-v1-"')
  hasWarnings = true
}

// REDIS_URL
const redisUrl = process.env.REDIS_URL
if (redisUrl && !redisUrl.startsWith('redis://')) {
  console.log('  ⚠️  REDIS_URL should start with "redis://"')
  hasWarnings = true
}

// PADDLE keys
const paddleVendorId = process.env.PADDLE_VENDOR_ID
if (paddleVendorId && !/^\d+$/.test(paddleVendorId)) {
  console.log('  ⚠️  PADDLE_VENDOR_ID should be numeric')
  hasWarnings = true
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Configuration incomplete!')
  console.log('   Please set all required environment variables.')
  console.log('   See docs/setup-keys.md for instructions.')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  Configuration has warnings.')
  console.log('   Please review and update placeholder values.')
  process.exit(0)
} else {
  console.log('✅ Configuration looks good!')
  console.log('   You can proceed with database setup.')
  process.exit(0)
}


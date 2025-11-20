#!/usr/bin/env tsx
/**
 * Генератор случайного API_SECRET_KEY
 * Запуск: tsx scripts/generate-api-secret.ts
 */

import { randomBytes } from 'crypto'

const secret = randomBytes(32).toString('base64url')

console.log('\n🔑 Сгенерированный API_SECRET_KEY:')
console.log(secret)
console.log('\n📋 Добавьте в .env файл:')
console.log(`API_SECRET_KEY="${secret}"`)
console.log('\n⚠️  Сохраните этот ключ в безопасном месте!\n')


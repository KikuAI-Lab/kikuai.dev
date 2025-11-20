#!/usr/bin/env tsx
/**
 * Скрипт для проверки конфигурации Google OAuth
 * Проверяет правильность настроек для Supabase
 */

import { config } from 'dotenv'
config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL не установлен')
  process.exit(1)
}

// Извлекаем project reference из URL
const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
const projectRef = projectRefMatch ? projectRefMatch[1] : null

if (!projectRef) {
  console.error('❌ Не удалось извлечь project reference из SUPABASE_URL')
  console.error(`   URL: ${supabaseUrl}`)
  process.exit(1)
}

const expectedRedirectUri = `https://${projectRef}.supabase.co/auth/v1/callback`
const siteUrl = process.env.SITE_URL || 'https://kikuai.dev'
const dashboardUrl = `${siteUrl}/dashboard`

console.log('🔍 Проверка конфигурации Google OAuth для Supabase\n')
console.log('='.repeat(60))
console.log('📋 Информация о проекте:')
console.log(`   Project Reference: ${projectRef}`)
console.log(`   Supabase URL: ${supabaseUrl}`)
console.log(`   Site URL: ${siteUrl}`)
console.log(`   Dashboard URL: ${dashboardUrl}`)
console.log('')

console.log('='.repeat(60))
console.log('✅ Требуемые настройки в Supabase:')
console.log('')
console.log('1. Authentication → URL Configuration:')
console.log(`   - Site URL: ${siteUrl}`)
console.log(`   - Redirect URLs: ${siteUrl}/dashboard`)
console.log('')

console.log('2. Authentication → Providers → Google:')
console.log('   - Enable Google: ✅ ON')
console.log('   - Client ID (for OAuth): [должен быть установлен]')
console.log('   - Client Secret (for OAuth): [должен быть установлен]')
console.log('')

console.log('='.repeat(60))
console.log('✅ Требуемые настройки в Google Cloud Console:')
console.log('')
console.log('1. OAuth 2.0 Client ID:')
console.log(`   - Authorized redirect URIs: ${expectedRedirectUri}`)
console.log('   - Application type: Web application')
console.log('')

console.log('='.repeat(60))
console.log('🔗 Ссылки для проверки:')
console.log('')
console.log(`   Supabase Dashboard: ${supabaseUrl.replace('/rest/v1', '')}/project/_/auth/providers`)
console.log('   Google Cloud Console: https://console.cloud.google.com/apis/credentials')
console.log('')

console.log('='.repeat(60))
console.log('⚠️  Частые проблемы:')
console.log('')
console.log('1. Redirect URI в Google не совпадает с Supabase callback URL')
console.log(`   Должно быть: ${expectedRedirectUri}`)
console.log('')
console.log('2. Site URL в Supabase не совпадает с вашим доменом')
console.log(`   Должно быть: ${siteUrl}`)
console.log('')
console.log('3. Redirect URLs в Supabase не включает dashboard URL')
console.log(`   Должно включать: ${dashboardUrl}`)
console.log('')
console.log('4. Google OAuth Client ID/Secret не установлены в Supabase')
console.log('   Проверьте: Authentication → Providers → Google')
console.log('')


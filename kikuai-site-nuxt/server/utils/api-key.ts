import { randomBytes } from 'crypto'

// Use Web Crypto API for edge compatibility (Cloudflare Pages)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  // Add salt for better security (in production, use proper salt)
  return hashHex
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

const KEY_PREFIX = 'kiku_'
const SECRET_LENGTH = 32
const TAIL_LENGTH = 4

export interface GeneratedKey {
  fullKey: string
  prefix: string
  tail: string
  hash: string
}

export async function generateApiKey(): Promise<GeneratedKey> {
  const secret = randomBytes(SECRET_LENGTH).toString('base64url')
  const fullKey = `${KEY_PREFIX}${secret}`
  const tail = secret.slice(-TAIL_LENGTH)
  const keyHash = await hashPassword(secret)
  const prefix = `${KEY_PREFIX}${secret.slice(0, 8)}` // Store prefix + first 8 chars for lookup
  
  return {
    fullKey,
    prefix,
    tail,
    hash: keyHash
  }
}

export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  if (!key.startsWith(KEY_PREFIX)) {
    return false
  }
  
  const secret = key.slice(KEY_PREFIX.length)
  return verifyPassword(secret, hash)
}

export function extractKeyPrefix(authHeader: string): string | null {
  if (!authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const key = authHeader.slice(7)
  if (!key.startsWith(KEY_PREFIX)) {
    return null
  }
  
  // Return full key for verification, prefix for lookup
  return key
}

export function getLookupPrefix(key: string): string {
  if (!key.startsWith(KEY_PREFIX)) {
    return ''
  }
  return key.slice(0, KEY_PREFIX.length + 8) // prefix + first 8 chars for lookup
}


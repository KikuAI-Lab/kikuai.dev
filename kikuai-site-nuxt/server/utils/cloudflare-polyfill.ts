// Polyfill for __dirname and __filename in Cloudflare Pages (ESM environment)
// This file should be imported early to ensure __dirname is available
// Prisma Client might use __dirname internally, so we need to define it

// Define __dirname and __filename on globalThis for Cloudflare Pages runtime
if (typeof globalThis !== 'undefined') {
  if (typeof (globalThis as any).__dirname === 'undefined') {
    (globalThis as any).__dirname = ''
    (globalThis as any).__filename = ''
  }
}


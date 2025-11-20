// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: '2024-11-11',
  typescript: {
    strict: true,
    typeCheck: false // Disabled for faster builds
  },
  css: ['~/app.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/turnstile'
  ],
  runtimeConfig: {
    // Private keys (server-side only)
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    // Public keys (exposed to client)
    public: {}
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/brand/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/brand/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', href: '/brand/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/brand/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/brand/maskable-icon.png', color: '#17191d' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2' }
      ],
      script: [
        {
          defer: true,
          'data-domain': 'kikuai.dev',
          src: 'https://plausible.io/js/script.js'
        }
      ]
    }
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/'],
      crawlLinks: false,
      failOnError: false // Don't fail build on prerender errors
    },
    compressPublicAssets: true,
    // Add polyfill for __dirname and string_decoder in worker bundle
    rollupConfig: {
      output: {
        banner: `
          if (typeof __dirname === 'undefined') {
            globalThis.__dirname = '';
            globalThis.__filename = '';
          }
          // Polyfill for string_decoder (used by Prisma/ioredis)
          if (typeof globalThis.string_decoder === 'undefined') {
            globalThis.string_decoder = {
              StringDecoder: function() {
                this.write = function() { return ''; };
                this.end = function() { return ''; };
              }
            };
          }
        `
      }
    },
    routeRules: {
      '/**': {
        headers: {
          'cache-control': 'public, max-age=0, s-maxage=1800'
        }
      },
      '/assets/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/brand/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/og/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/api/og/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/api/demo/**': {
        headers: {
          'cache-control': 'no-store'
        }
      },
      '/api/**': {
              prerender: false
            },
      '/api/debug/**': {
        prerender: false,
        cors: true
      }
    }
  },
  ssr: true,
  vite: {
    define: {
      '__dirname': JSON.stringify(''),
      '__filename': JSON.stringify('')
    }
  }
})

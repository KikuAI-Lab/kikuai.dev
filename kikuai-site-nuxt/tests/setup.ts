import { vi } from 'vitest'

// Mock Nuxt composables
global.useRuntimeConfig = vi.fn(() => ({
  public: {}
}))

global.navigateTo = vi.fn()
global.useNuxtApp = vi.fn(() => ({}))


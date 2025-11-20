// Debug endpoint to check environment variables at runtime
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    runtimeConfig: {
      public: config.public || {}
    },
    env: {
      hasOpenRouterKey: !!config.openrouterApiKey
    }
  }
})

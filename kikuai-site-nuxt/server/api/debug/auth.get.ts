// Debug endpoint - authentication removed
export default defineEventHandler(async (event) => {
  return {
    note: 'Authentication system has been removed from this project',
    timestamp: new Date().toISOString()
  }
})

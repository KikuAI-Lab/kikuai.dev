// Debug endpoint - Supabase removed
export default defineEventHandler(async (event) => {
    return {
    error: 'Supabase authentication has been removed from this project',
    note: 'This endpoint is no longer available'
  }
})

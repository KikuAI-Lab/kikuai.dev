// Debug endpoint - Supabase removed
export default defineEventHandler(async (event) => {
    throw createError({
    statusCode: 410,
    statusMessage: 'Supabase authentication has been removed from this project'
  })
})

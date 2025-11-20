export default defineNuxtRouteMiddleware(async (to) => {
  // Allow test-login page
  if (to.path === '/test-login') {
    return
  }
  
  // Skip auth check if Supabase is not configured (for static pages)
  if (typeof useSupabaseUser === 'undefined') {
    return
  }
  
  // Allow OAuth callback to pass through - it will be handled on the page
  const urlParams = new URLSearchParams(to.fullPath.split('?')[1] || '')
  if (urlParams.has('code') || urlParams.has('access_token')) {
    return // Let the page handle OAuth callback
  }
  
  // Check for test user in sessionStorage (dev mode)
  if (typeof window !== 'undefined' && sessionStorage.getItem('test-user')) {
    return // Allow test user to access protected routes
  }
  
  const user = useSupabaseUser()
  
  if (!user.value) {
    return navigateTo('/')
  }
})

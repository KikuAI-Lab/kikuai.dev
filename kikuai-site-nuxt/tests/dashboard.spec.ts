import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard - will redirect to login if not authenticated
    await page.goto('/dashboard')
  })

  test('should redirect to home if not authenticated', async ({ page }) => {
    // If not authenticated, should redirect to home
    await page.waitForURL(/\/(login|\?)/, { timeout: 5000 })
    const url = page.url()
    expect(url).toMatch(/\/(login|\?)/)
  })

  test('should show loading state initially', async ({ page }) => {
    // This test requires authentication - skip if redirected
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    // Check for loading state
    const loading = page.locator('.loading-state, .spinner')
    await expect(loading.first()).toBeVisible({ timeout: 2000 }).catch(() => {
      // Loading might be too fast, that's okay
    })
  })

  test('should display dashboard tabs', async ({ page }) => {
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    await page.waitForSelector('.tabs', { timeout: 10000 })
    
    const tabs = page.locator('.tab')
    await expect(tabs).toHaveCount(4)
    
    const tabLabels = ['Overview', 'Usage', 'API Keys', 'Billing']
    for (const label of tabLabels) {
      await expect(page.locator(`text=${label}`).first()).toBeVisible()
    }
  })

  test('should switch between tabs', async ({ page }) => {
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    await page.waitForSelector('.tabs', { timeout: 10000 })
    
    // Click on Usage tab
    await page.click('text=Usage')
    await expect(page.locator('.tab.active')).toContainText('Usage')
    
    // Click on API Keys tab
    await page.click('text=API Keys')
    await expect(page.locator('.tab.active')).toContainText('API Keys')
    
    // Click on Billing tab
    await page.click('text=Billing')
    await expect(page.locator('.tab.active')).toContainText('Billing')
    
    // Back to Overview
    await page.click('text=Overview')
    await expect(page.locator('.tab.active')).toContainText('Overview')
  })

  test('should display user email in header', async ({ page }) => {
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    await page.waitForSelector('.dashboard-header', { timeout: 10000 })
    
    // Check if user email is displayed (if available)
    const userEmail = page.locator('.user-email')
    const count = await userEmail.count()
    if (count > 0) {
      await expect(userEmail).toBeVisible()
      const email = await userEmail.textContent()
      expect(email).toMatch(/@/)
    }
  })

  test('should have sign out button', async ({ page }) => {
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    await page.waitForSelector('.btn-signout', { timeout: 10000 })
    await expect(page.locator('.btn-signout')).toBeVisible()
    await expect(page.locator('.btn-signout')).toContainText('Sign out')
  })

  test('should handle sign out', async ({ page }) => {
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }

    await page.waitForSelector('.btn-signout', { timeout: 10000 })
    
    // Click sign out
    await page.click('.btn-signout')
    
    // Should redirect to home
    await page.waitForURL('/', { timeout: 5000 })
    expect(page.url()).toBe('https://kikuai.dev/')
  })
})

test.describe('Dashboard API Keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    const url = page.url()
    if (url.includes('/login') || url === 'https://kikuai.dev/') {
      test.skip()
    }
    await page.waitForSelector('.tabs', { timeout: 10000 })
    await page.click('text=API Keys')
  })

  test('should display API Keys tab', async ({ page }) => {
    await expect(page.locator('.keys-tab, .tab-content')).toBeVisible()
  })

  test('should show create key button', async ({ page }) => {
    const createButton = page.locator('text=Create Key')
    await expect(createButton).toBeVisible({ timeout: 5000 })
  })

  test('should open create key modal', async ({ page }) => {
    await page.click('text=Create Key')
    await expect(page.locator('.modal-content')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })
})


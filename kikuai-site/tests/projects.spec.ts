import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Projects Page', () => {
  test('should return 200 status', async ({ page }) => {
    const response = await page.goto('/projects');
    expect(response?.status()).toBe(200);
  });

  test('should have key content blocks', async ({ page }) => {
    await page.goto('/projects');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    
    // Check for projects grid (should have at least one project)
    const projectCards = page.locator('[class*="border"]').filter({ hasText: /live|private|soon/i });
    await expect(projectCards.first()).toBeVisible();
  });

  test('should render at least 6 project cards', async ({ page }) => {
    await page.goto('/projects');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for specific project names in headings to ensure data is loaded
    // Use exact match to avoid conflicts (e.g., "TAS" vs "PATAS")
    await expect(page.getByRole('heading', { name: 'PATAS', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TAS', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'DocStripper', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'DeepStabilizer', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SpamExplain', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Broken Link Checker', exact: true })).toBeVisible();
    
    // Verify we have at least 6 project cards by counting headings (h2) in main content
    const projectHeadings = page.locator('main').getByRole('heading', { level: 2 });
    const projectCount = await projectHeadings.count();
    expect(projectCount).toBeGreaterThanOrEqual(6);
  });

  test('should have clickable project links for live and private projects', async ({ page }) => {
    await page.goto('/projects');
    
    // Check if there are any live or private projects with links
    const projectLinks = page.getByRole('link', { name: /Visit/i });
    const count = await projectLinks.count();
    
    if (count > 0) {
      const firstLink = projectLinks.first();
      await expect(firstLink).toBeVisible();
      await expect(firstLink).toHaveAttribute('href', /.+/);
      await expect(firstLink).toHaveAttribute('target', '_blank');
    }
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('/projects');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();
    
    const seriousViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical'
    );
    
    if (seriousViolations.length > 0) {
      console.error('Accessibility violations:', JSON.stringify(seriousViolations, null, 2));
    }
    
    expect(seriousViolations).toHaveLength(0);
  });
});


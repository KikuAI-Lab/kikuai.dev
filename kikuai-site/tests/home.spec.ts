import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home Page', () => {
  test('should return 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should have key content blocks', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'KikuAI Lab' })).toBeVisible();
    
    // Check for subtitle
    await expect(page.getByText('Autonomous AI micro-products')).toBeVisible();
    
    // Check for "What we ship" section
    await expect(page.getByRole('heading', { name: 'What we ship' })).toBeVisible();
    
    // Check for "Contact" section
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  });

  test('should have clickable CTAs', async ({ page }) => {
    await page.goto('/');
    
    // Check "View Projects" CTA
    const viewProjectsLink = page.getByRole('link', { name: 'View Projects' });
    await expect(viewProjectsLink).toBeVisible();
    await expect(viewProjectsLink).toHaveAttribute('href', '/projects');
    
    // Check "Status" CTA (in main content, not nav)
    const statusLink = page.locator('main').getByRole('link', { name: 'Status' });
    await expect(statusLink).toBeVisible();
    await expect(statusLink).toHaveAttribute('href', 'https://status.kikuai.dev');
    
    // Test clicking "View Projects" (should navigate)
    await viewProjectsLink.click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('/');
    
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


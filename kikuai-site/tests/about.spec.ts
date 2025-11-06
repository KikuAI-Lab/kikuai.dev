import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('About Page', () => {
  test('should return 200 status', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
  });

  test('should have key content blocks', async ({ page }) => {
    await page.goto('/about');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
    
    // Check for Principles section
    await expect(page.getByRole('heading', { name: 'Principles' })).toBeVisible();
    
    // Check for key philosophy content
    await expect(page.getByText(/KikuAI Lab is a laboratory/i)).toBeVisible();
    await expect(page.locator('main').getByText(/one function, one product/i).first()).toBeVisible();
    await expect(page.getByText(/Autonomy is at the core/i)).toBeVisible();
    await expect(page.getByText(/market-first, not tech-first/i)).toBeVisible();
    await expect(page.getByText(/Minimalism and accessibility/i)).toBeVisible();
    
    // Check for principles list items (in the Principles section)
    const principlesSection = page.getByRole('heading', { name: 'Principles' }).locator('..');
    await expect(principlesSection.getByText(/One function, one product/i)).toBeVisible();
    await expect(principlesSection.getByText(/Autonomous by design/i)).toBeVisible();
    await expect(principlesSection.getByText(/Market-first approach/i)).toBeVisible();
    await expect(principlesSection.getByText(/Passive distribution/i)).toBeVisible();
    await expect(principlesSection.getByText(/Western market focus/i)).toBeVisible();
    await expect(principlesSection.getByText(/Minimalism/i)).toBeVisible();
    await expect(principlesSection.getByText(/Accessibility/i)).toBeVisible();
    await expect(principlesSection.getByText(/Open source/i)).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('/about');
    
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


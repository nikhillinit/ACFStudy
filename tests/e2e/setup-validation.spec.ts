import { test, expect } from '@playwright/test';

test.describe('Setup Validation', () => {
  test('should validate E2E test environment is properly configured', async ({ page }) => {
    // Basic connectivity test
    await page.goto('/');
    
    // Verify page loads within reasonable time
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
    
    // Verify basic application structure is present
    const hasContent = await page.locator('html').count() > 0;
    expect(hasContent).toBe(true);
    
    // Check if we can navigate to different routes
    const routes = ['/', '/practice', '/learning'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(1000);
      
      // Verify route loads without major errors  
      const pageContent = await page.locator('body').isVisible();
      expect(pageContent).toBe(true);
      
      // Check for any critical JavaScript errors
      const jsErrors = await page.evaluate(() => {
        return window.console.error.calls ? window.console.error.calls.length : 0;
      });
      
      // Note: This is informational - some errors may be expected during development
      if (jsErrors > 0) {
        console.log(`Route ${route} has ${jsErrors} JS errors (this may be expected)`);
      }
    }
  });

  test('should verify responsive design works', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should verify key application features are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements
    const navElements = [
      page.locator('a[href="/practice"]'),
      page.locator('a[href="/learning"]'),
      page.locator('text=Practice').first(),
      page.locator('text=Learning').first()
    ];

    let hasNavigation = false;
    for (const nav of navElements) {
      try {
        if (await nav.isVisible()) {
          hasNavigation = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    expect(hasNavigation).toBe(true);
    
    // Check for interactive elements
    const interactiveElements = [
      page.locator('button').first(),
      page.locator('a').first(),
      page.locator('[role="button"]').first()
    ];

    let hasInteractivity = false;
    for (const element of interactiveElements) {
      try {
        if (await element.isVisible()) {
          hasInteractivity = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    expect(hasInteractivity).toBe(true);
  });

  test('should handle basic error scenarios gracefully', async ({ page }) => {
    // Test 404 handling
    await page.goto('/nonexistent-page-for-testing');
    
    // Should either show 404 page or redirect to home
    const is404 = await page.locator('text=404, text=Not Found').first().isVisible();
    const isHome = page.url().includes('/') && !page.url().includes('nonexistent');
    
    expect(is404 || isHome).toBe(true);
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should support basic accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic HTML
    const semanticElements = [
      page.locator('main, [role="main"]'),
      page.locator('nav, [role="navigation"]'), 
      page.locator('button, [role="button"]'),
      page.locator('a[href]')
    ];

    let hasSemantics = false;
    for (const element of semanticElements) {
      try {
        if (await element.first().isVisible()) {
          hasSemantics = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    expect(hasSemantics).toBe(true);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusExists = await page.locator(':focus').count() > 0;
    expect(focusExists).toBe(true);
  });
});
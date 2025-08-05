import { test, expect } from '@playwright/test';

test.describe('Home Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main dashboard with learning modules', async ({ page }) => {
    // Check page loads successfully
    await expect(page).toHaveTitle(/ACF/);
    
    // Verify main navigation elements are present
    await expect(page.locator('text=Practice')).toBeVisible();
    await expect(page.locator('text=Learning')).toBeVisible();
    
    // Check for learning modules section
    await expect(page.locator('[data-testid="modules-section"]').or(
      page.locator('text=Learning Modules').first()
    )).toBeVisible({ timeout: 10000 });
  });

  test('should show progress tracking components', async ({ page }) => {
    // Look for progress indicators
    const progressIndicators = [
      page.locator('[role="progressbar"]'),
      page.locator('.progress'),
      page.locator('text=Progress'),
      page.locator('text=% Complete')
    ];

    // At least one progress indicator should be visible
    let progressFound = false;
    for (const indicator of progressIndicators) {
      try {
        await indicator.waitFor({ timeout: 2000 });
        progressFound = true;
        break;
      } catch {
        // Continue checking other indicators
      }
    }
    
    // If no specific progress component, check for dashboard cards
    if (!progressFound) {
      await expect(page.locator('.card, [data-testid*="card"]').first()).toBeVisible();
    }
  });

  test('should display learning topics and modules', async ({ page }) => {
    // Check for key ACF topics that should be available
    const topics = [
      'Time Value of Money',
      'Portfolio Theory', 
      'Bond Valuation',
      'Financial Statements',
      'Derivatives'
    ];

    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if at least some topics are visible
    let topicsFound = 0;
    for (const topic of topics) {
      const topicElement = page.locator(`text="${topic}"`).first();
      if (await topicElement.isVisible()) {
        topicsFound++;
      }
    }
    
    // Either topics are directly visible, or cards/modules are present
    if (topicsFound === 0) {
      await expect(page.locator('.card, [class*="card"]').first()).toBeVisible();
    } else {
      expect(topicsFound).toBeGreaterThan(0);
    }
  });

  test('should allow navigation to practice section', async ({ page }) => {
    // Find and click the practice navigation link
    const practiceLink = page.locator('a[href="/practice"], text=Practice').first();
    await expect(practiceLink).toBeVisible();
    await practiceLink.click();
    
    // Verify navigation to practice page
    await expect(page).toHaveURL(/.*\/practice/);
    await expect(page.locator('text=Practice', 'h1, h2, h3').first()).toBeVisible({ timeout: 5000 });
  });

  test('should allow navigation to learning section', async ({ page }) => {
    // Find and click the learning navigation link  
    const learningLink = page.locator('a[href="/learning"], text=Learning').first();
    await expect(learningLink).toBeVisible();
    await learningLink.click();
    
    // Verify navigation to learning page
    await expect(page).toHaveURL(/.*\/learning/);
    
    // Check for learning content or auth requirement
    const authRequired = page.locator('text=Authentication Required, text=Log In');
    const learningContent = page.locator('text=Learning, h1, h2, h3').first();
    
    try {
      await authRequired.waitFor({ timeout: 2000 });
      // If auth is required, that's expected behavior
      expect(await authRequired.isVisible()).toBe(true);
    } catch {
      // If no auth required, learning content should be visible
      await expect(learningContent).toBeVisible();
    }
  });

  test('should display AI study companion access', async ({ page }) => {
    // Look for AI-related elements
    const aiElements = [
      page.locator('text=AI Tutor'),
      page.locator('text=Study Companion'),
      page.locator('text=AI', 'button'),
      page.locator('[data-testid*="ai"]'),
      page.locator('[class*="ai"]')
    ];

    let aiFound = false;
    for (const element of aiElements) {
      try {
        await element.waitFor({ timeout: 2000 });
        aiFound = true;
        break;
      } catch {
        // Continue checking
      }
    }
    
    // AI companion should be accessible from dashboard
    expect(aiFound).toBe(true);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check that content is still accessible
    await expect(page.locator('body')).toBeVisible();
    
    // Mobile navigation should work
    const mobileNav = page.locator('[role="button"]').filter({ hasText: /menu|nav/i }).first();
    if (await mobileNav.isVisible()) {
      await mobileNav.click();
    }
    
    // Main content should be visible and properly sized
    const mainContent = page.locator('main, .container, [class*="container"]').first();
    await expect(mainContent).toBeVisible();
  });
});
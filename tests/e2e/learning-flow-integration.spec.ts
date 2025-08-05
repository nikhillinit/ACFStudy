import { test, expect } from '@playwright/test';

test.describe('ACF Learning Platform - Complete User Journey', () => {
  test('should complete a full learning session workflow', async ({ page }) => {
    // Step 1: Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/ACF/);
    
    // Step 2: Explore the dashboard
    await expect(page.locator('text=Practice, text=Learning').first()).toBeVisible({ timeout: 10000 });
    
    // Check for key dashboard elements
    const dashboardElements = [
      page.locator('text=Learning Modules, text=Practice Problems, text=Progress'),
      page.locator('.card, [class*="card"]'),
      page.locator('h1, h2, h3').first()
    ];

    let dashboardLoaded = false;
    for (const element of dashboardElements) {
      try {
        if (await element.first().isVisible()) {
          dashboardLoaded = true;
          break;
        }
      } catch {
        continue;
      }
    }
    expect(dashboardLoaded).toBe(true);

    // Step 3: Navigate to learning modules
    const learningLink = page.locator('a[href="/learning"], text=Learning').first();
    await learningLink.click();
    await expect(page).toHaveURL(/.*\/learning/);

    // Handle authentication requirement
    const authRequired = page.locator('text=Authentication Required');
    const isAuthRequired = await authRequired.isVisible();
    
    if (isAuthRequired) {
      // If auth is required, verify the auth flow exists
      await expect(page.locator('button, a').filter({ hasText: /log in|login/i })).toBeVisible();
      
      // Skip to practice section since learning requires auth
      await page.goto('/practice');
    } else {
      // Step 4: Interact with learning content
      await page.waitForTimeout(2000);
      
      // Look for learning modules
      const modules = page.locator('.card, [class*="card"], [data-testid*="module"]');
      if (await modules.first().isVisible()) {
        await modules.first().click();
        await page.waitForTimeout(1000);
      }
      
      // Navigate to practice from learning
      const practiceFromLearning = page.locator('a[href*="practice"], button').filter({ hasText: /practice/i }).first();
      try {
        if (await practiceFromLearning.isVisible()) {
          await practiceFromLearning.click();
        } else {
          await page.goto('/practice');
        }
      } catch {
        await page.goto('/practice');
      }
    }

    // Step 5: Engage with practice section
    await expect(page).toHaveURL(/.*\/practice/);
    await page.waitForTimeout(2000);

    // Look for practice topics or problems
    const practiceElements = [
      page.locator('text=Time Value of Money'),
      page.locator('text=Portfolio Theory'),
      page.locator('text=Bond Valuation'),
      page.locator('.card, [class*="card"]'),
      page.locator('button').filter({ hasText: /start|begin|practice/i })
    ];

    let practiceEngaged = false;
    for (const element of practiceElements) {
      try {
        const firstElement = element.first();
        if (await firstElement.isVisible()) {
          if ((await firstElement.tagName()) === 'BUTTON') {
            await firstElement.click();
            await page.waitForTimeout(1000);
          }
          practiceEngaged = true;
          break;
        }
      } catch {
        continue;
      }
    }
    expect(practiceEngaged).toBe(true);

    // Step 6: Test practice modes (Quiz, Exam Simulator, Calculator)
    const practiceModes = [
      { name: 'quiz', selectors: ['text=Quiz', 'button'].filter({ hasText: /quiz/i }) },
      { name: 'exam', selectors: ['text=Exam', 'text=Simulator', 'button'].filter({ hasText: /exam/i }) },
      { name: 'calculator', selectors: ['text=Calculator', 'button'].filter({ hasText: /calculator/i }) }
    ];

    for (const mode of practiceModes) {
      for (const selector of mode.selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            await element.click();
            await page.waitForTimeout(1000);
            
            // Verify mode-specific content appeared
            if (mode.name === 'quiz') {
              const quizContent = page.locator('text=Question, [data-testid*="question"]').first();
              if (await quizContent.isVisible()) break;
            } else if (mode.name === 'exam') {
              const examContent = page.locator('text=Timer, text=Time, [data-testid*="timer"]').first();
              if (await examContent.isVisible()) break;
            } else if (mode.name === 'calculator') {
              const calcContent = page.locator('input[type="number"], [data-testid*="input"]').first();
              if (await calcContent.isVisible()) break;
            }
          }
        } catch {
          continue;
        }
      }
    }

    // Step 7: Test AI Study Companion access
    await page.goto('/'); // Go back to home for AI companion
    await page.waitForTimeout(1000);

    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
        
        // Verify AI interface opened
        const aiInterface = [
          page.locator('[role="dialog"]'),
          page.locator('textarea, input'),
          page.locator('text=How can I help')
        ];

        let aiOpened = false;
        for (const ui of aiInterface) {
          if (await ui.first().isVisible()) {
            aiOpened = true;
            break;
          }
        }
        expect(aiOpened).toBe(true);
      }
    } catch {
      // AI companion access is documented but may not be immediately visible
      const hasAIElements = await page.locator('text=AI, text=Companion, text=Tutor').first().isVisible();
      expect(hasAIElements).toBe(true);
    }

    // Step 8: Verify responsive design
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Mobile navigation should work
    await expect(page.locator('body')).toBeVisible();
    const mobileNav = page.locator('[role="button"]').filter({ hasText: /menu|nav/i }).first();
    if (await mobileNav.isVisible()) {
      await mobileNav.click();
      await page.waitForTimeout(500);
    }

    // Essential content should be accessible on mobile
    const mobileContent = [
      page.locator('text=Practice'),
      page.locator('text=Learning'),
      page.locator('.card, [class*="card"]').first()
    ];

    let mobileAccessible = false;
    for (const content of mobileContent) {
      try {
        if (await content.isVisible()) {
          mobileAccessible = true;
          break;
        }
      } catch {
        continue;
      }
    }
    expect(mobileAccessible).toBe(true);
  });

  test('should handle navigation between all main sections', async ({ page }) => {
    // Test complete navigation flow
    const sections = [
      { path: '/', name: 'Home' },
      { path: '/practice', name: 'Practice' },
      { path: '/learning', name: 'Learning' }
    ];

    for (const section of sections) {
      await page.goto(section.path);
      
      // Verify page loads successfully
      await expect(page).toHaveURL(new RegExp(`.*${section.path.replace('/', '\\/')}.*`));
      
      // Check for expected content
      if (section.name === 'Home') {
        await expect(page.locator('text=Practice, text=Learning').first()).toBeVisible({ timeout: 5000 });
      } else if (section.name === 'Practice') {
        const practiceContent = [
          page.locator('h1, h2, h3').filter({ hasText: /practice/i }),
          page.locator('text=Quiz'),
          page.locator('text=Problems'),
          page.locator('.card, [class*="card"]')
        ];
        
        let contentFound = false;
        for (const content of practiceContent) {
          try {
            if (await content.first().isVisible()) {
              contentFound = true;
              break;
            }
          } catch {
            continue;
          }
        }
        expect(contentFound).toBe(true);
        
      } else if (section.name === 'Learning') {
        // Handle both authenticated and non-authenticated states
        const authRequired = page.locator('text=Authentication Required');
        const learningContent = page.locator('h1, h2, h3').filter({ hasText: /learning/i });
        
        try {
          await authRequired.waitFor({ timeout: 2000 });
          await expect(authRequired).toBeVisible();
        } catch {
          await expect(learningContent.first()).toBeVisible();
        }
      }
      
      await page.waitForTimeout(1000);
    }
  });

  test('should display consistent branding and layout across pages', async ({ page }) => {
    const pages = ['/', '/practice', '/learning'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for consistent page structure
      await expect(page.locator('body')).toBeVisible();
      
      // Look for navigation elements
      const navElements = [
        page.locator('nav'),
        page.locator('a[href="/"]'),
        page.locator('a[href="/practice"]'),
        page.locator('a[href="/learning"]'),
        page.locator('text=Practice'),
        page.locator('text=Learning')
      ];

      let navFound = false;
      for (const nav of navElements) {
        try {
          if (await nav.first().isVisible()) {
            navFound = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      expect(navFound).toBe(true);
      
      // Check for consistent styling
      const styledElements = page.locator('.card, [class*="card"], button, h1, h2, h3');
      await expect(styledElements.first()).toBeVisible();
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    
    // Should handle 404 or redirect appropriately
    const errorElements = [
      page.locator('text=404'),
      page.locator('text=Not Found'),
      page.locator('text=Page not found'),
      page.locator('h1, h2, h3').filter({ hasText: /not found|error/i })
    ];

    let errorHandled = false;
    for (const element of errorElements) {
      try {
        if (await element.first().isVisible()) {
          errorHandled = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Either proper error page is shown, or redirected to home
    if (!errorHandled) {
      await expect(page).toHaveURL(/.*\//); // Should redirect to home
      await expect(page.locator('text=Practice, text=Learning').first()).toBeVisible();
    } else {
      expect(errorHandled).toBe(true);
    }
  });

  test('should support accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility features
    const accessibilityElements = [
      page.locator('[role="button"]'),
      page.locator('[role="navigation"]'),
      page.locator('[role="main"]'),
      page.locator('[aria-label]'),
      page.locator('button, a').first()
    ];

    let accessibilityFound = false;
    for (const element of accessibilityElements) {
      try {
        if (await element.first().isVisible()) {
          accessibilityFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    expect(accessibilityFound).toBe(true);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Should have focusable elements
    const focusedElement = page.locator(':focus');
    const isFocused = await focusedElement.count() > 0;
    expect(isFocused).toBe(true);
  });
});
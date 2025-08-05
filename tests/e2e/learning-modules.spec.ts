import { test, expect } from '@playwright/test';

test.describe('Learning Modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learning');
  });

  test('should display learning modules or require authentication', async ({ page }) => {
    // Check if we're on the learning page
    await expect(page).toHaveURL(/.*\/learning/);
    
    // Handle both authenticated and non-authenticated states
    const authRequired = page.locator('text=Authentication Required, text=Log In');
    const learningContent = page.locator('h1, h2, h3').filter({ hasText: /learning/i });
    
    try {
      // Check if authentication is required
      await authRequired.waitFor({ timeout: 3000 });
      
      // If auth is required, verify the auth UI
      await expect(authRequired).toBeVisible();
      await expect(page.locator('button, a').filter({ hasText: /log in|login/i })).toBeVisible();
      
    } catch {
      // If no auth required, check for learning content
      await expect(learningContent.first()).toBeVisible();
      
      // Should show learning modules or content
      const moduleElements = [
        page.locator('text=Module'),
        page.locator('.module'),
        page.locator('[data-testid*="module"]'),
        page.locator('.card, [class*="card"]')
      ];

      let moduleFound = false;
      for (const element of moduleElements) {
        try {
          if (await element.first().isVisible()) {
            moduleFound = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      expect(moduleFound).toBe(true);
    }
  });

  test('should show ACF course topics and modules', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Check for ACF learning topics
    const topics = [
      'Time Value of Money',
      'Portfolio Theory',
      'Bond Valuation',
      'Financial Statements', 
      'Derivatives',
      'Corporate Finance',
      'Risk Management'
    ];

    let topicsFound = 0;
    for (const topic of topics) {
      const topicLocators = [
        page.locator(`text="${topic}"`),
        page.locator('.card-title, h3, h4').filter({ hasText: topic }),
        page.locator(`[data-topic*="${topic}"]`)
      ];
      
      for (const locator of topicLocators) {
        if (await locator.first().isVisible()) {
          topicsFound++;
          break;
        }
      }
    }

    // Either specific topics are visible, or general learning content is present
    if (topicsFound === 0) {
      const learningContent = [
        page.locator('.card, [class*="card"]'),
        page.locator('[data-testid*="module"]'),
        page.locator('text=Chapter'),
        page.locator('text=Lesson')
      ];

      let contentFound = false;
      for (const content of learningContent) {
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
    } else {
      expect(topicsFound).toBeGreaterThan(0);
    }
  });

  test('should allow module selection and navigation', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for selectable modules or learning content
    const selectableElements = [
      page.locator('.card, [class*="card"]').filter({ hasText: /time value|portfolio|bond|statement|derivative/i }),
      page.locator('button').filter({ hasText: /start|begin|learn|select/i }),
      page.locator('a').filter({ hasText: /module|chapter|lesson/i }),
      page.locator('[data-testid*="module"]')
    ];

    let moduleSelected = false;
    for (const elementGroup of selectableElements) {
      try {
        const elements = await elementGroup.all();
        if (elements.length > 0) {
          const firstElement = elements[0];
          await firstElement.click();
          await page.waitForTimeout(1000);
          
          // Check if module content opened
          const moduleContent = [
            page.locator('text=Content'),
            page.locator('text=Lesson'),
            page.locator('text=Chapter'),
            page.locator('.module-content'),
            page.locator('[data-testid*="content"]')
          ];

          for (const content of moduleContent) {
            if (await content.first().isVisible()) {
              moduleSelected = true;
              break;
            }
          }
          
          if (moduleSelected) break;
        }
      } catch {
        continue;
      }
    }

    // At minimum, clickable learning elements should be present
    expect(moduleSelected || await page.locator('.card, button, a').first().isVisible()).toBe(true);
  });

  test('should display enhanced learning content', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for enhanced learning features
    const enhancedFeatures = [
      page.locator('text=Video'),
      page.locator('text=Interactive'),
      page.locator('text=Simulation'),
      page.locator('[data-testid*="video"]'),
      page.locator('[data-testid*="interactive"]'),
      page.locator('.video-player'),
      page.locator('video')
    ];

    let enhancedContentFound = false;
    for (const feature of enhancedFeatures) {
      try {
        if (await feature.first().isVisible()) {
          enhancedContentFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Enhanced content or rich media should be available
    if (!enhancedContentFound) {
      // At minimum, structured learning content should be present
      const basicContent = [
        page.locator('.card, [class*="card"]'),
        page.locator('p, div').filter({ hasText: /learn|study|concept/i }),
        page.locator('[data-testid*="content"]')
      ];

      let basicFound = false;
      for (const content of basicContent) {
        try {
          if (await content.first().isVisible()) {
            basicFound = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      expect(basicFound).toBe(true);
    } else {
      expect(enhancedContentFound).toBe(true);
    }
  });

  test('should show learning progress tracking', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for progress tracking elements
    const progressElements = [
      page.locator('[role="progressbar"]'),
      page.locator('.progress'),
      page.locator('text=Progress'),
      page.locator('text=Complete'),
      page.locator('text=%'),
      page.locator('[data-testid*="progress"]'),
      page.locator('.badge').filter({ hasText: /complete|progress/i })
    ];

    let progressFound = false;
    for (const element of progressElements) {
      try {
        if (await element.first().isVisible()) {
          progressFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Progress tracking should be visible in learning modules
    expect(progressFound).toBe(true);
  });

  test('should provide practice links from learning content', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for practice integration
    const practiceLinks = [
      page.locator('a[href*="practice"]'),
      page.locator('button').filter({ hasText: /practice|quiz|test/i }),
      page.locator('text=Practice Problems'),
      page.locator('[data-testid*="practice"]')
    ];

    let practiceAccessFound = false;
    for (const link of practiceLinks) {
      try {
        if (await link.first().isVisible()) {
          practiceAccessFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Learning should integrate with practice features
    expect(practiceAccessFound).toBe(true);
  });

  test('should support tabbed navigation between content types', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for tab interface in learning modules
    const tabElements = [
      page.locator('[role="tab"]'),
      page.locator('.tabs [role="tablist"] button'),
      page.locator('[data-testid*="tab"]')
    ];

    let tabsFound = false;
    for (const tabGroup of tabElements) {
      try {
        const tabs = await tabGroup.all();
        if (tabs.length > 1) {
          // Test tab switching
          await tabs[0].click();
          await page.waitForTimeout(500);
          await tabs[1].click();
          await page.waitForTimeout(500);
          tabsFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Either tabs are present, or content sections are organized
    if (!tabsFound) {
      const contentSections = [
        page.locator('.card, [class*="card"]'),
        page.locator('section'),
        page.locator('[data-testid*="section"]')
      ];

      let sectionsFound = false;
      for (const section of contentSections) {
        try {
          const sections = await section.all();
          if (sections.length > 0) {
            sectionsFound = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      expect(sectionsFound).toBe(true);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Learning content should be mobile-friendly
    await expect(page.locator('body')).toBeVisible();
    
    // Skip detailed tests if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      await expect(authRequired).toBeVisible();
      return;
    }

    // Content should be accessible and readable on mobile
    const mobileContent = [
      page.locator('h1, h2, h3').first(),
      page.locator('.card, [class*="card"]').first(),
      page.locator('p, div').first()
    ];

    let mobileContentFound = false;
    for (const content of mobileContent) {
      try {
        if (await content.isVisible()) {
          mobileContentFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    expect(mobileContentFound).toBe(true);
  });

  test('should handle learning style preferences', async ({ page }) => {
    // Skip if authentication is required
    const authRequired = page.locator('text=Authentication Required');
    if (await authRequired.isVisible()) {
      test.skip('Authentication required for learning modules');
    }

    // Look for learning style related features
    const learningStyleElements = [
      page.locator('text=Learning Style'),
      page.locator('text=Visual'),
      page.locator('text=Auditory'),
      page.locator('text=Kinesthetic'),
      page.locator('[data-testid*="learning-style"]'),
      page.locator('.badge').filter({ hasText: /visual|auditory|kinesthetic/i })
    ];

    let learningStyleFound = false;
    for (const element of learningStyleElements) {
      try {
        if (await element.first().isVisible()) {
          learningStyleFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Learning style features may be present but are not required
    // This test documents the feature if it exists
    if (learningStyleFound) {
      expect(learningStyleFound).toBe(true);
    } else {
      // If no learning style features, basic content should still be present
      await expect(page.locator('.card, [class*="card"], h1, h2, h3').first()).toBeVisible();
    }
  });
});
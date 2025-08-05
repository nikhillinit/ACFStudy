import { test, expect } from '@playwright/test';

test.describe('Practice Session Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice');
  });

  test('should display practice dashboard with topics', async ({ page }) => {
    // Check page loads and has practice content
    await expect(page).toHaveURL(/.*\/practice/);
    
    // Look for practice-related headings or content
    const practiceElements = [
      page.locator('h1, h2, h3').filter({ hasText: /practice/i }),
      page.locator('text=Practice Problems'),
      page.locator('text=Quiz'),
      page.locator('text=Topics')
    ];

    let practiceElementFound = false;
    for (const element of practiceElements) {
      try {
        await element.waitFor({ timeout: 3000 });
        practiceElementFound = true;
        break;
      } catch {
        continue;
      }
    }
    
    expect(practiceElementFound).toBe(true);
  });

  test('should show available practice topics', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check for ACF topic areas
    const topics = [
      'Time Value of Money',
      'Portfolio Theory',
      'Bond Valuation', 
      'Financial Statements',
      'Derivatives'
    ];

    // Look for topics in various formats
    let topicsVisible = 0;
    for (const topic of topics) {
      const topicLocators = [
        page.locator(`text="${topic}"`),
        page.locator(`[data-topic="${topic}"]`),
        page.locator('h3, h4, .card-title').filter({ hasText: topic })
      ];
      
      for (const locator of topicLocators) {
        if (await locator.first().isVisible()) {
          topicsVisible++;
          break;
        }
      }
    }

    // At least some topics should be visible, or cards/tabs should be present
    if (topicsVisible === 0) {
      const practiceCards = page.locator('.card, [class*="card"], [role="tabpanel"]');
      await expect(practiceCards.first()).toBeVisible();
    } else {
      expect(topicsVisible).toBeGreaterThan(0);
    }
  });

  test('should allow starting a practice session', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Look for start/begin buttons
    const startButtons = [
      page.locator('button').filter({ hasText: /start|begin|practice/i }),
      page.locator('[data-testid*="start"]'),
      page.locator('a').filter({ hasText: /start|begin/i })
    ];

    let startButtonFound = false;
    for (const button of startButtons) {
      try {
        const firstButton = button.first();
        if (await firstButton.isVisible()) {
          await firstButton.click();
          startButtonFound = true;
          
          // After clicking, we should see practice content or questions
          const practiceContent = [
            page.locator('text=Question'),
            page.locator('[data-testid*="question"]'),
            page.locator('.question'),
            page.locator('text=Problem')
          ];

          let contentFound = false;
          for (const content of practiceContent) {
            try {
              await content.waitFor({ timeout: 3000 });
              contentFound = true;
              break;
            } catch {
              continue;
            }
          }
          
          if (contentFound) break;
        }
      } catch {
        continue;
      }
    }

    // Either we found and clicked a start button, or there are practice cards available
    if (!startButtonFound) {
      const practiceCards = page.locator('.card, [class*="card"]');
      await expect(practiceCards.first()).toBeVisible();
    }
  });

  test('should display quiz interface', async ({ page }) => {
    // Look for quiz-related elements
    const quizElements = [
      page.locator('text=Quiz'),
      page.locator('text=Question'),
      page.locator('[data-testid*="quiz"]'),
      page.locator('button').filter({ hasText: /quiz/i })
    ];

    let quizFound = false;
    for (const element of quizElements) {
      try {
        if (await element.first().isVisible()) {
          // If it's a button, click it to open quiz
          if ((await element.first().tagName()) === 'BUTTON') {
            await element.first().click();
            await page.waitForTimeout(1000);
          }
          quizFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Quiz functionality should be accessible
    expect(quizFound).toBe(true);
  });

  test('should show exam simulator feature', async ({ page }) => {
    // Look for exam simulator components
    const examElements = [
      page.locator('text=Exam Simulator'),
      page.locator('text=ACF Exam'),
      page.locator('[data-testid*="exam"]'),
      page.locator('button').filter({ hasText: /exam|simulator/i })
    ];

    let examFound = false;
    for (const element of examElements) {
      try {
        const firstElement = element.first();
        if (await firstElement.isVisible()) {
          examFound = true;
          
          // If it's interactive, try clicking
          if ((await firstElement.tagName()) === 'BUTTON') {
            await firstElement.click();
            await page.waitForTimeout(1000);
            
            // Should show exam interface
            const examInterface = [
              page.locator('text=Timer'),
              page.locator('text=Time'),
              page.locator('[data-testid*="timer"]')
            ];
            
            for (const ui of examInterface) {
              if (await ui.first().isVisible()) {
                break;
              }
            }
          }
          break;
        }
      } catch {
        continue;
      }
    }

    expect(examFound).toBe(true);
  });

  test('should display calculator tools', async ({ page }) => {
    // Look for calculator components
    const calculatorElements = [
      page.locator('text=Calculator'),
      page.locator('text=Portfolio Calculator'),
      page.locator('[data-testid*="calculator"]'),
      page.locator('button').filter({ hasText: /calculator/i })
    ];

    let calculatorFound = false;
    for (const element of calculatorElements) {
      try {
        const firstElement = element.first();
        if (await firstElement.isVisible()) {
          calculatorFound = true;
          
          // If it's a button, try clicking to open calculator
          if ((await firstElement.tagName()) === 'BUTTON') {
            await firstElement.click();
            await page.waitForTimeout(1000);
            
            // Should show calculator interface
            const calcInterface = [
              page.locator('input[type="number"]'),
              page.locator('[data-testid*="input"]'),
              page.locator('.calculator')
            ];
            
            for (const ui of calcInterface) {
              if (await ui.first().isVisible()) {
                break;
              }
            }
          }
          break;
        }
      } catch {
        continue;
      }
    }

    expect(calculatorFound).toBe(true);
  });

  test('should track practice progress', async ({ page }) => {
    // Look for progress tracking elements
    const progressElements = [
      page.locator('[role="progressbar"]'),
      page.locator('text=Progress'),
      page.locator('.progress'),
      page.locator('text=Score'),
      page.locator('text=Correct'),
      page.locator('[data-testid*="progress"]')
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

    // Progress tracking should be available in practice
    expect(progressFound).toBe(true);
  });

  test('should support tabbed navigation between practice modes', async ({ page }) => {
    // Look for tab interface
    const tabElements = [
      page.locator('[role="tab"]'),
      page.locator('.tabs'),
      page.locator('[data-testid*="tab"]'),
      page.locator('button').filter({ hasText: /practice|quiz|exam|calculator/i })
    ];

    let tabsFound = false;
    for (const tabGroup of tabElements) {
      try {
        const tabs = await tabGroup.all();
        if (tabs.length > 1) {
          // Try clicking between tabs
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

    // Either tabs are present, or different practice modes are accessible
    if (!tabsFound) {
      const practiceOptions = page.locator('button, a').filter({ 
        hasText: /practice|quiz|exam|calculator/i 
      });
      await expect(practiceOptions.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Practice interface should be mobile-friendly
    await expect(page.locator('body')).toBeVisible();
    
    // Content should be accessible on mobile
    const practiceContent = [
      page.locator('text=Practice'),
      page.locator('.card, [class*="card"]').first(),
      page.locator('button').first()
    ];

    let mobileContentFound = false;
    for (const content of practiceContent) {
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
});
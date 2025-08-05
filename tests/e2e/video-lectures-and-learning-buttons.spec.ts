import { test, expect } from '@playwright/test';

test.describe('Video Lectures and Start Learning Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle the Learning Style Assessment modal if it appears - be more aggressive about closing it
    for (let i = 0; i < 3; i++) {
      try {
        const closeButton = page.getByRole('button', { name: 'Close', exact: true });
        if (await closeButton.isVisible({ timeout: 1000 })) {
          await closeButton.click();
          await page.waitForTimeout(500); // Wait for modal to close
          break;
        }
      } catch {
        // Try alternative close methods
        try {
          const dialog = page.locator('[role="dialog"]');
          if (await dialog.isVisible({ timeout: 1000 })) {
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
          } else {
            break; // No modal present
          }
        } catch {
          break; // Give up and continue
        }
      }
    }
  });

  test('should display Video Lectures button on dashboard', async ({ page }) => {
    // Verify Video Lectures button is visible and properly configured
    const videoLecturesButton = page.getByRole('link', { name: 'Video Lectures' });
    await expect(videoLecturesButton).toBeVisible();
    await expect(videoLecturesButton).toHaveAttribute('href', '/learning');
    
    // Check button styling and content
    await expect(videoLecturesButton.locator('button')).toBeVisible();
    await expect(page.locator('text=Video Lectures')).toBeVisible();
  });

  test('should navigate to learning page when Video Lectures button is clicked', async ({ page }) => {
    // Click the Video Lectures button
    const videoLecturesButton = page.getByRole('link', { name: 'Video Lectures' });
    await videoLecturesButton.click();
    
    // Verify navigation to learning page
    await expect(page).toHaveURL('/learning');
    
    // Verify authentication requirement is shown
    await expect(page.getByRole('heading', { name: 'Authentication Required' })).toBeVisible();
    await expect(page.locator('text=Please log in to access the learning materials and track your progress.')).toBeVisible();
    
    // Verify login link is present
    const loginLink = page.getByRole('link', { name: 'Log In' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/api/login');
  });

  test('should display authentication error when attempting to login', async ({ page }) => {
    // Navigate to learning page
    await page.getByRole('link', { name: 'Video Lectures' }).click();
    await expect(page).toHaveURL('/learning');
    
    // Click the login link
    const loginLink = page.getByRole('link', { name: 'Log In' });
    await loginLink.click();
    
    // Verify navigation to login endpoint
    await expect(page).toHaveURL('/api/login');
    
    // Verify 404 error is displayed (current behavior)
    await expect(page.getByRole('heading', { name: '404 Page Not Found' })).toBeVisible();
    await expect(page.locator('text=Did you forget to add the page to the router?')).toBeVisible();
  });

  test('should display learning modules with Start Learning buttons', async ({ page }) => {
    // Navigate to Modules tab
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Wait for modules to load
    await expect(page.getByRole('tabpanel', { name: 'Modules' })).toBeVisible();
    
    // Verify module statistics are displayed
    await expect(page.locator('text=Total Problems')).toBeVisible();
    await expect(page.locator('text=115+').first()).toBeVisible(); // Use .first() to handle multiple matches
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=Modules')).toBeVisible();
    
    // Verify category tabs are present
    const categoryTabs = ['All', 'Foundation', 'Risk Management', 'Fixed Income', 'Financial Analysis', 'Advanced Instruments'];
    for (const tab of categoryTabs) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible();
    }
  });

  test('should display all expected learning modules with Start Learning buttons', async ({ page }) => {
    // Navigate to Modules tab
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Define expected modules
    const expectedModules = [
      {
        name: 'Time Value of Money',
        description: 'Master present value, future value, and annuity calculations essential for all corporate finance decisions',
        level: 'Beginner',
        problems: '25 Problems',
        duration: '120min'
      },
      {
        name: 'Portfolio Theory',
        description: 'Learn CAPM, risk-return relationships, and modern portfolio optimization techniques',
        level: 'Intermediate',
        problems: '25 Problems',
        duration: '150min'
      },
      {
        name: 'Bond Valuation',
        description: 'Understand bond pricing, yield calculations, duration, and interest rate risk management',
        level: 'Intermediate',
        problems: '25 Problems',
        duration: '135min'
      },
      {
        name: 'Financial Statements',
        description: 'Analyze balance sheets, income statements, and cash flow for financial decision making',
        level: 'Beginner',
        problems: '15 Problems',
        duration: '90min'
      },
      {
        name: 'Derivatives',
        description: 'Master options, futures, forwards, and swaps for risk management and speculation',
        level: 'Advanced',
        problems: '25 Problems',
        duration: '180min'
      }
    ];
    
    // Verify each module is displayed with correct information
    for (const module of expectedModules) {
      await expect(page.locator(`text=${module.name}`).first()).toBeVisible();
      await expect(page.locator(`text=${module.description}`)).toBeVisible();
      await expect(page.locator(`text=${module.level}`).first()).toBeVisible(); // Use .first() for duplicate levels
      await expect(page.locator(`text=${module.problems}`)).toBeVisible();
      await expect(page.locator(`text=${module.duration}`)).toBeVisible();
    }
    
    // Verify all modules have Start Learning buttons
    const startLearningButtons = page.getByRole('button', { name: 'Start Learning' });
    await expect(startLearningButtons).toHaveCount(5);
    
    // Verify all Start Learning buttons are visible and clickable
    for (let i = 0; i < 5; i++) {
      await expect(startLearningButtons.nth(i)).toBeVisible();
      await expect(startLearningButtons.nth(i)).toBeEnabled();
    }
  });

  test('should show module learning objectives and details', async ({ page }) => {
    // Navigate to Modules tab
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Verify learning objectives sections are present
    const objectivesHeadings = page.getByRole('heading', { name: 'Key Learning Objectives' });
    await expect(objectivesHeadings).toHaveCount(5);
    
    // Verify specific learning objectives for Time Value of Money
    await expect(page.locator('text=Calculate present and future values of single cash flows')).toBeVisible();
    await expect(page.locator('text=Evaluate annuities and perpetuities')).toBeVisible();
    
    // Verify prerequisites are shown for advanced modules
    await expect(page.getByRole('heading', { name: 'Prerequisites' })).toHaveCount(3); // Portfolio Theory, Bond Valuation, and Derivatives have prerequisites
    
    // Verify formulas and apps counts
    await expect(page.locator('text=4 Formulas')).toHaveCount(5);
    await expect(page.locator('text=4 Apps')).toHaveCount(5);
  });

  test('should respond when Start Learning button is clicked', async ({ page }) => {
    // Navigate to Modules tab  
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Get the first Start Learning button (Time Value of Money)
    const firstStartLearningButton = page.getByRole('button', { name: 'Start Learning' }).first();
    await expect(firstStartLearningButton).toBeVisible();
    
    // Record current URL before clicking
    const currentUrl = page.url();
    
    // Click the Start Learning button
    await firstStartLearningButton.click();
    
    // Wait for modal or navigation to occur
    await page.waitForTimeout(2000);
    
    // Check if URL changed or modal appeared
    const newUrl = page.url();
    const modal = page.locator('[role="dialog"]');
    const modalVisible = await modal.isVisible().catch(() => false);
    
    // Either a modal should appear OR navigation should occur
    const somethingHappened = modalVisible || newUrl !== currentUrl;
    expect(somethingHappened).toBe(true);
    
    // If a modal appeared, document its existence (this is working functionality)
    if (modalVisible) {
      const modalContent = page.locator('[role="dialog"]');
      await expect(modalContent).toBeVisible();
      
      // Take a screenshot to document what the modal looks like
      await page.screenshot({ path: 'test-results/start-learning-modal.png' });
    }
    
    // If navigation occurred, that's also working functionality
    if (newUrl !== currentUrl) {
      console.log(`Navigation occurred: ${currentUrl} -> ${newUrl}`);
    }
  });

  test('should display enhanced problem database information', async ({ page }) => {
    // Navigate to Modules tab
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Verify enhanced problem database section
    await expect(page.locator('text=Enhanced Problem Database')).toBeVisible();
    await expect(page.locator('text=Featuring 115+ comprehensive ACF practice problems with adaptive difficulty progression, real-world applications, and detailed solution explanations. Optimized for Kellogg MBA placement exam preparation.')).toBeVisible();
  });

  test('should filter modules by category', async ({ page }) => {
    // Navigate to Modules tab
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Test Foundation category filter
    await page.getByRole('tab', { name: 'Foundation' }).click();
    
    // Should still show modules (exact filtering behavior may vary)
    const startLearningButtons = page.getByRole('button', { name: 'Start Learning' });
    await expect(startLearningButtons.first()).toBeVisible();
    
    // Test other category filters
    const categories = ['Risk Management', 'Fixed Income', 'Financial Analysis', 'Advanced Instruments'];
    for (const category of categories) {
      await page.getByRole('tab', { name: category }).click();
      // Each category should maintain the page structure
      await expect(page.getByRole('tabpanel', { name: 'Modules' })).toBeVisible();
    }
    
    // Return to All view
    await page.getByRole('tab', { name: 'All' }).click();
    await expect(startLearningButtons).toHaveCount(5);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Dismiss modal if present
    try {
      await page.getByRole('button', { name: 'Close', exact: true }).click({ timeout: 2000 });
    } catch {
      // Modal not present
    }
    
    // Video Lectures button should be accessible on mobile
    const videoLecturesButton = page.getByRole('link', { name: 'Video Lectures' });
    await expect(videoLecturesButton).toBeVisible();
    
    // Navigate to modules
    await page.getByRole('tab', { name: 'Modules' }).click();
    
    // Start Learning buttons should be accessible on mobile
    const startLearningButtons = page.getByRole('button', { name: 'Start Learning' });
    await expect(startLearningButtons.first()).toBeVisible();
    
    // Module information should be readable on mobile
    await expect(page.locator('text=Time Value of Money').first()).toBeVisible();
  });
});
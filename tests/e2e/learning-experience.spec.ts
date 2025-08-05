import { test, expect } from '@playwright/test';

test.describe('ACF Learning Experience - Core Educational Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should provide comprehensive learning dashboard with progress tracking', async ({ page }) => {
    // Verify learning dashboard loads with educational content
    await expect(page.locator('text=ACF Mastery')).toBeVisible();
    await expect(page.locator('text=Advanced Corporate Finance Learning Platform')).toBeVisible();
    
    // Check progress tracking elements are present
    await expect(page.locator('text=Your ACF Mastery Journey')).toBeVisible();
    
    // Verify progress metrics are displayed
    const progressElements = [
      page.locator('text=Overall'),
      page.locator('text=Problems'),
      page.locator('text=Modules'),
      page.locator('text=Day Streak')
    ];
    
    for (const element of progressElements) {
      await expect(element).toBeVisible();
    }
    
    // Check that progress numbers are displayed (even if 0 initially)
    await expect(page.locator('text=0%')).toBeVisible(); // Overall progress
    await expect(page.locator('text=1').first()).toBeVisible(); // Day streak should be at least 1
  });

  test('should display comprehensive course topic coverage', async ({ page }) => {
    // Navigate to practice center to see learning topics
    await page.goto('/practice');
    
    // Verify all major ACF topics are available
    const expectedTopics = [
      'Time Value of Money',
      'Portfolio Theory', 
      'Bond Valuation',
      'Financial Statements',
      'Derivatives'
    ];
    
    for (const topic of expectedTopics) {
      await expect(page.locator(`text=${topic}`)).toBeVisible();
    }
    
    // Verify topic details show educational value
    await expect(page.locator('text=Master present value, future value, and annuity calculations')).toBeVisible();
    await expect(page.locator('text=Learn CAPM, risk-return relationships, and modern portfolio optimization')).toBeVisible();
    await expect(page.locator('text=Understand bond pricing, yield calculations, and duration concepts')).toBeVisible();
  });

  test('should provide multiple learning modes and difficulty levels', async ({ page }) => {
    await page.goto('/practice');
    
    // Check that multiple difficulty levels are available
    const difficultyLevels = [
      page.locator('text=Beginner'),
      page.locator('text=Intermediate'), 
      page.locator('text=Advanced')
    ];
    
    let foundDifficulties = 0;
    for (const level of difficultyLevels) {
      if (await level.isVisible()) {
        foundDifficulties++;
      }
    }
    expect(foundDifficulties).toBeGreaterThanOrEqual(2);
    
    // Verify different session lengths are available
    const sessionTypes = [
      page.locator('text=Quick (5)'),
      page.locator('text=Full (10)')
    ];
    
    for (const sessionType of sessionTypes) {
      await expect(sessionType.first()).toBeVisible();
    }
    
    // Check time estimates for educational planning
    const timeEstimates = [
      page.locator('text=120min'),
      page.locator('text=150min'),
      page.locator('text=135min')
    ];
    
    let foundTimeEstimates = 0;
    for (const estimate of timeEstimates) {
      if (await estimate.isVisible()) {
        foundTimeEstimates++;
      }
    }
    expect(foundTimeEstimates).toBeGreaterThanOrEqual(2);
  });

  test('should offer comprehensive diagnostic assessment for learning path customization', async ({ page }) => {
    await page.goto('/practice');
    
    // Navigate to diagnostic test
    await page.click('text=Diagnostic Test');
    
    // Verify comprehensive assessment details
    await expect(page.locator('text=Comprehensive Diagnostic Assessment')).toBeVisible();
    await expect(page.locator('text=25')).toBeVisible(); // 25 questions
    await expect(page.locator('text=30')).toBeVisible(); // 30 minutes
    await expect(page.locator('text=5')).toBeVisible(); // 5 topics
    await expect(page.locator('text=Instant Results')).toBeVisible();
    
    // Check educational value propositions
    const learningBenefits = [
      'Personalized strength and weakness analysis',
      'Topic-specific performance breakdown',
      'Customized study recommendations',
      'Progress tracking baseline'
    ];
    
    for (const benefit of learningBenefits) {
      await expect(page.locator(`text=${benefit}`)).toBeVisible();
    }
  });

  test('should provide AI-powered personalized learning assistance', async ({ page }) => {
    // Test AI tutor functionality
    await page.click('text=AI Tutor');
    
    // Verify AI learning interface opens
    await expect(page.locator('text=AI-Enhanced Learning')).toBeVisible();
    await expect(page.locator('text=Get personalized guidance and explanations for your finance studies')).toBeVisible();
    
    // Check personalization options
    await expect(page.locator('text=Your Level')).toBeVisible();
    const levelDropdown = page.locator('text=Beginner');
    await expect(levelDropdown).toBeVisible();
    
    // Verify question input for specific learning needs
    const questionInput = page.locator('input[placeholder*="Ask a specific question"], textarea[placeholder*="Ask a specific question"]');
    await expect(questionInput).toBeVisible();
    
    // Check AI tutoring features
    await expect(page.locator('text=Get Tutoring')).toBeVisible();
    await expect(page.locator('text=Market Context')).toBeVisible();
  });

  test('should support personalized learning style assessment', async ({ page }) => {
    // Trigger learning style assessment
    await page.click('text=Learning Style');
    
    // Verify assessment interface
    await expect(page.locator('text=Learning Style Assessment')).toBeVisible();
    await expect(page.locator('text=1/8')).toBeVisible(); // Question progress
    
    // Check that learning preference questions are educational
    const learningQuestion = page.locator('text=When learning new financial concepts, I prefer to:');
    await expect(learningQuestion).toBeVisible();
    
    // Verify learning style options cover different educational approaches
    const learningStyles = [
      'See charts, graphs, and visual diagrams',
      'Listen to explanations and discussions', 
      'Work through practice problems hands-on',
      'Read detailed explanations and text'
    ];
    
    for (const style of learningStyles) {
      await expect(page.locator(`text=${style}`)).toBeVisible();
    }
  });

  test('should display learning progress with meaningful educational metrics', async ({ page }) => {
    // Check tabbed learning interface
    const learningTabs = [
      'Dashboard',
      'Modules', 
      'Learning Path',
      'Analytics',
      'Achievements'
    ];
    
    for (const tab of learningTabs) {
      await expect(page.locator(`text=${tab}`)).toBeVisible();
    }
    
    // Test different learning views
    await page.click('text=Modules');
    await page.waitForTimeout(1000);
    
    await page.click('text=Learning Path');
    await page.waitForTimeout(1000);
    
    await page.click('text=Analytics');
    await page.waitForTimeout(1000);
    
    // Return to dashboard
    await page.click('text=Dashboard');
  });

  test('should provide comprehensive practice problem categories with educational context', async ({ page }) => {
    await page.goto('/practice');
    
    // Check different practice modes
    const practiceModes = [
      'Practice Topics',
      'Challenges',
      'Diagnostic Test',
      'Adaptive Mode',
      'Study Notes'
    ];
    
    for (const mode of practiceModes) {
      await expect(page.locator(`text=${mode}`)).toBeVisible();
    }
    
    // Test different practice modes
    for (const mode of practiceModes) {
      await page.click(`text=${mode}`);
      await page.waitForTimeout(1000);
      
      // Verify mode-specific content loads
      const content = page.locator('main, [role="main"], .content');
      await expect(content).toBeVisible();
    }
  });

  test('should handle learning authentication flows appropriately', async ({ page }) => {
    // Test learning section which requires authentication
    await page.goto('/learning');
    
    // Should show authentication requirement
    await expect(page.locator('text=Authentication Required')).toBeVisible();
    await expect(page.locator('text=Please log in to access the learning materials')).toBeVisible();
    
    // Verify login link is provided
    const loginLink = page.locator('a[href*="login"], text=Log In');
    await expect(loginLink).toBeVisible();
    
    // Verify helpful messaging about learning materials
    await expect(page.locator('text=track your progress')).toBeVisible();
  });

  test('should demonstrate responsive learning experience across devices', async ({ page }) => {
    // Test desktop learning experience
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Verify desktop layout accommodates learning content
    await expect(page.locator('text=Practice Center')).toBeVisible();
    await expect(page.locator('text=Video Lectures')).toBeVisible();
    await expect(page.locator('text=AI Tutor')).toBeVisible();
    
    // Test tablet learning experience
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Verify tablet optimization for learning
    await expect(page.locator('text=ACF Mastery')).toBeVisible();
    await expect(page.locator('text=Practice Center')).toBeVisible();
    
    // Test mobile learning experience
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify mobile learning functionality
    await expect(page.locator('text=ACF Mastery')).toBeVisible();
    await expect(page.locator('text=Practice Center')).toBeVisible();
    
    // Test AI tutor on mobile
    await page.click('text=AI Tutor');
    await expect(page.locator('text=AI-Enhanced Learning')).toBeVisible();
  });

  test('should validate comprehensive educational content organization', async ({ page }) => {
    await page.goto('/practice');
    
    // Verify educational content is well-organized
    const topicCards = page.locator('[data-testid*="topic-card"], .topic-card, .practice-topic');
    const cardCount = await topicCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3); // Should have multiple topics
    
    // Check that each topic provides educational value
    const educationalElements = [
      page.locator('text=problems', { hasText: /\d+/ }), // Problem counts
      page.locator('text=min', { hasText: /\d+/ }), // Time estimates
      page.locator('text=Beginner, text=Intermediate, text=Advanced') // Difficulty levels
    ];
    
    for (const element of educationalElements) {
      const elementCount = await element.count();
      expect(elementCount).toBeGreaterThan(0);
    }
    
    // Verify topics have descriptive educational content
    const descriptions = [
      'Master present value',
      'Learn CAPM',
      'Understand bond pricing',
      'Analyze financial statements',
      'Options, futures'
    ];
    
    let foundDescriptions = 0;
    for (const description of descriptions) {
      const element = page.locator(`text=${description}`);
      if (await element.isVisible()) {
        foundDescriptions++;
      }
    }
    expect(foundDescriptions).toBeGreaterThanOrEqual(3);
  });
});
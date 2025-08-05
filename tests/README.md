# E2E Testing Guide for ACF Learning Platform

This directory contains comprehensive end-to-end (E2E) tests for the ACF (Advanced Corporate Finance) learning platform using Playwright.

## 🎯 Test Coverage

### Core Learning & Practice Flows
- **Home Dashboard** (`home-dashboard.spec.ts`)
  - Learning modules overview
  - Progress tracking
  - Navigation between sections
  - AI companion access
  - Mobile responsiveness

- **Practice Session** (`practice-session.spec.ts`)
  - Practice topics and problems
  - Quiz interface
  - Exam simulator
  - Calculator tools
  - Progress tracking
  - Tabbed navigation

- **Learning Modules** (`learning-modules.spec.ts`)
  - Module selection and navigation
  - Enhanced learning content
  - Progress tracking
  - Practice integration
  - Learning style preferences
  - Authentication handling

- **AI Study Companion** (`ai-study-companion.spec.ts`)
  - AI companion interface
  - Chat functionality
  - Personality options
  - Contextual assistance
  - Settings and preferences

- **Complete Learning Flow** (`learning-flow-integration.spec.ts`)
  - End-to-end user journeys
  - Cross-section navigation
  - Error handling
  - Accessibility features
  - Responsive design validation

## 🚀 Running Tests

### Prerequisites
1. Ensure the development server can start: `npm run dev`
2. All dependencies installed: `npm install`
3. Playwright browsers installed: `npx playwright install`

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with debug mode
npm run test:e2e:debug

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# View test report after running
npm run test:e2e:report

# Run specific test file
npx playwright test home-dashboard.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Test Configuration

The tests are configured via `playwright.config.ts`:
- **Base URL**: `http://localhost:5000`
- **Browsers**: Chromium, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Auto-start**: Development server starts automatically
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

## 📱 Test Strategy

### Responsive Testing
All tests include mobile viewport testing to ensure the platform works across devices:
- Desktop: 1280x720
- Mobile: 375x667 (iPhone dimensions)
- Tablet: Various iPad dimensions

### Authentication Handling
Tests gracefully handle both authenticated and non-authenticated states:
- Learning modules may require authentication
- Practice sections are accessible without auth
- AI companion features are tested in both states

### Flexible Selectors
Tests use resilient selectors that work across different UI implementations:
- Text-based selectors for user-facing content
- Data-testid attributes where available
- Semantic HTML selectors (roles, labels)
- Fallback strategies for dynamic content

## 🎯 Test Scenarios

### Critical User Journeys
1. **New User Experience**
   - Landing on home page
   - Exploring learning modules
   - Starting practice problems
   - Accessing AI companion

2. **Learning Session Flow**
   - Module selection
   - Content consumption
   - Practice problem solving
   - Progress tracking

3. **Practice Intensive Session**
   - Topic selection
   - Quiz completion
   - Exam simulation
   - Calculator usage
   - Performance review

4. **AI-Assisted Learning**
   - Companion activation
   - Question asking
   - Contextual help
   - Personality customization

### Edge Cases Covered
- Network interruptions
- Authentication timeouts
- Mobile navigation
- Error page handling
- Accessibility compliance

## 🔧 Troubleshooting

### Common Issues

**Server binding errors on Windows:**
```bash
# If you see ENOTSUP errors, try:
$env:NODE_ENV="development"
$env:PORT="3000"
npx tsx server/index.ts
```

**Tests failing due to slow loading:**
- Increase timeout values in `playwright.config.ts`
- Add `page.waitForTimeout()` for dynamic content
- Use `page.waitForSelector()` for specific elements

**Authentication-related failures:**
- Tests handle both auth-required and open access scenarios
- Skip learning module tests if authentication wall is present
- Focus on practice flows which are generally accessible

### Test Debugging

1. **Run in headed mode** to see what's happening:
   ```bash
   npm run test:e2e:headed
   ```

2. **Use debug mode** for step-by-step execution:
   ```bash
   npm run test:e2e:debug
   ```

3. **Check screenshots and videos** in `test-results/` after failures

4. **Use Playwright Inspector**:
   ```bash
   npx playwright test --debug
   ```

## 📊 Test Reports

After running tests, view detailed reports:
```bash
npm run test:e2e:report
```

Reports include:
- Test execution summary
- Screenshots of failures
- Video recordings
- Performance metrics
- Cross-browser compatibility results

## 🎯 Adding New Tests

### Test File Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/relevant-page');
  });

  test('should test specific behavior', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices
1. **Use descriptive test names**
2. **Handle authentication states gracefully**
3. **Include mobile testing**
4. **Use flexible selectors**
5. **Add appropriate waits for dynamic content**
6. **Test error scenarios**
7. **Verify accessibility features**

### Selector Strategy
```typescript
// Preferred order of selectors:
1. Text content: page.locator('text=Button Text')
2. Data attributes: page.locator('[data-testid="submit-btn"]')
3. Semantic HTML: page.locator('[role="button"]')
4. CSS classes: page.locator('.submit-button')
5. Complex selectors as last resort
```

## 📈 Continuous Integration

Tests are configured to run in CI environments:
- **Parallel execution** disabled on CI for stability
- **Retries enabled** for flaky test resilience
- **Screenshots and videos** captured for debugging
- **Multiple browser testing** for compatibility

### Environment Variables
- `CI=true` - Enables CI-specific configurations
- `NODE_ENV=development` - Required for dev server
- `PORT=5000` - Default application port

## 🤝 Contributing

When adding new features:
1. Add corresponding E2E tests
2. Update this README if needed
3. Ensure tests pass on multiple browsers
4. Include mobile testing scenarios
5. Handle authentication gracefully

For questions or issues with testing, check:
1. Playwright documentation: https://playwright.dev/
2. Test output and screenshots
3. Development server logs
4. Browser developer tools during headed runs
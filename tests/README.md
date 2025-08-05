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

- **Setup Validation** (`setup-validation.spec.ts`)
  - Application initialization
  - Configuration validation
  - Error scenario handling
  - Environment compatibility checks

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

### Test Isolation
Each test runs in isolation to prevent interdependencies:
- Clean state at the beginning of each test
- Proper teardown after test completion
- No shared state between tests
- Independent fixture setup for each test case

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
- Browser compatibility issues
- Slow network connections
- Session expiration

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

**Flaky tests:**
- Use `test.retry()` for specific flaky tests
- Add more specific waitFor conditions
- Consider using test.slow() for complex interactions
- Check network conditions and server stability

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

5. **Trace Viewer** for detailed step inspection:
   ```bash
   npx playwright show-trace test-results/trace.zip
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
- Console logs and errors
- Network request details

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
8. **Keep tests independent and isolated**
9. **Avoid fixed timeouts where possible**
10. **Use page object models for complex UIs**

### Selector Strategy
```typescript
// Preferred order of selectors:
1. Text content: page.locator('text=Button Text')
2. Data attributes: page.locator('[data-testid="submit-btn"]')
3. Semantic HTML: page.locator('[role="button"]')
4. CSS classes: page.locator('.submit-button')
5. Complex selectors as last resort
```

### Page Object Model Example
```typescript
// models/HomePage.ts
export class HomePage {
  constructor(private page) {}
  
  async navigate() {
    await this.page.goto('/');
  }
  
  async clickLearnModule(moduleName) {
    await this.page.locator(`[data-module="${moduleName}"]`).click();
  }
}

// In test:
const homePage = new HomePage(page);
await homePage.navigate();
await homePage.clickLearnModule('corporate-finance');
```

## 📈 Continuous Integration

Tests are configured to run in CI environments:
- **Parallel execution** disabled on CI for stability
- **Retries enabled** for flaky test resilience
- **Screenshots and videos** captured for debugging
- **Multiple browser testing** for compatibility
- **Detailed reporting** for failure analysis

### Environment Variables
- `CI=true` - Enables CI-specific configurations
- `NODE_ENV=development` - Required for dev server
- `PORT=5000` - Default application port
- `PLAYWRIGHT_HTML_REPORT` - Custom report location

### GitHub Actions Integration
```yaml
# Example workflow snippet
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
    with:
      node-version: 18
  - name: Install dependencies
    run: npm ci
  - name: Install Playwright browsers
    run: npx playwright install --with-deps
  - name: Run Playwright tests
    run: npm run test:e2e
  - name: Upload test results
    if: always()
    uses: actions/upload-artifact@v3
    with:
      name: playwright-report
      path: playwright-report/
```

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

## 🔄 Maintenance

Regular maintenance helps keep tests reliable:
1. **Review and update tests** with each feature change
2. **Refactor common patterns** into helper functions
3. **Run tests regularly**, not just during deployment
4. **Monitor test performance** and execution times
5. **Revisit selectors** when UI changes occur
6. **Update expected screenshots** when design changes

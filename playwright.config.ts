import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * ACF Learning Platform E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['html', { outputFolder: 'playwright-report' }], ['json', { outputFile: 'test-results/results.json' }]] 
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:5000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'on' : 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',

    /* Default timeout for all actions */
    actionTimeout: 15000,

    /* Default timeout for navigation operations */
    navigationTimeout: 30000,

    /* Add custom attributes to tests for better debugging and filtering */
    testIdAttribute: 'data-testid',

    /* Enable accessibility checks */
    contextOptions: {
      reducedMotion: 'reduce',
      strictSelectors: true,
    },

    /* Add custom headers to all requests */
    extraHTTPHeaders: {
      'X-Test-Environment': 'playwright',
      'X-Test-Run-ID': `${process.env.CI ? 'ci' : 'local'}-${Date.now()}`,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    /* Setup project for global setup/teardown */
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },

    /* Tablet testing */
    {
      name: 'iPad',
      use: { ...devices['iPad (gen 7)'] },
      dependencies: ['setup'],
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    //   dependencies: ['setup'],
    // },

    /* Accessibility testing project */
    {
      name: 'accessibility',
      testMatch: /.*\.accessibility\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  /* Folder for test artifacts like screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Maximum time in milliseconds the whole test suite can run */
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,

  /* Configure global timeout per test */
  timeout: 60000,

  /* Run your local dev server before starting the tests */
  // Note: If webServer auto-start fails on Windows, manually start with:
  // Set-Location "your-project-path"; $env:NODE_ENV="development"; $env:PORT="5000"; npx tsx server/index.ts
  webServer: process.env.MANUAL_SERVER ? undefined : {
    command: process.platform === 'win32' 
      ? 'powershell -Command "$env:NODE_ENV=\'development\'; $env:PORT=\'5000\'; npx tsx server/index.ts"'
      : 'NODE_ENV=development PORT=5000 npx tsx server/index.ts',
    url: process.env.BASE_URL || 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'development',
      PORT: '5000',
      TEST_ENV: 'true',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Ignore specific HTML elements when taking screenshots */
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: 'disabled',
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
});

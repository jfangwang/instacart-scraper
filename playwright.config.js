// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src',
  timeout: 800000 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  fullyParallel: true,
  globalSetup: process.env.CI && './tests/auth.setup.js',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: '75%',
  reporter: [[process.env.CI ? 'dot' : 'list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    headless: false,
    baseURL: 'https://www.instacart.com/store/?categoryFilter=homeTabForYou',
    storageState: 'playwright/.auth/user.json',
    ignoreHTTPSErrors: false,
  },

  /* Configure projects for major browsers */
  // projects: [
  //   // Setup project
  //   { name: 'setup', testMatch: /.*\.setup\.js/ },
  //   {
  //     name: 'Chrome',
  //     use: {
  //       ...devices['Desktop Chrome'],
  //     },
  //     dependencies: ['setup'],
  //   }
  // ],
});


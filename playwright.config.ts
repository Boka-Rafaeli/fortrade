import { defineConfig } from '@playwright/test';
import { loadEnvConfig } from './src/helpers/env';

// Load environment configuration
// Default to 'stage' since 'dev' is not used in this project
const env = (process.env.ENV as 'dev' | 'stage' | 'prod') || 'stage';
const config = loadEnvConfig(env);

/**
 * Main Playwright configuration for E2E tests
 * Uses environment-specific settings based on ENV variable
 * 
 * Usage:
 * - ENV=stage npm test (default)
 * - ENV=prod npm test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2, // Retry failed tests 2 times for both CI and local
  workers: process.env.CI ? 1 : undefined,
  
  // Timeouts
  timeout: 60000, // Test timeout: 60 seconds for E2E tests
  expect: {
    timeout: 10000, // Expect timeout: 10 seconds
  },
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: config.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Run in headed mode locally, headless in CI
    headless: !!process.env.CI,
    // Navigation timeout: 30 seconds
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        // Browser config can be extended per environment if needed
      },
    },
  ],
});

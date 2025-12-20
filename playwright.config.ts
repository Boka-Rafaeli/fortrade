import { defineConfig } from '@playwright/test';
import { loadEnvConfig } from './src/helpers/env';

// Load environment configuration
// Default to 'stage' since 'dev' is not used for fortrade project
const env = (process.env.ENV as 'dev' | 'stage' | 'prod') || 'stage';
const config = loadEnvConfig(env);

/**
 * Main Playwright configuration for fortrade E2E tests
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
  timeout: 6000, // Test timeout: 6000ms
  expect: {
    timeout: 5000, // Expect timeout: 5000ms
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
    // Navigation timeout: 10000ms
    navigationTimeout: 10000,
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

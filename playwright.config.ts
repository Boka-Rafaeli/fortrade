import { defineConfig } from '@playwright/test';
import { loadEnvConfig } from './src/helpers/env';

// Load environment configuration
const env = (process.env.ENV as 'dev' | 'stage' | 'prod') || 'dev';
const config = loadEnvConfig(env);

/**
 * Main Playwright configuration
 * Uses environment-specific settings based on ENV variable
 * 
 * Usage:
 * - ENV=dev npm test (default)
 * - ENV=stage npm test
 * - ENV=prod npm test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: config.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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

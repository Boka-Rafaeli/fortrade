import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import { loadEnvConfig } from '../../helpers/env';

const env = (process.env.ENV as 'dev' | 'stage' | 'prod') || 'dev';
const config = loadEnvConfig(env);

/**
 * Base Playwright configuration
 * Environment-specific configs extend this
 */
export const baseConfig: Partial<PlaywrightTestConfig> = {
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: config.baseURL,
    trace: 'on-first-retry' as const,
    screenshot: 'only-on-failure' as const,
    video: 'retain-on-failure' as const,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};


import { defineConfig } from '@playwright/test';
import { baseConfig } from './playwright.config.base';

/**
 * Production environment configuration
 */
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    // Add prod-specific overrides here
  },
});


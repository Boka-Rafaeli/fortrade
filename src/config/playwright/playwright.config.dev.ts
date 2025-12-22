import { defineConfig } from '@playwright/test';
import { baseConfig } from './playwright.config.base';

/**
 * Development environment configuration
 */
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    // Add dev-specific overrides here
  },
});


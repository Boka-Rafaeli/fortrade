import { defineConfig } from '@playwright/test';
import { baseConfig } from './playwright.config.base';

/**
 * Stage environment configuration
 */
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    // Add stage-specific overrides here
  },
});


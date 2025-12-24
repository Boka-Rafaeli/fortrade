import { test as base } from '@playwright/test';
import { App } from '../../src/app/App';
import { AuthHelper } from '../../src/helpers/authHelper';
import { ApiClient } from '../../src/helpers/apiClient';

/**
 * Custom test fixtures
 * Extends Playwright's base test with our App and helpers
 */
type TestFixtures = {
  app: App;
  authHelper: AuthHelper;
  apiClient: ApiClient;
};

export const test = base.extend<TestFixtures>({

  app: async ({ page, context }, use) => {
    const app = new App(page, context);
    await use(app);
  },

  authHelper: async ({ request }, use) => {
    const authHelper = new AuthHelper(request);
    await use(authHelper);
  },

  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },
});

export { expect } from '@playwright/test';


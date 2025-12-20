import { test as base, APIRequestContext } from '@playwright/test';
import { App } from '../../src/app/App';
import { AuthHelper } from '../../src/helpers/authHelper';
import { ApiClient } from '../../src/helpers/apiClient';

/**
 * Custom test fixtures
 * Extends Playwright's base test with our App and helpers
 * 
 * Note: Uses page.request instead of request fixture to support API mocks via route interception
 */
type TestFixtures = {
  app: App;
  authHelper: AuthHelper;
  apiClient: ApiClient;
  // Override request to use page.request for mock support
  request: APIRequestContext;
};

export const test = base.extend<TestFixtures>({
  // Override request fixture to use page.request (supports route interception for mocks)
  request: async ({ page }, use) => {
    // Use page.request which supports route interception for mocks
    // page.request and APIRequestContext have compatible interfaces
    await use(page.request as APIRequestContext);
  },

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


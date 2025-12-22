import { test as base, APIRequestContext } from '@playwright/test';
import { App } from '../../src/app/App';
import { AuthHelper } from '../../src/helpers/authHelper';
import { ApiClient } from '../../src/helpers/apiClient';
import { NetworkRecorder } from '../../src/helpers/networkRecorder';
import { allure } from 'allure-playwright';

/**
 * Custom test fixtures
 * Extends Playwright's base test with our App and helpers
 */
type TestFixtures = {
  app: App;
  authHelper: AuthHelper;
  apiClient: ApiClient;
  networkRecorder: NetworkRecorder;
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

  networkRecorder: async ({ page }, use, testInfo) => {
    // Generate unique test ID from test title and worker index
    const testId = `${testInfo.title.replace(/\s+/g, '_')}_${testInfo.workerIndex}_${Date.now()}`;
    const recorder = new NetworkRecorder(page, testId);
    
    // Start recording before test
    recorder.start();
    
    await use(recorder);
    
    // Stop recording and attach to Allure after test
    await recorder.stop();
    
    if (recorder.hasData()) {
      const data = recorder.getData();
      await allure.attachment(
        'XHR Network Log',
        JSON.stringify(data, null, 2),
        { contentType: 'application/json' }
      );
    }
  },
});

export { expect } from '@playwright/test';


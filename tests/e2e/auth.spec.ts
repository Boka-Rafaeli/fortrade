import { test, expect } from '../fixtures/testFixtures';
import { setupTestUser } from '../api/setup';
import { setupApiMocks } from '../api/mocks';
import { AuthFlow } from '../../src/flows/auth/AuthFlow';
import { Logger } from '../../src/helpers/logger';

/**
 * Example hybrid test: API setup + UI validation
 * 
 * Structure:
 * 1. API Setup (Arrange) - Create test data via API (mocked if no real API available)
 * 2. UI Execution (Act) - Navigate and interact via UI
 * 3. Cleanup (Optional) - Clean up test data
 * 
 * Each test is isolated and can run in parallel
 */
test.describe('Authentication', () => {
  // Setup API mocks before all tests in this suite (only if USE_API_MOCKS is enabled)
  test.beforeEach(async ({ page }) => {
    const useApiMocks = process.env.USE_API_MOCKS === 'true';
    if (useApiMocks) {
      Logger.info('Using API mocks (USE_API_MOCKS=true)');
      await setupApiMocks(page);
    } else {
      Logger.info('Using real API (USE_API_MOCKS=false or not set)');
    }
  });

  test('should login successfully with API-created user', async ({ app, authHelper, request }) => {
    // ========== API SETUP (Arrange) ==========
    Logger.info('Starting API setup');
    const { context, cleanup } = await setupTestUser(request);
    
    try {
      // ========== UI EXECUTION (Act) ==========
      Logger.info('Starting UI validation');
      
      // Use Flow for business logic
      const authFlow = new AuthFlow(app);
      await authFlow.loginAndVerifyHome(context.user.email, context.user.password);
      
      // Additional UI assertions
      await expect(app.page).toHaveURL(/\/home/);
      
      Logger.info('Test completed successfully');
    } finally {
      // ========== CLEANUP ==========
      if (cleanup) {
        await cleanup();
      }
    }
  });

  test('should logout successfully', async ({ app, request }) => {
    // API Setup
    const { context, cleanup } = await setupTestUser(request);
    
    try {
      // UI: Login first
      const authFlow = new AuthFlow(app);
      await authFlow.login(context.user.email, context.user.password);
      
      // UI: Logout
      await authFlow.logout();
      
      // Verify logout
      await expect(app.page).toHaveURL(/\/login/);
    } finally {
      if (cleanup) {
        await cleanup();
      }
    }
  });
});


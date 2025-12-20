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
  // Setup API mocks before all tests in this suite
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
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


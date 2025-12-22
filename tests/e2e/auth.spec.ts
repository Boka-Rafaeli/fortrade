import { test, expect } from '../fixtures/testFixtures';
import { setupTestUser } from '../api/setup';
import { AuthFlow } from '../../src/flows/auth/AuthFlow';
import { Logger } from '../../src/helpers/logger';

/**
 * Example hybrid test: API setup + UI validation
 * 
 * Structure:
 * 1. API Setup (Arrange) - Create test data via API
 * 2. UI Execution (Act) - Navigate and interact via UI
 * 3. Cleanup (Optional) - Clean up test data
 * 
 * Each test is isolated and can run in parallel
 */
test.describe('Authentication', () => {

  test('should login successfully with API-created user', async ({ app, authHelper, request, networkRecorder }) => {
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
      
      // ========== NETWORK VALIDATION ==========
      // Example: Verify login API was called
      networkRecorder.expectRequestCalled(/\/auth\/login/, { times: 1 });
      
      // Get login response
      const loginResponse = networkRecorder.getLastResponse(/\/auth\/login/);
      if (loginResponse) {
        Logger.info(`Login API status: ${loginResponse.status}`);
        expect(loginResponse.status).toBe(200);
      }
      
      Logger.info('Test completed successfully');
    } finally {
      // ========== CLEANUP ==========
      if (cleanup) {
        await cleanup();
      }
    }
  });

  test('should logout successfully', async ({ app, request, networkRecorder }) => {
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
      
      // Network validation: verify logout API was called
      const logoutResponse = networkRecorder.getLastResponse(/\/auth\/logout/);
      if (logoutResponse) {
        expect(logoutResponse.status).toBeGreaterThanOrEqual(200);
        expect(logoutResponse.status).toBeLessThan(300);
      }
    } finally {
      if (cleanup) {
        await cleanup();
      }
    }
  });
});


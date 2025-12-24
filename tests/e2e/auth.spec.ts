import { test, expect } from '../fixtures/testFixtures';
import { AuthFlow } from '../../src/flows/auth/AuthFlow';

/**
 * UI-only E2E tests for authentication
 * 
 * Structure:
 * 1. UI Execution (Act) - Navigate and interact via UI
 * 2. Assertions - Verify UI state and behavior
 * 
 * Each test is isolated and can run in parallel
 */
test.describe('Authentication', () => {

  test('should login successfully', async ({ app }) => {
    // Use Flow for business logic
    const authFlow = new AuthFlow(app);
    
    // Login with test credentials
    await authFlow.loginAndVerifyHome('vasyalibaba@gmail.com', 'Lr~7opKJ8');
    
    // Verify navigation to home page
    await expect(app.page).toHaveURL(/\/home/);
  });

  test('should logout successfully', async ({ app }) => {
    // Login first
    const authFlow = new AuthFlow(app);
    await authFlow.login('vasyalibaba@gmail.com', 'Lr~7opKJ8');
    
    // Logout
    await authFlow.logout();
    
    // Verify navigation to login page
    await expect(app.page).toHaveURL(/\/login/);
  });
});


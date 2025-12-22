import { APIRequestContext } from '@playwright/test';
import { AuthHelper } from '../../src/helpers/authHelper';
import { ApiClient } from '../../src/helpers/apiClient';
import { DataBuilder } from '../../src/helpers/dataBuilder';
import { ITestContext, IApiSetupResult } from '../models/types';
import { Logger } from '../../src/helpers/logger';

/**
 * API setup utilities for test preparation
 * Each test should call these functions to create isolated test data
 */

/**
 * Setup test user and authentication context
 * Returns context with user data and auth token
 */
export async function setupTestUser(
  request: APIRequestContext,
  userData?: Partial<{ email: string; username: string; password: string }>
): Promise<IApiSetupResult> {
  const authHelper = new AuthHelper(request);
  
  // Generate unique test user data
  const testUserData = DataBuilder.buildUser(userData);
  
  Logger.info(`Setting up test user: ${testUserData.email}`);
  
  // Create and authenticate user
  const authContext = await authHelper.createAndAuthenticateUser(testUserData);
  
  const context: ITestContext = {
    user: {
      ...authContext.user,
      id: authContext.user.id || '',
      username: authContext.user.username || testUserData.username,
    },
    authToken: authContext.token,
  };

  // Optional cleanup function
  const cleanup = async () => {
    try {
      const apiClient = new ApiClient(request);
      if (context.user.id) {
        Logger.info(`Cleaning up test user: ${context.user.id}`);
        await apiClient.delete(`/users/${context.user.id}`);
      }
    } catch (error) {
      Logger.warn('Cleanup failed (non-critical)', error as Error);
    }
  };

  return {
    context,
    cleanup,
  };
}

/**
 * Setup test data (e.g., entities, resources)
 * Extend this function based on your application needs
 */
export async function setupTestData(
  request: APIRequestContext,
  authToken?: string,
  data?: Record<string, any>
): Promise<Record<string, any>> {
  const apiClient = new ApiClient(request);
  
  if (authToken) {
    apiClient.setAuthToken(authToken);
  }

  // Example: Create test entities
  // Adjust based on your API structure
  const testData: Record<string, any> = {};

  Logger.info('Test data setup completed');
  
  return testData;
}


import { Page, Route, APIRequestContext } from '@playwright/test';
import { Logger } from '../../src/helpers/logger';

/**
 * API mocks for testing without real backend
 * Uses Playwright route interception to mock API responses
 * 
 * Note: For APIRequestContext requests, use setupApiRequestMocks instead
 */

export interface IMockUser {
  id: string;
  email: string;
  username: string;
  password?: string;
}

export interface IMockAuthResponse {
  token: string;
  user?: IMockUser;
}

/**
 * Setup API mocks for page requests (page.request)
 * These mocks work for requests made through page.request
 */
export async function setupApiMocks(page: Page): Promise<void> {
  Logger.info('Setting up API mocks for page requests');

  // Mock POST /api/users - user creation
  await page.route('**/api/users', async (route: Route) => {
    if (route.request().method() === 'POST') {
      const requestBody = route.request().postDataJSON();
      const mockUser: IMockUser = {
        id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        email: requestBody.email,
        username: requestBody.username || requestBody.email.split('@')[0],
      };

      Logger.debug(`Mock: Creating user ${mockUser.email}`);
      
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    } else {
      await route.continue();
    }
  });

  // Mock POST /api/auth/login - authentication
  await page.route('**/api/auth/login', async (route: Route) => {
    if (route.request().method() === 'POST') {
      const requestBody = route.request().postDataJSON();
      const mockResponse: IMockAuthResponse = {
        token: `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user: {
          id: `mock_${Date.now()}`,
          email: requestBody.email,
          username: requestBody.email.split('@')[0],
        },
      };

      Logger.debug(`Mock: Authenticating user ${requestBody.email}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    } else {
      await route.continue();
    }
  });

  // Mock DELETE /api/users/* - user deletion
  await page.route('**/api/users/*', async (route: Route) => {
    if (route.request().method() === 'DELETE') {
      Logger.debug(`Mock: Deleting user`);
      
      await route.fulfill({
        status: 204,
      });
    } else {
      await route.continue();
    }
  });
}


/**
 * Remove all API mocks
 */
export async function removeApiMocks(page: Page): Promise<void> {
  await page.unroute('**/api/**');
  Logger.info('API mocks removed');
}


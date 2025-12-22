import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './apiClient';
import { Logger } from './logger';

export interface IUser {
  id?: string;
  email: string;
  password: string;
  username?: string;
  [key: string]: any;
}

export interface IAuthContext {
  user: IUser;
  token?: string;
  cookies?: any[];
  storageState?: any;
}

/**
 * Authentication helper for test setup
 * Handles user creation, authentication, and session management
 */
export class AuthHelper {
  private readonly apiClient: ApiClient;

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request);
  }

  /**
   * Create a test user via API
   * Returns user data with generated unique identifier
   */
  async createTestUser(userData: Partial<IUser>): Promise<IUser> {
    const uniqueId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user: IUser = {
      email: userData.email || `${uniqueId}@test.com`,
      password: userData.password || 'TestPassword123!',
      username: userData.username || `user_${uniqueId}`,
      ...userData,
    };

    Logger.info(`Creating test user: ${user.email}`);
    
    // Example API call - adjust endpoint and payload structure as needed
    const response = await this.apiClient.post('/users', user);
    
    if (!response.ok()) {
      throw new Error(`Failed to create test user: ${response.status()}`);
    }

    const createdUser = await response.json();
    Logger.info(`Test user created: ${createdUser.id || createdUser.email}`);
    
    return { ...user, ...createdUser };
  }

  /**
   * Authenticate user and get token/storage state
   */
  async authenticate(user: IUser): Promise<IAuthContext> {
    Logger.info(`Authenticating user: ${user.email}`);
    
    // Example authentication - adjust endpoint and payload as needed
    const response = await this.apiClient.post('/auth/login', {
      email: user.email,
      password: user.password,
    });

    if (!response.ok()) {
      throw new Error(`Authentication failed: ${response.status()}`);
    }

    const authData = await response.json();
    const token = authData.token || authData.accessToken;

    return {
      user,
      token,
      // Add cookies/storageState if your API returns them
    };
  }

  /**
   * Create user and authenticate in one call
   */
  async createAndAuthenticateUser(userData?: Partial<IUser>): Promise<IAuthContext> {
    const user = await this.createTestUser(userData || {});
    return await this.authenticate(user);
  }
}


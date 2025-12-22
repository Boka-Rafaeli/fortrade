import { APIRequestContext, APIResponse } from '@playwright/test';
import { getEnvConfig } from './env';
import { Logger } from './logger';

/**
 * API Client for test setup and data preparation
 * Used for hybrid test approach: API setup + UI validation
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly config = getEnvConfig();

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Make a GET request
   */
  async get(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`GET ${url}`);
    return await this.request.get(url, { headers: options?.headers });
  }

  /**
   * Make a POST request
   */
  async post(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`POST ${url}`);
    return await this.request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Make a PUT request
   */
  async put(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`PUT ${url}`);
    return await this.request.put(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`DELETE ${url}`);
    return await this.request.delete(url, { headers: options?.headers });
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    // This can be extended to store token and use in default headers
    Logger.debug('Auth token set');
  }
}


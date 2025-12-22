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
  private authToken?: string;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Get default headers with authentication
   */
  private getDefaultHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...customHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Handle API response errors
   */
  private async handleResponse(response: APIResponse, method: string, url: string): Promise<APIResponse> {
    if (!response.ok()) {
      let errorBody: string = '';
      try {
        errorBody = await response.text();
      } catch {
        // Ignore errors reading error body
      }
      
      Logger.error(
        `API ${method} ${url} failed with status ${response.status()}`,
        new Error(errorBody || 'Unknown error')
      );
      
      throw new Error(
        `API ${method} ${url} failed: ${response.status()} ${response.statusText()}. ${errorBody}`
      );
    }
    
    return response;
  }

  /**
   * Make a GET request
   */
  async get(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`GET ${url}`);
    
    try {
      const headers = this.getDefaultHeaders(options?.headers);
      const response = await this.request.get(url, { headers });
      return await this.handleResponse(response, 'GET', url);
    } catch (error) {
      Logger.error(`Failed to execute GET ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`POST ${url}`);
    
    try {
      const headers = this.getDefaultHeaders({
        'Content-Type': 'application/json',
        ...options?.headers,
      });
      const response = await this.request.post(url, {
        data,
        headers,
      });
      return await this.handleResponse(response, 'POST', url);
    } catch (error) {
      Logger.error(`Failed to execute POST ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  async put(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`PUT ${url}`);
    
    try {
      const headers = this.getDefaultHeaders({
        'Content-Type': 'application/json',
        ...options?.headers,
      });
      const response = await this.request.put(url, {
        data,
        headers,
      });
      return await this.handleResponse(response, 'PUT', url);
    } catch (error) {
      Logger.error(`Failed to execute PUT ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = `${this.config.apiBaseURL}${endpoint}`;
    Logger.debug(`DELETE ${url}`);
    
    try {
      const headers = this.getDefaultHeaders(options?.headers);
      const response = await this.request.delete(url, { headers });
      return await this.handleResponse(response, 'DELETE', url);
    } catch (error) {
      Logger.error(`Failed to execute DELETE ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    Logger.debug('Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
    Logger.debug('Auth token cleared');
  }
}


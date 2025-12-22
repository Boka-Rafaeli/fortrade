import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../src/helpers/apiClient';

/**
 * API client instances for different services
 * Can be extended with service-specific clients
 */

export function createApiClient(request: APIRequestContext): ApiClient {
  return new ApiClient(request);
}


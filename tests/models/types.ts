/**
 * Shared types and interfaces for tests
 */

export interface ITestContext {
  user: {
    id: string;
    email: string;
    username: string;
    [key: string]: any;
  };
  authToken?: string;
  testData?: Record<string, any>;
}

export interface IApiSetupResult {
  context: ITestContext;
  cleanup?: () => Promise<void>;
}


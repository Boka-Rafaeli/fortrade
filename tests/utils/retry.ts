import { Logger } from '../../src/helpers/logger';

/**
 * Retry utility for flaky operations
 * Use sparingly - prefer Playwright's built-in auto-waiting
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number; onRetry?: (attempt: number) => void } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, onRetry } = options;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        Logger.warn(`Attempt ${attempt} failed, retrying...`);
        if (onRetry) {
          onRetry(attempt);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}


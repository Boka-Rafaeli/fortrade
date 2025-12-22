import { Logger } from '../../src/helpers/logger';

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry utility for unstable operations
 */
export class Retry {
  /**
   * Execute function with retry logic
   */
  static async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delayMs = 1000,
      backoffMultiplier = 2,
      onRetry,
    } = options;

    let lastError: Error | undefined;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          Logger.error(`Retry failed after ${maxAttempts} attempts`, lastError);
          throw lastError;
        }

        if (onRetry) {
          onRetry(attempt, lastError);
        }

        Logger.warn(`Retry attempt ${attempt}/${maxAttempts} failed, retrying in ${currentDelay}ms...`);
        await this.delay(currentDelay);
        currentDelay *= backoffMultiplier;
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Delay execution
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Logger utility for test execution
 * Uses console methods but formatted for better readability
 * In test context, consider using test.info() for Playwright-native logging
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * Log informational message
   * In test context, prefer: test.info(message)
   */
  static info(message: string): void {
    // Using console.log as Playwright doesn't have a global logger
    // In test context, use test.info() instead
    console.log(this.formatMessage('INFO', message));
  }

  /**
   * Log warning message
   */
  static warn(message: string, error?: Error): void {
    console.warn(this.formatMessage('WARN', message));
    if (error) {
      console.warn(error);
    }
  }

  /**
   * Log error message
   */
  static error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error);
    }
  }

  /**
   * Log debug message (only if DEBUG env var is set to 'true')
   */
  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.log(this.formatMessage('DEBUG', message));
    }
  }
}


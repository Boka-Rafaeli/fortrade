/**
 * Simple logger utility for test execution
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  static warn(message: string, error?: Error): void {
    console.warn(this.formatMessage('WARN', message));
    if (error) {
      console.warn(error);
    }
  }

  static error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error);
    }
  }

  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.log(this.formatMessage('DEBUG', message));
    }
  }
}


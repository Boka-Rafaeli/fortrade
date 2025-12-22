/**
 * Data builder utility for generating test data
 * Ensures unique data per test for parallel execution
 */
export class DataBuilder {
  /**
   * Generate unique identifier
   */
  static generateUniqueId(prefix: string = 'test'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Generate unique email
   */
  static generateEmail(domain: string = 'test.com'): string {
    return `${this.generateUniqueId('user')}@${domain}`;
  }

  /**
   * Generate unique username
   */
  static generateUsername(prefix: string = 'user'): string {
    return `${prefix}_${this.generateUniqueId()}`;
  }

  /**
   * Generate test user data
   */
  static buildUser(overrides?: Partial<{ email: string; username: string; password: string }>): {
    email: string;
    username: string;
    password: string;
  } {
    return {
      email: overrides?.email || this.generateEmail(),
      username: overrides?.username || this.generateUsername(),
      password: overrides?.password || 'TestPassword123!',
    };
  }
}


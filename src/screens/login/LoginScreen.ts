import { Page } from '@playwright/test';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { step } from '../../helpers/decorators';

/**
 * Login Screen - Example screen implementation
 * Composes components and provides screen-level actions
 * 
 * Rules:
 * - NO direct locator calls (only via components)
 * - Coordinates multiple components
 * - Provides business-level actions
 */
export class LoginScreen {
  private readonly page: Page;
  private readonly usernameInput: Input;
  private readonly passwordInput: Input;
  private readonly submitButton: Button;

  constructor(page: Page) {
    this.page = page;
    // Initialize components - adjust selectors based on your app
    this.usernameInput = new Input(page, undefined, '[data-testid="username-input"]');
    this.passwordInput = new Input(page, undefined, '[data-testid="password-input"]');
    this.submitButton = new Button(page, undefined, '[data-testid="login-button"]');
  }

  @step('Navigate to login page')
  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  @step('Login with credentials')
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    // Wait for navigation after login
    await this.page.waitForURL(/\/(dashboard|home)/, { timeout: 10000 });
  }

  @step('Verify login screen is displayed')
  async shouldBeVisible(): Promise<void> {
    await this.usernameInput.shouldBeVisible();
    await this.passwordInput.shouldBeVisible();
    await this.submitButton.shouldBeVisible();
  }
}


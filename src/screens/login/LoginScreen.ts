import { Page } from '@playwright/test';
import { Input, Button } from '../../core/browser-elements';
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
    // Initialize components - using data-test-id selectors from the page
    // Email input: using data-test-id attribute (most stable selector)
    this.usernameInput = new Input(page, undefined, '[data-test-id="input-identifier"]');
    // Password input: using data-test-id attribute (most stable selector)
    this.passwordInput = new Input(page, undefined, '[data-test-id="input-password"]');
    // Submit button: using button with "Log In" text
    this.submitButton = new Button(page, undefined, 'button:has-text("Log In")');
  }

  @step('Navigate to login page')
  async navigate(): Promise<void> {
    await this.page.goto('/#login');
    await this.page.waitForLoadState('networkidle');
  }

  @step('Login with credentials')
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    // Wait for navigation after login (supports both hash routing #home and path routing /home)
    await this.page.waitForURL(/#(home|dashboard)|\/(home|dashboard)/, { timeout: 30000 });
  }

  @step('Verify login screen is displayed')
  async shouldBeVisible(): Promise<void> {
    await this.usernameInput.shouldBeVisible();
    await this.passwordInput.shouldBeVisible();
    await this.submitButton.shouldBeVisible();
  }
}


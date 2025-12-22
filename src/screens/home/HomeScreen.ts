import { Page, expect } from '@playwright/test';
import { Button } from '../../components/common/Button';
import { step } from '../../helpers/decorators';

/**
 * Home Screen - Example screen implementation
 */
export class HomeScreen {
  private readonly page: Page;
  private readonly logoutButton: Button;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = new Button(page, undefined, '[data-testid="logout-button"]');
  }

  @step('Navigate to home page')
  async navigate(): Promise<void> {
    await this.page.goto('/home');
    await this.page.waitForLoadState('networkidle');
  }

  @step('Verify user is logged in')
  async verifyLoggedIn(username?: string): Promise<void> {
    // Example: verify user info is displayed
    if (username) {
      await expect(this.page.getByText(username)).toBeVisible();
    }
    await this.logoutButton.shouldBeVisible();
  }

  @step('Logout')
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 5000 });
  }
}


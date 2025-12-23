import { Page } from '@playwright/test';
import { Button, Text } from '../../core/browser-elements';
import { step } from '../../helpers/decorators';

/**
 * Home Screen - Example screen implementation
 */
export class HomeScreen {
  private readonly page: Page;
  private readonly logoutButton: Button;
  private readonly userInfoText: Text;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = new Button(page, undefined, '[data-testid="logout-button"]');
    this.userInfoText = new Text(page, undefined);
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
      await this.userInfoText.shouldContainText(username);
    }
    await this.logoutButton.shouldBeVisible();
  }

  @step('Logout')
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 5000 });
  }
}


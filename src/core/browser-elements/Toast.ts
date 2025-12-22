import { Page, Locator, expect } from '@playwright/test';
import { BaseBrowserElement } from './BaseBrowserElement';
import { step } from '../../helpers/decorators';

/**
 * Reusable Toast/Notification browser element
 */
export class Toast extends BaseBrowserElement {
  private readonly toastLocator: Locator;

  constructor(page: Page, root?: Locator, selector?: string) {
    super(page, root);
    this.toastLocator = selector 
      ? this.locator(selector) 
      : (root || page.locator('[role="alert"], [data-testid*="toast"], .toast, .notification').first());
  }

  @step('Verify toast is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.toastLocator).toBeVisible({ timeout: 5000 });
  }

  @step('Verify toast contains text')
  async shouldContainText(text: string | RegExp): Promise<void> {
    await this.shouldBeVisible();
    await expect(this.toastLocator).toContainText(text);
  }

  @step('Verify toast type')
  async shouldHaveType(type: 'success' | 'error' | 'warning' | 'info'): Promise<void> {
    await this.shouldBeVisible();
    // Adjust selector based on your app's toast implementation
    const typeClass = `toast-${type}`;
    await expect(this.toastLocator).toHaveClass(new RegExp(typeClass));
  }

  @step('Get toast text')
  async getText(): Promise<string> {
    return await this.toastLocator.textContent() || '';
  }

  @step('Close toast')
  async close(): Promise<void> {
    const closeButton = this.toastLocator.locator('button[aria-label*="close"], .close, [data-testid*="close"]');
    if (await closeButton.count() > 0) {
      await closeButton.click();
    }
  }
}


import { Page, Locator, expect } from '@playwright/test';
import { BaseBrowserElement } from './BaseBrowserElement';
import { step } from '../../helpers/decorators';

/**
 * Reusable Button browser element
 * Example of a common browser element following the pattern
 */
export class Button extends BaseBrowserElement {
  private readonly buttonLocator: Locator;

  constructor(page: Page, root?: Locator, selector?: string) {
    super(page, root);
    // If selector provided, use it; otherwise expect root to be the button itself
    this.buttonLocator = selector ? this.locator(selector) : (root || page.locator('button'));
  }

  @step('Click button')
  async click(): Promise<void> {
    await this.buttonLocator.click();
  }

  @step('Verify button is visible')
  async shouldBeVisible(options?: { timeout?: number }): Promise<void> {
    await expect(this.buttonLocator).toBeVisible(options);
  }

  @step('Verify button is enabled')
  async shouldBeEnabled(): Promise<void> {
    await expect(this.buttonLocator).toBeEnabled();
  }

  @step('Verify button text')
  async shouldHaveText(text: string | RegExp): Promise<void> {
    await expect(this.buttonLocator).toHaveText(text);
  }

  @step('Get button text')
  async getText(): Promise<string> {
    return await this.buttonLocator.textContent() || '';
  }
}


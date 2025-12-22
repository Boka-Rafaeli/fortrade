import { Page, Locator, expect } from '@playwright/test';
import { BaseBrowserElement } from './BaseBrowserElement';
import { step } from '../../helpers/decorators';

/**
 * Reusable Text browser element
 */
export class Text extends BaseBrowserElement {
  private readonly textLocator: Locator;

  constructor(page: Page, root?: Locator, selector?: string) {
    super(page, root);
    this.textLocator = selector ? this.locator(selector) : (root || page.locator('body'));
  }

  @step('Verify text is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.textLocator).toBeVisible();
  }

  @step('Verify text contains value')
  async shouldContainText(text: string | RegExp): Promise<void> {
    if (typeof text === 'string') {
      await expect(this.getByText(text)).toBeVisible();
    } else {
      await expect(this.textLocator.filter({ hasText: text })).toBeVisible();
    }
  }

  @step('Verify text equals value')
  async shouldHaveText(text: string | RegExp): Promise<void> {
    await expect(this.textLocator).toHaveText(text);
  }

  @step('Get text content')
  async getText(): Promise<string> {
    return await this.textLocator.textContent() || '';
  }
}


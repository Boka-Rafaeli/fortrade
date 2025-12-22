import { Page, Locator, expect } from '@playwright/test';
import { BaseBrowserElement } from './BaseBrowserElement';
import { step } from '../../helpers/decorators';

/**
 * Reusable Input browser element
 */
export class Input extends BaseBrowserElement {
  private readonly inputLocator: Locator;

  constructor(page: Page, root?: Locator, selector?: string) {
    super(page, root);
    this.inputLocator = selector ? this.locator(selector) : (root || page.locator('input'));
  }

  @step('Fill input with value')
  async fill(value: string): Promise<void> {
    await this.inputLocator.waitFor({ state: 'visible', timeout: 10000 });
    await this.inputLocator.fill(value);
  }

  @step('Type into input')
  async type(text: string, options?: { delay?: number }): Promise<void> {
    await this.inputLocator.type(text, options);
  }

  @step('Clear input')
  async clear(): Promise<void> {
    await this.inputLocator.clear();
  }

  @step('Verify input value')
  async shouldHaveValue(value: string): Promise<void> {
    await expect(this.inputLocator).toHaveValue(value);
  }

  @step('Verify input is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.inputLocator).toBeVisible();
  }

  @step('Get input value')
  async getValue(): Promise<string> {
    return await this.inputLocator.inputValue();
  }
}


import { Page, Locator } from '@playwright/test';

/**
 * Base component class that all UI components should extend
 * Provides common functionality and enforces the pattern:
 * - Components are the ONLY place for locators
 * - Components handle all direct UI interactions
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root?: Locator;

  constructor(page: Page, root?: Locator) {
    this.page = page;
    this.root = root;
  }

  /**
   * Get a locator scoped to this component's root (if provided)
   * Otherwise returns a page-level locator
   */
  protected locator(selector: string): Locator {
    if (this.root) {
      return this.root.locator(selector);
    }
    return this.page.locator(selector);
  }

  /**
   * Get a locator by role (scoped to root if available)
   */
  protected getByRole(role: 'button' | 'link' | 'textbox' | 'heading' | 'checkbox' | 'radio' | 'option', options?: { name?: string; exact?: boolean }): Locator {
    if (this.root) {
      return this.root.getByRole(role, options);
    }
    return this.page.getByRole(role, options);
  }

  /**
   * Get a locator by test id (scoped to root if available)
   */
  protected getByTestId(testId: string): Locator {
    if (this.root) {
      return this.root.getByTestId(testId);
    }
    return this.page.getByTestId(testId);
  }

  /**
   * Get a locator by text (scoped to root if available)
   */
  protected getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    if (this.root) {
      return this.root.getByText(text, options);
    }
    return this.page.getByText(text, options);
  }

  /**
   * Wait for component to be visible
   */
  protected async waitForVisible(timeout?: number): Promise<void> {
    if (this.root) {
      await this.root.waitFor({ state: 'visible', timeout });
    }
  }
}


import { Page, BrowserContext } from '@playwright/test';
import { getEnvConfig } from '../helpers/env';
import { Screens } from './Screens';

/**
 * App class - encapsulates Page/BrowserContext operations
 * Provides navigation, page management, and access to Screens
 * 
 * Rules:
 * - NO locators or feature-specific UI logic
 * - Only generic page operations
 * - Exposes screens facade for accessing screen objects
 */
export class App {
  public readonly page: Page;
  public readonly context: BrowserContext;
  public readonly screens: Screens;
  private readonly config = getEnvConfig();

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.screens = new Screens(page);
  }

  /**
   * Navigate to a URL (relative to baseURL or absolute)
   */
  async open(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    await this.page.goto(fullUrl);
  }

  /**
   * Refresh the current page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Navigate back
   */
  async back(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navigate forward
   */
  async forward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Wait for DOM to be ready
   */
  async waitForDomReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific URL
   */
  async waitForURL(url: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForURL(url, options);
  }

  /**
   * Open a new tab and execute action that opens it
   * Returns the new Page instance
   */
  async openNewTab(actionThatOpensTab: () => Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      actionThatOpensTab(),
    ]);
    return newPage;
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}


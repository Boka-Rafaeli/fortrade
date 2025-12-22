import { App } from '../../app/App';
import { step } from '../../helpers/decorators';

/**
 * Authentication Flow - Business logic for authentication scenarios
 * Orchestrates app + screens + components
 * 
 * Rules:
 * - NO locators
 * - NO direct page usage (only via App)
 * - Reusable across tests
 */
export class AuthFlow {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  @step('Login as user')
  async login(username: string, password: string): Promise<void> {
    await this.app.screens.login.navigate();
    await this.app.screens.login.login(username, password);
    await this.app.waitForNetworkIdle();
  }

  @step('Login and verify home page')
  async loginAndVerifyHome(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.app.screens.home.verifyLoggedIn(username);
  }

  @step('Logout')
  async logout(): Promise<void> {
    await this.app.screens.home.logout();
  }
}


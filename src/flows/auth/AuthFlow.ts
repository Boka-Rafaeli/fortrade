import { App } from '../../app/App';
import { LoginScreen } from '../../screens/login/LoginScreen';
import { HomeScreen } from '../../screens/home/HomeScreen';
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
  private readonly loginScreen: LoginScreen;
  private readonly homeScreen: HomeScreen;

  constructor(app: App) {
    this.app = app;
    this.loginScreen = new LoginScreen(app.page);
    this.homeScreen = new HomeScreen(app.page);
  }

  @step('Login as user')
  async login(username: string, password: string): Promise<void> {
    await this.loginScreen.navigate();
    await this.loginScreen.login(username, password);
    await this.app.waitForNetworkIdle();
  }

  @step('Login and verify home page')
  async loginAndVerifyHome(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.homeScreen.verifyLoggedIn(username);
  }

  @step('Logout')
  async logout(): Promise<void> {
    await this.homeScreen.logout();
  }
}


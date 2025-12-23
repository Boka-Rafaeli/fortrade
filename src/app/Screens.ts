import { Page } from '@playwright/test';
import { LoginScreen } from '../screens/login/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { MainScreen } from '@/screens/main/MainScreen';

/**
 * Screens facade - composition root for all screen objects
 * App exposes this to provide access to screens
 * 
 * Add screen properties here as screens are created
 */
export class Screens {
  public readonly login: LoginScreen;
  public readonly home: HomeScreen;
  public readonly main: MainScreen;

  constructor(page: Page) {
    this.login = new LoginScreen(page);
    this.home = new HomeScreen(page);
    this.main = new MainScreen(page);
  }
}


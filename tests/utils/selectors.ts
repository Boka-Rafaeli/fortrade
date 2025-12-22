/**
 * Centralized selector utilities
 * Prefer stable selectors: data-testid, role, label
 */

export const Selectors = {
  // Common selectors
  button: (testId: string) => `[data-testid="${testId}"]`,
  input: (testId: string) => `[data-testid="${testId}"]`,
  link: (testId: string) => `[data-testid="${testId}"]`,
  
  // Example feature-specific selectors
  login: {
    usernameInput: '[data-testid="username-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
  },
  
  home: {
    logoutButton: '[data-testid="logout-button"]',
    userMenu: '[data-testid="user-menu"]',
  },
};


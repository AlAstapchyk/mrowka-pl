import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('you@example.com');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async submitLoginForm(email: string, password: string) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyVisible() {
    await expect(this.page.getByText('Log in to your account')).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}

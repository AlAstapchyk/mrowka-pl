import { type Locator, type Page, expect } from '@playwright/test';

export class NavBar {
  readonly page: Page;
  readonly logoLink: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoLink = page.locator('a:has-text("Mrówka.pl")');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  async clickLogo() {
    await this.logoLink.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async verifyVisible() {
    await expect(this.logoLink).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }
}

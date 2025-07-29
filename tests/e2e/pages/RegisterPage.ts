import { type Locator, type Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('Jakub');
    this.lastNameInput = page.getByPlaceholder('Kowalski');
    this.emailInput = page.getByPlaceholder('you@example.com');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.confirmPasswordInput = page.getByPlaceholder('Repeat password');
    this.registerButton = page.getByRole('button', { name: 'Sign Up' });
  }

  async navigate() {
    await this.page.goto('/register');
  }

  async submitRegisterForm(firstName?: string, lastName?: string, email?: string, password?: string, confirmPassword?: string) {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    if (confirmPassword) await this.confirmPasswordInput.fill(confirmPassword);
    
    await this.registerButton.click();
  }

  async verifyErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}

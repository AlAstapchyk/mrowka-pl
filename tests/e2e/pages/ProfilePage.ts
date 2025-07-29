import { type Locator, type Page, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly profileHeading: Locator;
  readonly phoneInput: Locator;
  readonly educationInput: Locator;
  readonly saveChangesButton: Locator;
  readonly profileSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileHeading = page.getByRole('heading', { name: /Job Seeker Profile/i }).or(page.getByRole('heading', { name: /Recruiter Profile/i }));
    this.phoneInput = page.getByLabel(/Phone Number/i).or(page.locator('input[name="phoneNumber"]'));
    this.educationInput = page.getByLabel(/Education/i).or(page.locator('input[name="education"]'));
    this.saveChangesButton = page.getByRole("button", { name: /Save Profile/i });
    this.profileSuccessToast = page.getByText("Profile updated successfully!");
  }

  async navigate() {
    await this.page.goto('/profile');
  }

  async verifyVisible() {
    await expect(this.profileHeading).toBeVisible({ timeout: 20000 });
  }

  async updateProfile(phoneNumber: string, education: string) {
    await expect(this.phoneInput).toBeVisible();
    await this.phoneInput.fill(phoneNumber);
    
    await this.educationInput.fill(education);
    await this.saveChangesButton.click();
  }

  async verifySuccess() {
    await expect(this.profileSuccessToast).toBeVisible({ timeout: 10000 });
  }
}

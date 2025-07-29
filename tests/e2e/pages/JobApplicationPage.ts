import { type Locator, type Page, expect } from '@playwright/test';

export class JobApplicationPage {
  readonly page: Page;
  readonly coverLetterInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.coverLetterInput = page.getByLabel(/Cover Letter/i).or(page.locator('textarea'));
    this.submitButton = page.getByRole("button", { name: /Submit Application/i });
    this.successToast = page.getByText("Application submitted");
  }

  async fillCoverLetter(text: string) {
    await expect(this.coverLetterInput).toBeVisible({ timeout: 10000 });
    await this.coverLetterInput.fill(text);
  }

  async submitApplication() {
    await this.submitButton.click();
  }

  async verifySuccess() {
    await expect(this.successToast).toBeVisible({ timeout: 10000 });
    // Verify redirect back to job details
    await expect(this.page).toHaveURL(/\/jobs\/view\/.*/);
  }
}

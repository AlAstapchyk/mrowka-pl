import { type Locator, type Page, expect } from "@playwright/test";

export class JobDetailPage {
  readonly page: Page;
  readonly applyButton: Locator;
  readonly jobTitle: Locator;
  readonly jobDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applyButton = page.locator('a:has-text("Apply")');
    this.jobTitle = page.locator("h1");
    this.jobDescription = page.locator('.prose, [data-id="job-description"]');
  }

  async verifyVisible() {
    await expect(this.jobTitle).toBeVisible();
    await expect(this.applyButton.first()).toBeVisible();
  }

  async clickApply() {
    await this.applyButton.first().click();
  }
}

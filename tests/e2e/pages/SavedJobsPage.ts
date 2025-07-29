import { type Locator, type Page, expect } from '@playwright/test';

export class SavedJobsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly jobCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1:has-text('Saved Jobs')");
    this.jobCards = page.locator('a[href*="/jobs/view/"]');
  }

  async navigate() {
    await this.page.goto('/saved-jobs');
  }

  async verifyVisible() {
    await expect(this.heading).toBeVisible();
  }

  async verifyJobIsSaved() {
    await expect(this.jobCards.first()).toBeVisible();
  }
}

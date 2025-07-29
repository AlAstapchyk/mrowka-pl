import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchJobInput: Locator;
  readonly searchLocationInput: Locator;
  readonly searchButton: Locator;
  readonly browseJobsLink: Locator;
  readonly uploadCvLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchJobInput = page.getByPlaceholder('Job title or employer');
    this.searchLocationInput = page.getByPlaceholder('Location');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.browseJobsLink = page.locator('text=Browse Jobs').first();
    this.uploadCvLink = page.locator('text=Upload CV').first();
  }

  async navigate() {
    await this.page.goto('/');
  }

  async verifyHeroSection() {
    await expect(this.page.getByText('Searching for a job?')).toBeVisible();
    await expect(this.page.getByText('Find with us!')).toBeVisible();
  }

  async verifySearchFormVisible() {
    await expect(this.searchJobInput).toBeVisible();
    await expect(this.searchLocationInput).toBeVisible();
  }

  async verifyRecentJobsVisible() {
    await expect(this.page.getByText('Recent job offers')).toBeVisible();
  }

  async verifyFooter() {
    await expect(this.page.getByText('Poland\'s leading job portal')).toBeVisible();
    await expect(this.browseJobsLink).toBeVisible();
    await expect(this.uploadCvLink).toBeVisible();
  }

  async searchForJob(jobTitle: string, location: string) {
    await this.searchJobInput.fill(jobTitle);
    await this.searchLocationInput.fill(location);
    await this.searchButton.click();
  }
}

import { type Locator, type Page, expect } from "@playwright/test";

export class JobsPage {
  readonly page: Page;
  readonly loadingIndicator: Locator;
  readonly jobOfferLinks: Locator;
  readonly paginationNav: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly searchJobInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingIndicator = page.locator("text=Loading job offers...");
    this.jobOfferLinks = page.locator('a[href*="/jobs/view/"]');
    this.paginationNav = page.locator('nav[aria-label="pagination"]');
    this.nextButton = page.getByLabel("Go to next page");
    this.prevButton = page.getByLabel("Go to previous page");

    this.searchJobInput = page
      .getByPlaceholder("Job title or employer")
      .first();
    this.searchButton = page.getByRole("button", { name: "Search" }).first();
  }

  async navigate(url = "/jobs") {
    await this.page.goto(url);
  }

  async waitForLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 15000 });
  }

  async hasJobsLoaded() {
    return (await this.jobOfferLinks.count()) > 0;
  }

  async hasPagination() {
    return await this.paginationNav.isVisible();
  }

  async isNextPageDisabled() {
    return (await this.nextButton.getAttribute("aria-disabled")) === "true";
  }

  async clickNextPage() {
    await this.nextButton.click();
  }

  async clickPreviousPage() {
    await this.prevButton.click();
  }

  async searchForJob(jobTitle: string) {
    await this.searchJobInput.fill(jobTitle);
    await this.searchButton.click();
  }

  async verifyEmptyStateVisible() {
    await expect(
      this.page.getByText("No job offers found matching your criteria."),
    ).toBeVisible();
  }
}

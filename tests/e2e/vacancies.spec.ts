import { test, expect } from "@playwright/test";
import { JobsPage } from "./pages/JobsPage";

test.describe("Vacancies Page", () => {
  let jobsPage: JobsPage;

  test.beforeEach(async ({ page }) => {
    jobsPage = new JobsPage(page);
  });

  test("should navigate between pages of vacancies", async ({ page }) => {
    await jobsPage.navigate("/jobs");
    await jobsPage.waitForLoad();

    if (!(await jobsPage.hasJobsLoaded())) {
      console.log("No jobs found to test pagination");
      return;
    }

    if (await jobsPage.hasPagination()) {
      const nextIsDisabled = await jobsPage.isNextPageDisabled();

      if (!nextIsDisabled) {
        await jobsPage.clickNextPage();

        await page.waitForURL("**/jobs?*page=2*");
        expect(page.url()).toContain("page=2");

        await jobsPage.clickPreviousPage();
        await page.waitForURL("**/jobs?*page=1*");
        expect(page.url()).toContain("page=1");
      }
    } else {
      console.log(
        "Only one page of jobs available, skipping pagination navigation test.",
      );
    }
  });

  test("filters should reset pagination to page 1", async ({ page }) => {
    await jobsPage.navigate("/jobs?page=2");
    await jobsPage.waitForLoad();

    await jobsPage.searchForJob("Test");

    await page.waitForURL("**/jobs?*page=1*");
    expect(page.url()).toContain("page=1");
  });

  test("should show empty state when no jobs match criteria", async ({
    page,
  }) => {
    await jobsPage.navigate("/jobs");
    await jobsPage.waitForLoad();

    await jobsPage.searchForJob("ASDFGHJKL123456789");
    await jobsPage.waitForLoad();

    await jobsPage.verifyEmptyStateVisible();
  });
});

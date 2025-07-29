import { test } from "@playwright/test";
import { JobsPage } from "./pages/JobsPage";
import { JobDetailPage } from "./pages/JobDetailPage";

test.describe("Job Details Page", () => {
  let jobsPage: JobsPage;
  let jobDetailPage: JobDetailPage;

  test.beforeEach(async ({ page }) => {
    jobsPage = new JobsPage(page);
    jobDetailPage = new JobDetailPage(page);
  });

  test("should load job details when clicking a job offer from the list", async ({
    page,
  }) => {
    await jobsPage.navigate("/jobs");
    await jobsPage.waitForLoad();

    if (!(await jobsPage.hasJobsLoaded())) {
      console.log("No jobs found to test job details");
      return;
    }

    await jobsPage.jobOfferLinks.first().click();

    await page.waitForURL("**/jobs/view/**");

    await jobDetailPage.verifyVisible();
  });
});

import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test("should load the home page correctly", async () => {
    await homePage.verifyHeroSection();
    await homePage.verifySearchFormVisible();
    await homePage.verifyRecentJobsVisible();
    await homePage.verifyFooter();
  });

  test("search form should redirect to jobs page with query params", async ({ page }) => {
    await homePage.searchForJob("Developer", "Warsaw");

    await page.waitForURL("**/jobs?query=Developer&location=Warsaw&page=1");
    expect(page.url()).toContain("/jobs");
  });
});

import { test, expect } from "@playwright/test";
import { NavBar } from "./pages/NavBar";

test.describe("Global Navigation", () => {
  let navBar: NavBar;

  test.beforeEach(async ({ page }) => {
    navBar = new NavBar(page);
    await page.goto("/");
  });

  test("should navigate to Home when clicking the logo", async ({ page }) => {
    await page.goto("/jobs");

    await navBar.clickLogo();
    await page.waitForURL("**/");

    await expect(page.getByText("Searching for a job?")).toBeVisible();
  });

  test("should navigate to Login page", async ({ page }) => {
    await navBar.clickLogin();
    await page.waitForURL("**/login");
    await expect(page.getByText("Log in to your account")).toBeVisible();
  });

  test("should navigate to Register page", async ({ page }) => {
    await navBar.clickRegister();
    await page.waitForURL("**/register");
    await expect(page.getByText("Create an account")).toBeVisible();
  });
});

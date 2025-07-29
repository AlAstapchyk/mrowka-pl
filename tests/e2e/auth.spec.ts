import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

test.describe("Authentication Validations", () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
  });

  test.describe("Login Form", () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
    });

    test("should show error for empty fields", async () => {
      await loginPage.submitLoginForm("", "");
      await loginPage.verifyErrorMessage("Invalid email");
      await loginPage.verifyErrorMessage(
        "Password must be at least 6 characters",
      );
    });

    test("should show error for invalid email format", async () => {
      await loginPage.submitLoginForm("invalidemail", "password123");
      await loginPage.verifyErrorMessage("Invalid email");
    });
  });

  test.describe("Register Form", () => {
    test.beforeEach(async () => {
      await registerPage.navigate();
    });

    test("should show error for empty fields", async () => {
      await registerPage.submitRegisterForm("", "", "", "", "");
      await registerPage.verifyErrorMessage("First name is required");
      await registerPage.verifyErrorMessage("Last name is required");
      await registerPage.verifyErrorMessage("Invalid email");
      await registerPage.verifyErrorMessage(
        "Password must be at least 6 characters",
      );
    });

    test("should show error when passwords do not match", async () => {
      await registerPage.submitRegisterForm(
        "John",
        "Doe",
        "john@example.com",
        "Password123",
        "Password456",
      );
      await registerPage.verifyErrorMessage("Passwords do not match");
    });

    test("should show error for weak passwords", async () => {
      await registerPage.submitRegisterForm(
        "John",
        "Doe",
        "john@example.com",
        "123456",
        "123456",
      );
      await registerPage.verifyErrorMessage(
        "Password must contain at least one letter",
      );
    });
  });
});

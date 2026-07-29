import { expect, test } from "@playwright/test";

test("a recruiter can complete the reserve decision flow", async ({ page }) => {
  await page.goto("/?case=reserve-required");

  await expect(
    page.getByRole("heading", {
      name: "Should Remote let this company hire?"
    })
  ).toBeVisible();

  await expect(
    page
      .locator("#proposal")
      .getByText("Proceed after a risk reserve", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("AI evidence summary")).toBeVisible();

  await page.getByRole("button", { name: "For the customer" }).click();
  await expect(page.getByText("Here's what happens next")).toBeVisible();

  await page.getByRole("button", { name: "For the Risk team" }).click();
  await page
    .getByRole("button", { name: "Approve recommendation" })
    .click();
  await expect(page.getByText("Decision recorded")).toBeVisible();
});

test("the strict policy exposes an additional review", async ({ page }) => {
  await page.goto("/?case=clear-to-hire");

  await expect(page.getByText("Clear to continue onboarding")).toBeVisible();

  await page
    .getByRole("button", { name: "Strict policy", exact: true })
    .click();
  await expect(page.getByText("Request financial information")).toBeVisible();
  await expect(
    page.getByText("One additional legitimate company is delayed")
  ).toBeVisible();
});

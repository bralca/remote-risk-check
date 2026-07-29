import { expect, test } from "@playwright/test";

test("the default recruiter view explains the product and portfolio", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Clear standard hires/ })
  ).toBeVisible();
  await expect(page.getByText("Atlas Robotics Ltd")).toBeVisible();
  await expect(page.getByText("3 ready", { exact: true })).toBeVisible();
  await expect(page.getByText("1 customer action", { exact: true })).toBeVisible();
  await expect(page.getByText("1 specialist review", { exact: true })).toBeVisible();
  await expect(page.getByText("KYB verification:")).toBeVisible();
});

test("every hire exposes the expected evidence and action", async ({ page }) => {
  await page.goto("/");

  const cases = [
    ["ana-portugal", "Ready to continue onboarding", "Rules only · no generative AI"],
    ["tiago-portugal", "Ready to continue onboarding", "Rules only · no generative AI"],
    ["lena-germany", "Ready after document validation", "Work eligibility evidence"],
    ["camille-france", "One customer action required", "Current work-authorization evidence"],
    ["oliver-uk", "Specialist review before onboarding", "Notice period"]
  ] as const;

  for (const [id, headline, evidence] of cases) {
    await page.getByTestId(`hire-${id}`).click();
    await expect(page.getByRole("heading", { name: headline })).toBeVisible();
    await expect(page.getByText(evidence, { exact: true })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`hire=${id}`));
  }
});

test("customer and internal explanations stay distinct", async ({ page }) => {
  await page.goto("/?view=product&hire=camille-france");

  await expect(page.getByText("Decision evidence")).toBeVisible();
  await page.getByRole("tab", { name: "Customer next step" }).click();
  await expect(page.getByText("Here's what happens next")).toBeVisible();
  await expect(
    page.getByText(/Upload Camille’s current work-authorization evidence/)
  ).toBeVisible();
  await expect(page.getByText("Decision evidence")).toBeHidden();

  await page.getByRole("tab", { name: "Internal decision" }).click();
  await expect(page.getByText("Decision evidence")).toBeVisible();
});

test("a human approval creates an audit record", async ({ page }) => {
  await page.goto("/?view=product&hire=oliver-uk");

  await expect(page.getByText("A person owns this action.")).toBeVisible();
  await page.getByRole("button", { name: "Approve reserve review" }).click();
  await expect(page.getByText("Human decision recorded")).toBeVisible();
  await expect(page.getByText(/audit entry created/)).toBeVisible();
});

test("all three proposal views are URL-backed", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("view-behind").click();
  await expect(page.getByTestId("behind-view")).toBeVisible();
  await expect(page).toHaveURL(/view=behind/);
  await expect(page.getByText("−62%")).toBeVisible();

  await page.getByTestId("view-vision").click();
  await expect(page.getByTestId("vision-view")).toBeVisible();
  await expect(page).toHaveURL(/view=vision/);

  await page.getByTestId("view-product").click();
  await expect(page.getByTestId("product-view")).toBeVisible();
  await expect(page).toHaveURL(/view=product/);
});

test("the impact model discloses its assumptions", async ({ page }) => {
  await page.goto("/?view=behind");

  await expect(
    page.getByTestId("impact-card").getByText("€12.00", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByTestId("impact-card").getByText("€4.54", { exact: true })
  ).toBeVisible();
  await page.getByText("See the assumptions and formula").click();
  await expect(page.getByText("12 min × €60/hour = €12.00")).toBeVisible();
  await expect(page.getByText(/potential annual savings €746,000/)).toBeVisible();
});

test("the agent runs to a bounded specialist escalation", async ({ page }) => {
  await page.goto("/?view=vision");

  await page.getByRole("button", { name: "Run agent" }).click();
  await expect(
    page.getByText("9 of 9 · Human decision and audit event", {
      exact: true
    })
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByText(/Account value can change service priority/)
  ).toBeVisible();
  await expect(page.getByText("The alternate standard path")).toBeVisible();
});

test("keyboard, mobile, and reduced-motion operation remain usable", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const behindTab = page.getByTestId("view-behind");
  await behindTab.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("behind-view")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);

  await page.getByTestId("view-vision").click();
  await page.getByRole("button", { name: "Run agent" }).click();
  await expect(page.getByText(/1 of 9/)).toBeVisible();
  await page.getByRole("button", { name: "Next agent step" }).click();
  await expect(page.getByText(/2 of 9/)).toBeVisible();
  await page.getByRole("button", { name: "Previous agent step" }).click();
  await expect(page.getByText(/1 of 9/)).toBeVisible();
});

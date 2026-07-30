import { expect, test } from "@playwright/test";

test("the default view opens directly in the product", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Onboarding reviews" })
  ).toBeVisible();
  await expect(page.getByTestId("explanation-view")).toBeHidden();
  await expect(page.getByText("Atlas Robotics Ltd")).toBeVisible();
  await expect(page.getByText("3 ready", { exact: true })).toBeVisible();
  await expect(page.getByText("1 needs information", { exact: true })).toBeVisible();
  await expect(page.getByText("1 specialist review", { exact: true })).toBeVisible();
  await expect(page.getByText("Company identity:")).toBeVisible();
});

test("every hire exposes the expected evidence and action", async ({ page }) => {
  await page.goto("/");

  const cases = [
    ["ana-portugal", "Ready to continue onboarding", "Employment terms"],
    ["tiago-portugal", "Ready to continue onboarding", "Reserve status"],
    ["lena-germany", "Ready after document validation", "Work eligibility evidence"],
    ["camille-france", "The customer must provide one document", "Current work-authorization evidence"],
    ["oliver-uk", "A UK specialist must review this hire before onboarding", "Notice period"]
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

  await expect(page.getByText("Evidence used for this result")).toBeVisible();
  await page.getByRole("tab", { name: "Customer message" }).click();
  await expect(page.getByText("What the customer needs to know")).toBeVisible();
  await expect(
    page.getByText(/Upload Camille’s current work-authorization evidence/)
  ).toBeVisible();
  await expect(page.getByText("Evidence used for this result")).toBeHidden();

  await page.getByRole("tab", { name: "Review details" }).click();
  await expect(page.getByText("Evidence used for this result")).toBeVisible();
});

test("a human approval creates an audit record", async ({ page }) => {
  await page.goto("/?view=product&hire=oliver-uk");

  await expect(page.getByText("A UK specialist makes this decision.")).toBeVisible();
  await page.getByRole("button", { name: "Approve reserve review" }).click();
  await expect(page.getByText("Human decision recorded")).toBeVisible();
  await expect(page.getByText(/audit entry created/)).toBeVisible();
});

test("product and explanation are separate URL-backed views", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("view-explanation").click();
  await expect(page.getByTestId("explanation-view")).toBeVisible();
  await expect(page.getByTestId("behind-view")).toBeVisible();
  await expect(page.getByTestId("vision-view")).toBeVisible();
  await expect(page).toHaveURL(/view=explanation/);
  await expect(page.getByText("−62%")).toBeVisible();

  await page.getByTestId("view-product").click();
  await expect(page.getByTestId("product-view")).toBeVisible();
  await expect(page.getByTestId("explanation-view")).toBeHidden();
  await expect(page).toHaveURL(/view=product/);
});

test("the impact model discloses its assumptions", async ({ page }) => {
  await page.goto("/?view=explanation");

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

test("the routine-work example stops for a specialist", async ({ page }) => {
  await page.goto("/?view=explanation");

  await page.getByRole("button", { name: "Run the example" }).click();
  await expect(
    page.getByText("9 of 9 · Specialist decision recorded in the audit history", {
      exact: true
    })
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByText(/A high-value customer may receive a faster response/)
  ).toBeVisible();
  await expect(
    page.getByText("What happens in a complete, standard case")
  ).toBeVisible();
});

test("keyboard, mobile, and reduced-motion operation remain usable", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const explanationTab = page.getByTestId("view-explanation");
  await explanationTab.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("explanation-view")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);

  await page.getByRole("button", { name: "Run the example" }).click();
  await expect(page.getByText(/1 of 9/)).toBeVisible();
  await page.getByRole("button", { name: "Next agent step" }).click();
  await expect(page.getByText(/2 of 9/)).toBeVisible();
  await page.getByRole("button", { name: "Previous agent step" }).click();
  await expect(page.getByText(/1 of 9/)).toBeVisible();
});

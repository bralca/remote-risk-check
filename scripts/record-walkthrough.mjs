import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const outputDirectory = "/tmp/remote-risk-walkthrough";
const baseUrl = process.env.WALKTHROUGH_BASE_URL ?? "http://localhost:3000";
await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: {
    dir: outputDirectory,
    size: { width: 1280, height: 720 }
  }
});
const page = await context.newPage();

async function pause(milliseconds) {
  await page.waitForTimeout(milliseconds);
}

async function show(selector, milliseconds) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await pause(milliseconds);
}

await page.goto(
  `${baseUrl}/?view=product&hire=oliver-uk`,
  { waitUntil: "networkidle" }
);
await pause(4000);

await show("#experience", 3500);

await page.getByTestId("hire-camille-france").click();
await pause(3000);
await page.getByRole("tab", { name: "Customer next step" }).click();
await pause(3500);

await page.getByTestId("hire-oliver-uk").click();
await pause(3500);
await page.getByRole("button", { name: "Approve reserve review" }).click();
await pause(3000);

await page.getByTestId("view-behind").click();
await pause(4500);
await show(".impact-card", 4500);
await page.getByText("See the assumptions and formula").click();
await pause(3500);

await page.getByTestId("view-vision").click();
await pause(3500);
await page.getByRole("button", { name: "Run agent" }).click();
await pause(6500);
await show(".escalation-rule", 4500);

await show("#build", 4000);
await show(".proposal-footer", 2500);

const video = page.video();
await context.close();
await browser.close();

if (!video) {
  throw new Error("Playwright did not create a walkthrough recording.");
}

console.log(await video.path());

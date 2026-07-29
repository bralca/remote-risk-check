import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const outputDirectory = "/tmp/remote-risk-walkthrough";
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

await page.goto("http://127.0.0.1:3000/?case=reserve-required", {
  waitUntil: "networkidle"
});
await pause(4000);

await show("#proposal", 4500);

await page.getByRole("button", { name: "For the customer" }).click();
await pause(3500);

await page.getByRole("button", { name: "For the Risk team" }).click();
await pause(1200);
await page.getByRole("button", { name: "Approve recommendation" }).click();
await pause(3000);

await page.getByRole("tab", { name: /Clear/ }).click();
await pause(3500);
await page.getByRole("button", { name: "Strict policy" }).click();
await pause(3500);

await page.getByRole("tab", { name: /Reserve/ }).click();
await pause(2500);

await show("#choices", 4500);
await show(".proposal-remote-fit", 4500);
await show(".proposal-proof", 4500);
await show("#build", 5000);
await show(".proposal-footer", 3000);

const video = page.video();
await context.close();
await browser.close();

if (!video) {
  throw new Error("Playwright did not create a walkthrough recording.");
}

console.log(await video.path());

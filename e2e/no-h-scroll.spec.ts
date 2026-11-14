import { expect, test } from "@playwright/test";
test("no horizontal page scroll", async ({ page }) => {
  for (const vp of [{ width: 375, height: 800 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(vp);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Payment Links", exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

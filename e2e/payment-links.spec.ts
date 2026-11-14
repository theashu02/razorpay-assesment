import { expect, test } from '@playwright/test';
test('create payment link and filter active', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Payment Links', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /create payment link/i }).click();
  await expect(page.getByRole('heading', { name: 'Create Payment Link' })).toBeVisible();
  const desc = `E2E Test Link ${Date.now()}`;
  await page.getByLabel(/Amount \(INR\)/i).fill('2500.50');
  await page.getByLabel(/^Description/i).fill(desc);
  await page.getByLabel(/Customer Email/i).fill('e2e@example.com');
  await page.getByRole('button', { name: /generate link/i }).click();
  await expect(page.getByRole('status')).toContainText('Payment link created');
  await expect(page.getByRole('table')).toContainText(desc);
  await page.getByRole('tab', { name: 'Active' }).click();
  await expect(page.getByRole('table')).toContainText(desc);
});

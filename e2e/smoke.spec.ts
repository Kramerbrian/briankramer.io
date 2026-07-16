import { test, expect } from '@playwright/test';

test('homepage renders the hero and brand name', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Brian Kramer/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('writing index links through to a full essay', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const firstEssay = page.locator('a[href^="/writing/"]').first();
  await expect(firstEssay).toBeVisible();
  await firstEssay.click();

  await expect(page).toHaveURL(/\/writing\/.+/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

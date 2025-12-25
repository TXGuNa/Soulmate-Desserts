import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Settings flow (public user)', () => {
  test('navigates to Settings and shows language selector', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('button', { name: /settings/i }).click();

    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /select language/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /select language/i })).toHaveValue('en');
  });

  test('allows changing language value locally', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('button', { name: /settings/i }).click();

    const languageSelect = page.getByRole('combobox', { name: /select language/i });
    await languageSelect.selectOption('ru');

    await expect(languageSelect).toHaveValue('ru');
  });
});

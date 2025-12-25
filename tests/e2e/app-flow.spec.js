import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('App Functionality Flow', () => {
  test('User can browse products, add to cart, and proceed to checkout', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Soulmate Desserts/i);
    
    // Verify Hero section is visible on Home Page
    await expect(page.locator('.hero')).toBeVisible();

    // 2. Navigate to Catalog
    // Click the "Our Cakes" link in the navigation
    await page.getByText('Our Cakes').click();
    
    // Verify we are on Catalog page (Hero should NOT be visible)
    await expect(page.locator('.hero')).not.toBeVisible();
    // And products should be visible
    await expect(page.locator('.products-grid')).toBeVisible();

    // 3. Add an item to cart
    // Wait for products to load
    await page.waitForSelector('.product-card');
    const firstProduct = page.locator('.product-card').first();
    const productName = await firstProduct.locator('.product-name').innerText();
    
    // Click add button
    await firstProduct.locator('.add-btn').click();

    // 4. Open Cart
    // Click the cart icon in the header
    await page.locator('.cart-btn').filter({ has: page.locator('svg.lucide-shopping-cart') }).click();

    // 5. Verify Cart Content
    const cartDrawer = page.locator('.cart-drawer');
    await expect(cartDrawer).toBeVisible();
    await expect(cartDrawer).toContainText(productName);
    
    // 6. Proceed to Checkout
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();
    
    // 7. Verify Checkout Page
    // Since the app uses client-side routing without URL changes, we check for the Checkout header
    await expect(page.getByRole('heading', { name: /Checkout/i })).toBeVisible();
    
    // Verify the form is present
    await expect(page.locator('form')).toBeVisible();
  });
});

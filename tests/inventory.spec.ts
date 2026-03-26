import { test, expect } from './fixtures';

test.describe('Inventory / Product Listing', () => {
  test('TC-INV-01: inventory page displays 6 products', async ({ loggedInPage }) => {
    await expect(loggedInPage.productItems).toHaveCount(6);
  });

  test('TC-INV-02: each product shows name, description, price and add-to-cart button', async ({ loggedInPage }) => {
    const firstItem = loggedInPage.productItems.first();
    await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_price')).toBeVisible();
    await expect(firstItem.locator('button')).toBeVisible();
  });

  test('TC-INV-03: sort products by name A→Z', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('az');
    const names = await loggedInPage.productItems.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('TC-INV-04: sort products by name Z→A', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');
    const names = await loggedInPage.productItems.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('TC-INV-05: sort products by price low→high', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');
    const priceTexts = await loggedInPage.productItems.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-INV-06: sort products by price high→low', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('hilo');
    const priceTexts = await loggedInPage.productItems.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('TC-INV-07: clicking product name opens product detail page', async ({ loggedInPage, page }) => {
    await loggedInPage.productItems.first().locator('.inventory_item_name').click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('TC-INV-08: product detail page shows back button that returns to inventory', async ({ loggedInPage, page }) => {
    await loggedInPage.productItems.first().locator('.inventory_item_name').click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});

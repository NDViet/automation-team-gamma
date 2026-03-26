import { test, expect } from './fixtures';

test.describe('Navigation & Burger Menu', () => {
  test('TC-NAV-01: burger menu opens side navigation', async ({ loggedInPage, page }) => {
    await loggedInPage.openBurgerMenu();
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
  });

  test('TC-NAV-02: reset app state clears cart', async ({ loggedInPage, page }) => {
    await loggedInPage.addToCartByIndex(0);
    await expect(loggedInPage.cartBadge).toHaveText('1');
    await loggedInPage.openBurgerMenu();
    await loggedInPage.resetLink.click();
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });

  test('TC-NAV-03: About link points to saucelabs.com', async ({ loggedInPage, page }) => {
    await loggedInPage.openBurgerMenu();
    const aboutLink = page.locator('#about_sidebar_link');
    const href = await aboutLink.getAttribute('href');
    expect(href).toMatch(/saucelabs\.com/);
  });

  test('TC-NAV-04: page title is "Swag Labs" on inventory page', async ({ loggedInPage, page }) => {
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('TC-NAV-05: cart icon on inventory page navigates to cart', async ({ loggedInPage, page }) => {
    await loggedInPage.cartIcon.click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});

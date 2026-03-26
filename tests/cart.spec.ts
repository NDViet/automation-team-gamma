import { test, expect } from './fixtures';
import { CartPage } from './pages/CartPage';

test.describe('Shopping Cart', () => {
  test('TC-CART-01: adding a product updates cart badge count to 1', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });

  test('TC-CART-02: adding multiple products reflects correct badge count', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.addToCartByIndex(1);
    await loggedInPage.addToCartByIndex(2);
    await expect(loggedInPage.cartBadge).toHaveText('3');
  });

  test('TC-CART-03: removing a product from inventory decreases cart badge count', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.addToCartByIndex(1);
    await loggedInPage.removeFromCartByIndex(0);
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });

  test('TC-CART-04: cart badge disappears after removing all products', async ({ loggedInPage }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.removeFromCartByIndex(0);
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });

  test('TC-CART-05: cart page shows the added product', async ({ loggedInPage, page }) => {
    const productName = await loggedInPage.getProductNameAt(0).textContent();
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.cartIcon.click();
    await expect(page).toHaveURL(/cart\.html/);
    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.getItemNameAt(0)).toHaveText(productName!);
  });

  test('TC-CART-06: removing an item from the cart page empties the cart', async ({ loggedInPage, page }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.cartIcon.click();
    const cartPage = new CartPage(page);
    await cartPage.removeItemByIndex(0);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('TC-CART-07: continue shopping button returns to inventory', async ({ loggedInPage, page }) => {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.cartIcon.click();
    const cartPage = new CartPage(page);
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});

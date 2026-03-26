import { test, expect } from './fixtures';
import { CartPage } from './pages/CartPage';
import {
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage,
} from './pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  // Helper: add a product and navigate to checkout step 1
  async function reachCheckoutStepOne(loggedInPage: ReturnType<typeof Object.create>, page: import('@playwright/test').Page) {
    await loggedInPage.addToCartByIndex(0);
    await loggedInPage.cartIcon.click();
    const cartPage = new CartPage(page);
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    return new CheckoutStepOnePage(page);
  }

  test('TC-CHK-01: complete checkout end-to-end shows confirmation', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('John', 'Doe', '12345');
    await step1.continueButton.click();

    const step2 = new CheckoutStepTwoPage(page);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await step2.finishButton.click();

    const complete = new CheckoutCompletePage(page);
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(complete.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('TC-CHK-02: checkout form error when first name is missing', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('', 'Doe', '12345');
    await step1.continueButton.click();
    await expect(step1.errorMessage).toBeVisible();
    await expect(step1.errorMessage).toContainText('First Name is required');
  });

  test('TC-CHK-03: checkout form error when last name is missing', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('John', '', '12345');
    await step1.continueButton.click();
    await expect(step1.errorMessage).toBeVisible();
    await expect(step1.errorMessage).toContainText('Last Name is required');
  });

  test('TC-CHK-04: checkout form error when postal code is missing', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('John', 'Doe', '');
    await step1.continueButton.click();
    await expect(step1.errorMessage).toBeVisible();
    await expect(step1.errorMessage).toContainText('Postal Code is required');
  });

  test('TC-CHK-05: cancel on step 1 returns to cart', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC-CHK-06: cancel on step 2 returns to inventory', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('John', 'Doe', '12345');
    await step1.continueButton.click();
    const step2 = new CheckoutStepTwoPage(page);
    await step2.cancelButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-CHK-07: order total on step 2 equals item subtotal plus tax', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('Jane', 'Smith', '99999');
    await step1.continueButton.click();

    const step2 = new CheckoutStepTwoPage(page);
    const itemTotalText = await step2.itemTotal.textContent();
    const taxText = await step2.taxAmount.textContent();
    const totalText = await step2.totalAmount.textContent();

    const itemTotal = parseFloat(itemTotalText!.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText!.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));

    expect(Math.round((itemTotal + tax) * 100) / 100).toBe(total);
  });

  test('TC-CHK-08: back-home button on confirmation returns to inventory', async ({ loggedInPage, page }) => {
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('Alice', 'Green', '54321');
    await step1.continueButton.click();
    const step2 = new CheckoutStepTwoPage(page);
    await step2.finishButton.click();
    const complete = new CheckoutCompletePage(page);
    await complete.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-CHK-09: step 2 summary lists the product added to cart', async ({ loggedInPage, page }) => {
    const productName = await loggedInPage.getProductNameAt(0).textContent();
    const step1 = await reachCheckoutStepOne(loggedInPage, page);
    await step1.fillForm('Bob', 'Brown', '11111');
    await step1.continueButton.click();
    const step2 = new CheckoutStepTwoPage(page);
    await expect(step2.summaryItems).toHaveCount(1);
    await expect(step2.summaryItems.first().locator('.inventory_item_name')).toHaveText(productName!);
  });
});

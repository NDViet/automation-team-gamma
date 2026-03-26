import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async removeItemByIndex(index: number) {
    const removeButtons = this.page.locator('.cart_button');
    await removeButtons.nth(index).click();
  }

  getItemNameAt(index: number): Locator {
    return this.cartItems.nth(index).locator('.inventory_item_name');
  }

  getItemPriceAt(index: number): Locator {
    return this.cartItems.nth(index).locator('.inventory_item_price');
  }
}

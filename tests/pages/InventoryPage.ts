import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async addToCartByIndex(index: number) {
    const addButtons = this.page.locator('.btn_primary.btn_inventory');
    await addButtons.nth(index).click();
  }

  async removeFromCartByIndex(index: number) {
    const removeButtons = this.page.locator('.btn_secondary.btn_inventory');
    await removeButtons.nth(index).click();
  }

  async openBurgerMenu() {
    await this.burgerMenu.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  getProductNameAt(index: number): Locator {
    return this.productItems.nth(index).locator('.inventory_item_name');
  }

  getProductPriceAt(index: number): Locator {
    return this.productItems.nth(index).locator('.inventory_item_price');
  }
}

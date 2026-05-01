import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(private page: Page) {
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async addProductByIndex(index: number): Promise<void> {
    const buttons = this.page.locator('[data-test^="add-to-cart"]');
    await buttons.nth(index).click();
  }

  async removeProductByIndex(index: number): Promise<void> {
    const buttons = this.page.locator('[data-test^="remove"]');
    await buttons.nth(index).click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }
}

import { test, expect } from '../../fixtures';

test.describe('Cart', () => {
  test.use({ storageState: undefined });

  test.beforeEach(async ({ authenticatedPage: _ }) => {});

  test('adding a product increases cart badge count', async ({ page, cartPage }) => {
    await cartPage.addProductByIndex(0);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  test('removing a product from inventory removes cart badge', async ({ page, cartPage }) => {
    await cartPage.addProductByIndex(0);
    await cartPage.removeProductByIndex(0);
    await expect(cartPage.cartBadge).not.toBeVisible();
  });

  test('cart page shows added product', async ({ page, cartPage }) => {
    await cartPage.addProductByIndex(0);
    await cartPage.cartIcon.click();
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('cart page shows multiple added products', async ({ page, cartPage }) => {
    await cartPage.addProductByIndex(0);
    await cartPage.addProductByIndex(1);
    await cartPage.cartIcon.click();
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.cartBadge).toHaveText('2');
  });
});

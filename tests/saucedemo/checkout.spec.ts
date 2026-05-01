import { test, expect } from '../../fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ authenticatedPage: _, page, cartPage }) => {
    await cartPage.addProductByIndex(0);
    await cartPage.cartIcon.click();
    await cartPage.checkoutButton.click();
  });

  test('complete checkout flow shows confirmation', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(checkoutPage.confirmationHeader).toBeVisible();
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('missing first name shows validation error', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('missing last name shows validation error', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('missing postal code shows validation error', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});

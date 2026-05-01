import { test, expect } from '../../fixtures';

test.describe('Login', () => {
  test('valid credentials redirect to inventory page', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('invalid credentials show error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('locked out user sees lock message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('empty credentials show validation error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});

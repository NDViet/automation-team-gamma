import { test, expect, USERS } from './fixtures';

test.describe('Authentication', () => {
  test('TC-AUTH-01: successful login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-AUTH-02: login fails with invalid password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('TC-AUTH-03: login fails with invalid username', async ({ loginPage }) => {
    await loginPage.login('unknown_user', USERS.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('TC-AUTH-04: login fails with empty username', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('TC-AUTH-05: login fails with empty password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('TC-AUTH-06: locked-out user sees descriptive error', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('TC-AUTH-07: logout redirects to login page', async ({ loggedInPage, page }) => {
    await loggedInPage.logout();
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('TC-AUTH-08: accessing inventory without login redirects to login page', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="error"]')).toContainText('can only access');
  });
});

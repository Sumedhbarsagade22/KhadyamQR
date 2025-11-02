import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsRestaurant, SELECTORS, TEST_CREDENTIALS } from '../test-utils';

test.describe('Authentication Flows', () => {
  test('Admin login with valid credentials', async ({ page }) => {
    // Test admin login flow
    await loginAsAdmin(page);
    await expect(page).toHaveURL('/admin');
    await expect(page.locator(SELECTORS.heading('Dashboard'))).toBeVisible();
  });

  test('Restaurant login with valid credentials', async ({ page }) => {
    // Test restaurant login flow
    await loginAsRestaurant(page);
    await expect(page).toHaveURL('/restaurant-dashboard');
    await expect(page.locator(SELECTORS.heading(/Welcome/))).toBeVisible();
  });

  test('Admin login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill(SELECTORS.emailInput, 'invalid@example.com');
    await page.fill(SELECTORS.passwordInput, 'wrongpassword');
    await page.click(SELECTORS.submitButton);
    
    // Should stay on login page and show error
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });

  test('Password reset flow has correct WhatsApp link', async ({ page }) => {
    await page.goto('/restaurant-login');
    await page.click(SELECTORS.link('Contact Admin'));
    
    // Verify WhatsApp link is correct
    const whatsappLink = await page.getAttribute('a[href^="https://wa.me/"]', 'href');
    expect(whatsappLink).toBeDefined();
    expect(whatsappLink).toContain('918830778401');
    
    // Verify the message contains the test email
    const expectedEmail = TEST_CREDENTIALS.restaurant.email;
    expect(whatsappLink).toContain(encodeURIComponent(`Hello Admin, I need to reset my restaurant account password. My email is: ${expectedEmail}`));
  });

  test('Access protected routes without authentication redirects to login', async ({ page }) => {
    // Try to access admin dashboard without login
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
    
    // Try to access restaurant dashboard without login
    await page.goto('/restaurant-dashboard');
    await expect(page).toHaveURL(/\/restaurant-login/);
  });
});

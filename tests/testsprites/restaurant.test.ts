import { test, expect } from '@playwright/test';
import { loginAsRestaurant, SELECTORS, TEST_CREDENTIALS, clearTestData } from '../test-utils';

test.describe('Restaurant Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRestaurant(page);
    await expect(page).toHaveURL('/restaurant-dashboard');
  });

  test.afterAll(async () => {
    await clearTestData();
  });

  test('should display restaurant dashboard', async ({ page }) => {
    // Check if dashboard loads correctly
    await expect(page).toHaveTitle(/Restaurant Dashboard/);
    await expect(page.locator(SELECTORS.heading(/Welcome/))).toBeVisible();
    
    // Verify dashboard stats are visible
    const stats = await page.locator('.stat-card').all();
    expect(stats.length).toBeGreaterThan(0);
  });

  test('should display and manage menu items', async ({ page }) => {
    // Navigate to menu items
    await page.click(SELECTORS.link('Menu Items'));
    await expect(page).toHaveURL(/\/menu-items/);
    
    // Check if menu items section is visible
    await expect(page.locator(SELECTORS.heading('Menu Items'))).toBeVisible();
    
    // Check for existing menu items or empty state
    const menuItems = await page.locator('.menu-item').count();
    if (menuItems > 0) {
      // If there are menu items, verify they are displayed correctly
      const firstItem = page.locator('.menu-item').first();
      await expect(firstItem.locator('.item-name')).toBeVisible();
      await expect(firstItem.locator('.item-price')).toBeVisible();
    } else {
      // Test empty state
      await expect(page.locator('text=No menu items found')).toBeVisible();
      await expect(page.locator('button:has-text("Add Menu Item")')).toBeVisible();
    }
  });

  test('should navigate to QR code page', async ({ page }) => {
    // Test QR code page navigation
    await page.click(SELECTORS.link('QR Code'));
    await expect(page).toHaveURL(/\/qr-code/);
    
    // Verify QR code is displayed
    await expect(page.locator('.qr-code-container')).toBeVisible();
    
    // Verify download button is present
    const downloadButton = page.locator('button:has-text("Download QR Code")');
    await expect(downloadButton).toBeVisible();
  });

  test('should handle password reset request with correct details', async ({ page }) => {
    // Navigate to account settings
    await page.click(SELECTORS.link('Account Settings'));
    await page.click(SELECTORS.link('Change Password'));
    
    // Click the contact admin link
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click(SELECTORS.link('Contact Admin'))
    ]);
    
    // Verify the popup URL contains the WhatsApp link
    const whatsappUrl = await popup.url();
    expect(whatsappUrl).toContain('https://wa.me/918830778401');
    
    // Verify the pre-filled message contains the restaurant's email
    const expectedMessage = encodeURIComponent(
      `Hello Admin, I need to reset my restaurant account password. My email is: ${TEST_CREDENTIALS.restaurant.email}`
    );
    expect(whatsappUrl).toContain(expectedMessage);
    
    // Close the popup
    await popup.close();
  });

  test('should log out successfully', async ({ page }) => {
    // Test logout functionality
    await page.click('button[aria-label="User menu"]');
    await page.click(SELECTORS.link('Logout'));
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/restaurant-login/);
    
    // Verify user is actually logged out by trying to access dashboard
    await page.goto('/restaurant-dashboard');
    await expect(page).toHaveURL(/\/restaurant-login/);
  });
});

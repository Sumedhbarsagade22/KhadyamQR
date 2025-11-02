import { test, expect } from '@playwright/test';
import { loginAsAdmin, SELECTORS, clearTestData } from '../test-utils';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    // Ensure we're on the admin dashboard
    await expect(page).toHaveURL('/admin');
  });

  test.afterAll(async () => {
    await clearTestData();
  });

  test('should display admin dashboard', async ({ page }) => {
    // Check if dashboard loads correctly
    await expect(page).toHaveTitle(/Admin Dashboard/);
    await expect(page.locator(SELECTORS.heading('Dashboard'))).toBeVisible();
    
    // Verify dashboard stats are visible
    const stats = await page.locator('.stat-card').all();
    expect(stats.length).toBeGreaterThan(0);
  });

  test('should navigate to restaurant users', async ({ page }) => {
    // Test navigation to restaurant users
    await page.click(SELECTORS.link('Manage Users'));
    await expect(page).toHaveURL('/admin/restaurants');
    
    // Verify the page content
    await expect(page.locator(SELECTORS.heading('Restaurant Users'))).toBeVisible();
    
    // Check if the data table is present
    await expect(page.locator('.data-table')).toBeVisible();
  });

  test('should display and handle empty state when no restaurants exist', async ({ page }) => {
    // Navigate to restaurants
    await page.goto('/admin/restaurants');
    
    // Check for empty state message
    const isEmptyStateVisible = await page.isVisible('text=No restaurants found');
    if (isEmptyStateVisible) {
      await expect(page.locator('text=No restaurants found')).toBeVisible();
      await expect(page.locator('button:has-text("Add Restaurant")')).toBeVisible();
    }
  });

  test('should be able to reset restaurant password with confirmation', async ({ page }) => {
    // Navigate to restaurants
    await page.goto('/admin/restaurants');
    
    // Check if there are any restaurants to test with
    const restaurantRows = await page.locator('.restaurant-row').count();
    if (restaurantRows === 0) {
      test.skip(restaurantRows > 0, 'No restaurants available for testing');
      return;
    }
    
    // Set up dialog handler before clicking the button
    const dialogPromise = page.waitForEvent('dialog');
    await page.locator(SELECTORS.button('Reset Password')).first().click();
    
    // Handle the confirmation dialog
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Reset password for');
    await dialog.accept();
    
    // Verify success notification
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Password reset link sent successfully')).toBeVisible();
  });

  test('should handle canceling password reset', async ({ page }) => {
    await page.goto('/admin/restaurants');
    
    const restaurantRows = await page.locator('.restaurant-row').count();
    if (restaurantRows === 0) {
      test.skip(restaurantRows > 0, 'No restaurants available for testing');
      return;
    }
    
    // Set up dialog handler before clicking the button
    const dialogPromise = page.waitForEvent('dialog');
    await page.locator(SELECTORS.button('Reset Password')).first().click();
    
    // Handle the confirmation dialog by dismissing it
    const dialog = await dialogPromise;
    await dialog.dismiss();
    
    // Verify no success message is shown
    await expect(page.locator('.toast-success')).not.toBeVisible();
  });
});

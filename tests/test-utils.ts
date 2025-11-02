import { Page } from '@playwright/test';

export const TEST_CREDENTIALS = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'admin123',
  },
  restaurant: {
    email: process.env.TEST_RESTAURANT_EMAIL || 'restaurant@example.com',
    password: process.env.TEST_RESTAURANT_PASSWORD || 'restaurant123',
  },
};

export const SELECTORS = {
  // Auth
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitButton: 'button[type="submit"]',
  
  // Navigation
  adminMenu: 'nav a[href^="/admin"]',
  
  // Common
  heading: (name: string | RegExp) => `h1,h2,h3:has-text("${name}")`,
  button: (text: string) => `button:has-text("${text}")`,
  link: (text: string) => `a:has-text("${text}")`,
};

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.admin.email);
  await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.admin.password);
  await page.click(SELECTORS.submitButton);
  await page.waitForURL('/admin');
}

export async function loginAsRestaurant(page: Page) {
  await page.goto('/restaurant-login');
  await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.restaurant.email);
  await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.restaurant.password);
  await page.click(SELECTORS.submitButton);
  await page.waitForURL('/restaurant-dashboard');
}

export async function clearTestData() {
  // TODO: Implement test data cleanup
  // This should clear any test data created during tests
}

export function expectToBeDefined<T>(value: T | undefined | null): asserts value is T {
  expect(value).toBeDefined();
}

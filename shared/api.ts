/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Menu item categories
 */
export const MENU_CATEGORIES = [
  'Starters',
  'Appetizers',
  'Soups & Salads',
  'Main Course',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials',
] as const;

export type MenuCategory = typeof MENU_CATEGORIES[number];

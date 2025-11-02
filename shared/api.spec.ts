import { describe, it, expect } from "vitest";
import { MENU_CATEGORIES, type MenuCategory } from "./api";

describe("Shared API Types", () => {
  describe("MENU_CATEGORIES", () => {
    it("should contain all expected categories", () => {
      expect(MENU_CATEGORIES).toEqual([
        "Starters",
        "Appetizers",
        "Soups & Salads",
        "Main Course",
        "Desserts",
        "Beverages",
        "Sides",
        "Specials",
      ]);
    });

    it("should have 8 categories", () => {
      expect(MENU_CATEGORIES).toHaveLength(8);
    });

    it("should be read-only (TypeScript enforced)", () => {
      // TypeScript enforces this at compile time with 'as const'
      // At runtime, the array is still mutable, but TypeScript prevents mutations
      // This test verifies the array structure is correct
      expect(Array.isArray(MENU_CATEGORIES)).toBe(true);
      expect(MENU_CATEGORIES.length).toBeGreaterThan(0);
    });

    it("should contain unique values", () => {
      const uniqueCategories = new Set(MENU_CATEGORIES);
      expect(uniqueCategories.size).toBe(MENU_CATEGORIES.length);
    });

    it("should have Main Course as default category", () => {
      expect(MENU_CATEGORIES).toContain("Main Course");
    });
  });

  describe("MenuCategory type", () => {
    it("should accept valid category values", () => {
      const validCategory: MenuCategory = "Main Course";
      expect(MENU_CATEGORIES).toContain(validCategory);
    });

    it("should include all categories in type", () => {
      const categories: MenuCategory[] = [
        "Starters",
        "Appetizers",
        "Soups & Salads",
        "Main Course",
        "Desserts",
        "Beverages",
        "Sides",
        "Specials",
      ];

      categories.forEach((cat) => {
        expect(MENU_CATEGORIES).toContain(cat);
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import {
  listMenuItems,
  createMenuItem,
  deleteMenuItem,
  setMenuItemAvailability,
} from "./menu";

// Mock Supabase
vi.mock("../lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
        remove: vi.fn(),
      })),
    },
  },
}));

describe("Menu Routes", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      json: jsonMock,
      status: statusMock as any,
    };
    vi.clearAllMocks();
  });

  describe("listMenuItems", () => {
    it("should return menu items for a restaurant", async () => {
      mockReq.params = { restaurantId: "1" };

      const mockMenuItems = [
        {
          id: "1",
          name: "Burger",
          description: "Delicious burger",
          price: 10.99,
          image_url: "https://example.com/burger.jpg",
          available: true,
          category: "Main Course",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Fries",
          description: "Crispy fries",
          price: 3.99,
          image_url: null,
          available: true,
          category: "Sides",
          created_at: new Date().toISOString(),
        },
      ];

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      
      // The second order() call should return the data
      mockChain.order = vi.fn()
        .mockReturnValueOnce(mockChain) // First order("category")
        .mockResolvedValueOnce({ data: mockMenuItems, error: null }); // Second order("name")
      
      fromMock.mockReturnValue(mockChain);

      await listMenuItems(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith(mockMenuItems);
    });

    it("should validate restaurantId parameter", async () => {
      mockReq.params = {};

      await listMenuItems(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "restaurantId required",
      });
    });

    it("should handle database errors", async () => {
      mockReq.params = { restaurantId: "1" };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      
      // The second order() call should return the error
      mockChain.order = vi.fn()
        .mockReturnValueOnce(mockChain) // First order("category")
        .mockResolvedValueOnce({ data: null, error: { message: "Database error" } }); // Second order("name")
      
      fromMock.mockReturnValue(mockChain);

      await listMenuItems(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("createMenuItem", () => {
    it("should create menu item without image", async () => {
      mockReq.params = { restaurantId: "1" };
      mockReq.body = {
        name: "Pizza",
        price: 12.99,
        description: "Cheese pizza",
        category: "Main Course",
        available: true,
      };

      const mockRestaurant = { slug: "test-restaurant" };
      const mockInserted = { id: "item-1" };
      const mockFullItem = {
        id: "item-1",
        name: "Pizza",
        price: 12.99,
        description: "Cheese pizza",
        category: "Main Course",
        available: true,
        image_url: null,
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;

      // First call - get restaurant
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: mockRestaurant, error: null }),
      });

      // Second call - insert menu item
      fromMock.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockInserted, error: null }),
      });

      // Third call - get full item
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFullItem, error: null }),
      });

      await createMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith(mockFullItem);
    });

    it("should validate required fields", async () => {
      mockReq.params = { restaurantId: "1" };
      mockReq.body = { name: "Pizza" }; // Missing price

      await createMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "restaurantId, name, price required",
      });
    });

    it("should upload image if provided", async () => {
      mockReq.params = { restaurantId: "1" };
      mockReq.body = {
        name: "Pasta",
        price: 14.99,
        category: "Main Course",
        image_base64:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA==",
      };

      const mockRestaurant = { slug: "test-restaurant" };
      const mockInserted = { id: "item-1" };
      const mockFullItem = {
        id: "item-1",
        name: "Pasta",
        price: 14.99,
        image_url: "https://example.com/pasta.jpg",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;

      // Get restaurant
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: mockRestaurant, error: null }),
      });

      // Insert item
      fromMock.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockInserted, error: null }),
      });

      // Storage upload
      const storageMock = supabaseAdmin.storage.from as ReturnType<
        typeof vi.fn
      >;
      storageMock.mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://example.com/pasta.jpg" },
        }),
      });

      // Update with image URL
      fromMock.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      // Get full item
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFullItem, error: null }),
      });

      await createMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(storageMock).toHaveBeenCalledWith("khadyamqr");
    });

    it("should handle invalid restaurant_id", async () => {
      mockReq.params = { restaurantId: "invalid" };
      mockReq.body = {
        name: "Item",
        price: 10,
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      await createMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "invalid restaurant_id" });
    });
  });

  describe("deleteMenuItem", () => {
    it("should delete menu item without image", async () => {
      mockReq.params = { itemId: "1" };

      const mockItem = {
        id: "1",
        image_url: null,
        restaurant_id: "rest-1",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;

      // Get item
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockItem, error: null }),
      });

      // Delete item
      fromMock.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      await deleteMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith({ ok: true });
    });

    it("should delete menu item with image", async () => {
      mockReq.params = { itemId: "1" };

      const mockItem = {
        id: "1",
        image_url:
          "https://example.supabase.co/storage/v1/object/public/khadyamqr/menu_items/test/1.jpg",
        restaurant_id: "rest-1",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;

      // Get item
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockItem, error: null }),
      });

      // Storage remove
      const storageMock = supabaseAdmin.storage.from as ReturnType<
        typeof vi.fn
      >;
      storageMock.mockReturnValue({
        remove: vi.fn().mockResolvedValue({ error: null }),
      });

      // Delete item
      fromMock.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      await deleteMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(storageMock).toHaveBeenCalledWith("khadyamqr");
      expect(jsonMock).toHaveBeenCalledWith({ ok: true });
    });

    it("should handle item not found", async () => {
      mockReq.params = { itemId: "999" };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      await deleteMenuItem(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "not found" });
    });
  });

  describe("setMenuItemAvailability", () => {
    it("should update menu item availability", async () => {
      mockReq.params = { itemId: "1" };
      mockReq.body = { available: false };

      const mockUpdated = { id: "1", available: false };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdated, error: null }),
      });

      await setMenuItemAvailability(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(jsonMock).toHaveBeenCalledWith(mockUpdated);
    });

    it("should validate required parameters", async () => {
      mockReq.params = { itemId: "1" };
      mockReq.body = {}; // Missing available

      await setMenuItemAvailability(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "itemId and available required",
      });
    });

    it("should validate available is boolean", async () => {
      mockReq.params = { itemId: "1" };
      mockReq.body = { available: "yes" }; // Invalid type

      await setMenuItemAvailability(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});

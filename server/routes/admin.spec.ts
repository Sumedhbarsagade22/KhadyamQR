import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import {
  listRestaurants,
  createRestaurant,
  uploadQrAndSave,
  deleteRestaurant,
  toggleRestaurantStatus,
  createRestaurantLogin,
} from "./admin";

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
      })),
    },
    auth: {
      admin: {
        createUser: vi.fn(),
        deleteUser: vi.fn(),
      },
    },
  },
}));

describe("Admin Routes", () => {
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

  describe("listRestaurants", () => {
    it("should return list of restaurants", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Restaurant",
          slug: "test-restaurant",
          logo_url: null,
          qr_url: null,
          active: true,
          created_at: new Date().toISOString(),
        },
      ];

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      await listRestaurants(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith(mockData);
    });

    it("should handle database errors", async () => {
      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      });

      await listRestaurants(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("createRestaurant", () => {
    it("should create restaurant without logo", async () => {
      mockReq.body = {
        name: "New Restaurant",
        slug: "new-restaurant",
      };

      const mockRestaurant = {
        id: "1",
        name: "New Restaurant",
        slug: "new-restaurant",
        logo_url: null,
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockRestaurant, error: null }),
      });

      await createRestaurant(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith(mockRestaurant);
    });

    it("should validate required fields", async () => {
      mockReq.body = { name: "Test" }; // Missing slug

      await createRestaurant(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "name and slug required",
      });
    });

    it("should upload logo if provided", async () => {
      mockReq.body = {
        name: "Restaurant with Logo",
        slug: "restaurant-logo",
        logo_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const storageMock = supabaseAdmin.storage.from as ReturnType<typeof vi.fn>;
      storageMock.mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://example.com/logo.png" },
        }),
      });

      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: "1", logo_url: "https://example.com/logo.png" },
          error: null,
        }),
      });

      await createRestaurant(mockReq as Request, mockRes as Response, vi.fn());

      expect(storageMock).toHaveBeenCalledWith("khadyamqr");
    });
  });

  describe("uploadQrAndSave", () => {
    it("should upload QR code and save URL", async () => {
      mockReq.body = {
        slug: "test-restaurant",
        restaurant_id: "1",
        qr_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
      mockReq.query = {};

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const storageMock = supabaseAdmin.storage.from as ReturnType<typeof vi.fn>;
      storageMock.mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://example.com/qr.png" },
        }),
      });

      await uploadQrAndSave(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith({
        qr_url: "https://example.com/qr.png",
      });
    });

    it("should return existing QR if not forced", async () => {
      mockReq.body = {
        slug: "test-restaurant",
        restaurant_id: "1",
        qr_base64: "data:image/png;base64,test",
      };
      mockReq.query = { force: "false" };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { qr_url: "https://example.com/existing-qr.png" },
          error: null,
        }),
      });

      await uploadQrAndSave(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith({
        qr_url: "https://example.com/existing-qr.png",
      });
    });
  });

  describe("deleteRestaurant", () => {
    it("should delete restaurant by id", async () => {
      mockReq.params = { id: "1" };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      await deleteRestaurant(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should validate id parameter", async () => {
      mockReq.params = {};

      await deleteRestaurant(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "id required" });
    });
  });

  describe("toggleRestaurantStatus", () => {
    it("should toggle restaurant active status", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { active: false };

      const { supabaseAdmin } = await import("../lib/supabase");
      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      await toggleRestaurantStatus(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(jsonMock).toHaveBeenCalledWith({ success: true, active: false });
    });

    it("should validate active is boolean", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { active: "yes" }; // Invalid type

      await toggleRestaurantStatus(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "active must be boolean",
      });
    });
  });

  describe("createRestaurantLogin", () => {
    it("should create restaurant login successfully", async () => {
      mockReq.body = {
        restaurant_id: "1",
        email: "test@example.com",
        password: "password123",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const authMock = supabaseAdmin.auth.admin.createUser as ReturnType<
        typeof vi.fn
      >;
      authMock.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      await createRestaurantLogin(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        email: "test@example.com",
        user_id: "user-123",
      });
    });

    it("should validate password length", async () => {
      mockReq.body = {
        restaurant_id: "1",
        email: "test@example.com",
        password: "12345", // Too short
      };

      await createRestaurantLogin(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Password must be at least 6 characters",
      });
    });

    it("should rollback auth user if database insert fails", async () => {
      mockReq.body = {
        restaurant_id: "1",
        email: "test@example.com",
        password: "password123",
      };

      const { supabaseAdmin } = await import("../lib/supabase");
      const authCreateMock = supabaseAdmin.auth.admin.createUser as ReturnType<
        typeof vi.fn
      >;
      const authDeleteMock = supabaseAdmin.auth.admin.deleteUser as ReturnType<
        typeof vi.fn
      >;

      authCreateMock.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const fromMock = supabaseAdmin.from as ReturnType<typeof vi.fn>;
      fromMock.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: { message: "Database error" },
        }),
      });

      await createRestaurantLogin(
        mockReq as Request,
        mockRes as Response,
        vi.fn()
      );

      expect(authDeleteMock).toHaveBeenCalledWith("user-123");
      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });
});

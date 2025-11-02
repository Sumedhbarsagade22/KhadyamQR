import type { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export const listRestaurants: RequestHandler = async (_req, res) => {
  // listRestaurants: start

  try {
    // Log environment variables (without sensitive data)
    // supabase config checks

    // Add a small delay to ensure logs are visible
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { data, error } = await supabaseAdmin
      .from("restaurants")
      .select("id,name,slug,logo_url,qr_url,active,created_at")
      .order("created_at", { ascending: false });

    // supabase response status available

    if (error) {
      console.error("❌ [listRestaurants] Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Provide more specific error messages based on common issues
      if (error.code === "42501") {
        return res.status(403).json({
          error: "Permission denied",
          message:
            "The service role key does not have permission to access the restaurants table",
          code: error.code,
          hint: "Check your RLS policies and ensure the service role key has proper permissions",
        });
      }

      if (error.code === "42P01") {
        return res.status(404).json({
          error: "Table not found",
          message: "The restaurants table does not exist in your database",
          code: error.code,
          hint: "Run your database migrations to create the required tables",
        });
      }

      return res.status(500).json({
        error: "Database error",
        message: error.message,
        code: error.code,
        details: error.details,
      });
    }

    // fetched restaurants count
    return res.json(data || []);
  } catch (err) {
    console.error("🔥 [listRestaurants] Unexpected error:", err);

    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Unknown error";

    return res.status(500).json({
      error: "Internal server error",
      message: errorMessage,
      ...(process.env.NODE_ENV === "development" && {
        stack: err instanceof Error ? err.stack : undefined,
      }),
    });
  }
};

export const createRestaurant: RequestHandler = async (req, res) => {
  const { name, slug, logo_base64 } = req.body as {
    name: string;
    slug: string;
    logo_base64?: string;
  };
  if (!name || !slug)
    return res.status(400).json({ error: "name and slug required" });

  let logo_url: string | null = null;
  if (logo_base64) {
    const buffer = Buffer.from(logo_base64.split(",").pop() || "", "base64");
    const path = `logos/${slug}/logo.png`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("khadyamqr")
      .upload(path, buffer, { upsert: true, contentType: "image/png" });
    if (upErr) return res.status(500).json({ error: upErr.message });
    const { data: pub } = supabaseAdmin.storage
      .from("khadyamqr")
      .getPublicUrl(path);
    logo_url = pub.publicUrl;
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({ name, slug, logo_url })
    .select("*")
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const uploadQrAndSave: RequestHandler = async (req, res) => {
  const { slug, restaurant_id, qr_base64 } = req.body as {
    slug: string;
    restaurant_id: string;
    qr_base64: string;
  };
  const force = String(req.query.force || "false").toLowerCase() === "true";
  if (!slug || !restaurant_id || !qr_base64)
    return res
      .status(400)
      .json({ error: "slug, restaurant_id, qr_base64 required" });

  const { data: r, error: rErr } = await supabaseAdmin
    .from("restaurants")
    .select("qr_url")
    .eq("id", restaurant_id)
    .maybeSingle();
  if (rErr) return res.status(500).json({ error: rErr.message });
  if (r?.qr_url && !force) {
    return res.json({ qr_url: r.qr_url });
  }

  const buffer = Buffer.from(qr_base64.split(",").pop() || "", "base64");
  const path = `qr/${slug}/qr.png`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("khadyamqr")
    .upload(path, buffer, {
      upsert: true,
      contentType: "image/png",
      cacheControl: "31536000, immutable",
    });
  if (upErr) return res.status(500).json({ error: upErr.message });
  const { data: pub } = supabaseAdmin.storage
    .from("khadyamqr")
    .getPublicUrl(path);
  const { error: updErr } = await supabaseAdmin
    .from("restaurants")
    .update({ qr_url: pub.publicUrl })
    .eq("id", restaurant_id);
  if (updErr) return res.status(500).json({ error: updErr.message });
  res.json({ qr_url: pub.publicUrl });
};

export const deleteRestaurant: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "id required" });

  const { error } = await supabaseAdmin
    .from("restaurants")
    .delete()
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

export const resetRestaurantPassword: RequestHandler = async (req, res) => {
  const { email, new_password } = req.body as {
    email: string;
    new_password: string;
  };

  if (!email || !new_password) {
    return res
      .status(400)
      .json({ error: "Email and new_password are required" });
  }

  // Validate password strength
  const passwordErrors = [];
  if (new_password.length < 8) passwordErrors.push("at least 8 characters");
  if (!/[a-z]/.test(new_password)) passwordErrors.push("one lowercase letter");
  if (!/[A-Z]/.test(new_password)) passwordErrors.push("one uppercase letter");
  if (!/\d/.test(new_password)) passwordErrors.push("one number");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/.test(new_password))
    passwordErrors.push("one special character");

  if (passwordErrors.length > 0) {
    return res.status(400).json({
      error: `Password must contain: ${passwordErrors.join(", ")}`,
    });
  }

  try {
    // Verify the user exists in restaurant_users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from("restaurant_users")
      .select("email")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: "Restaurant user not found" });
    }

    // Get all users and find the one with matching email
    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (listError || !users) {
      console.error("Error listing auth users:", listError);
      return res
        .status(500)
        .json({ error: "Failed to retrieve user information" });
    }

    const authUser = users.find((u) => u.email === email);
    if (!authUser) {
      return res.status(404).json({ error: "Auth user not found" });
    }

    // Update the user's password using the admin API with the user ID
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        password: new_password,
      });

    if (authError) {
      console.error("Error updating password:", authError);
      return res.status(500).json({ error: "Failed to update password" });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
      user: {
        email: authData.user.email,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in resetRestaurantPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleRestaurantStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body as { active: boolean };
  if (!id) return res.status(400).json({ error: "id required" });
  if (typeof active !== "boolean")
    return res.status(400).json({ error: "active must be boolean" });

  const { error } = await supabaseAdmin
    .from("restaurants")
    .update({ active })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, active });
};

export const createRestaurantLogin: RequestHandler = async (req, res) => {
  const { restaurant_id, email, password } = req.body as {
    restaurant_id: string;
    email: string;
    password: string;
  };

  if (!restaurant_id || !email || !password) {
    return res
      .status(400)
      .json({ error: "restaurant_id, email, and password required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // Add to restaurant_users table
    const { error: dbError } = await supabaseAdmin
      .from("restaurant_users")
      .insert({ email, restaurant_id });

    if (dbError) {
      // Rollback: delete auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }

    res.json({ success: true, email, user_id: authData.user.id });
  } catch (error: any) {
    console.error("Create login error:", error);
    res.status(500).json({ error: error.message || "Failed to create login" });
  }
};

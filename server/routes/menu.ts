import type { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export const listMenuItems: RequestHandler = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  if (!restaurantId) return res.status(400).json({ error: "restaurantId required" });
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("id,name,description,price,image_url,available,category,created_at")
    .eq("restaurant_id", restaurantId)
    .order("category")
    .order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createMenuItem: RequestHandler = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const { name, price, description, category = 'Main Course', available = true, image_base64 } = req.body as {
    name: string; price: number; description?: string; category?: string; available?: boolean; image_base64?: string;
  };
  if (!restaurantId || !name || typeof price !== 'number') return res.status(400).json({ error: "restaurantId, name, price required" });

  // get restaurant slug for storage path
  const { data: r, error: rErr } = await supabaseAdmin.from("restaurants").select("slug").eq("id", restaurantId).maybeSingle();
  if (rErr || !r) return res.status(400).json({ error: "invalid restaurant_id" });

  const { data: inserted, error: insErr } = await supabaseAdmin
    .from("menu_items").insert({ restaurant_id: restaurantId, name, price, description: description ?? null, category, available }).select("id").single();
  if (insErr) return res.status(500).json({ error: insErr.message });

  let image_url: string | null = null;
  if (image_base64) {
    const buffer = Buffer.from(image_base64.split(",").pop() || "", "base64");
    const path = `menu_items/${r.slug}/${inserted.id}.jpg`;
    const { error: upErr } = await supabaseAdmin.storage.from("khadyamqr").upload(path, buffer, { upsert: true, contentType: "image/jpeg" });
    if (upErr) return res.status(500).json({ error: upErr.message });
    const { data: pub } = supabaseAdmin.storage.from("khadyamqr").getPublicUrl(path);
    image_url = pub.publicUrl;
    await supabaseAdmin.from("menu_items").update({ image_url }).eq("id", inserted.id);
  }

  const { data: full, error: getErr } = await supabaseAdmin.from("menu_items").select("*").eq("id", inserted.id).single();
  if (getErr) return res.status(500).json({ error: getErr.message });
  res.json(full);
};

export const deleteMenuItem: RequestHandler = async (req, res) => {
  const itemId = req.params.itemId;
  if (!itemId) return res.status(400).json({ error: "itemId required" });
  // Optionally delete image from storage if present
  const { data: item, error: iErr } = await supabaseAdmin.from("menu_items").select("id,image_url,restaurant_id").eq("id", itemId).maybeSingle();
  if (iErr) return res.status(500).json({ error: iErr.message });
  if (!item) return res.status(404).json({ error: "not found" });
  if (item.image_url) {
    try {
      const url = new URL(item.image_url);
      // Supabase public URL format: /storage/v1/object/public/khadyamqr/<path>
      const marker = "/storage/v1/object/public/khadyamqr/";
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        const relative = decodeURIComponent(url.pathname.slice(idx + marker.length));
        await supabaseAdmin.storage.from("khadyamqr").remove([relative]);
      }
    } catch {}
  }
  const { error: delErr } = await supabaseAdmin.from("menu_items").delete().eq("id", itemId);
  if (delErr) return res.status(500).json({ error: delErr.message });
  res.json({ ok: true });
};

export const setMenuItemAvailability: RequestHandler = async (req, res) => {
  const itemId = req.params.itemId;
  const { available } = req.body as { available: boolean };
  if (!itemId || typeof available !== 'boolean') return res.status(400).json({ error: "itemId and available required" });
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update({ available })
    .eq("id", itemId)
    .select("id,available")
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

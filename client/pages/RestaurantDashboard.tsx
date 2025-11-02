import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/ImagePreview";
import { MENU_CATEGORIES } from "@shared/api";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  qr_url: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  category: string;
}

export default function RestaurantDashboard() {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/restaurant-login");
        return;
      }

      // Get restaurant for this user via restaurant_users table
      const { data: restaurantUserData, error: ruError } = await supabase
        .from("restaurant_users")
        .select("restaurant_id")
        .eq("email", session.user.email)
        .single();

      if (ruError || !restaurantUserData) {
        alert("No restaurant found for your account. Contact admin.");
        await supabase.auth.signOut();
        navigate("/restaurant-login");
        return;
      }

      const { data: restaurantData, error: restError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantUserData.restaurant_id)
        .single();

      if (restError || !restaurantData) {
        alert("No restaurant found for your account. Contact admin.");
        await supabase.auth.signOut();
        navigate("/restaurant-login");
        return;
      }

      // Check if restaurant is active
      if (!restaurantData.active && restaurantData.active !== null) {
        alert(
          "⚠️ Your restaurant has been disabled by the admin. Please contact admin to reactivate.",
        );
        await supabase.auth.signOut();
        navigate("/restaurant-login");
        return;
      }

      setRestaurant(restaurantData);
      await loadMenuItems(restaurantData.id);
      setLoading(false);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/restaurant-login");
    }
  };

  const loadMenuItems = async (restaurantId: string) => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMenuItems(data);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setLoading(true);
    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${restaurant.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("khadyamqr")
          .upload(`menu/${fileName}`, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("khadyamqr")
          .getPublicUrl(`menu/${fileName}`);

        imageUrl = publicData.publicUrl;
      }

      // Insert menu item
      const { error } = await supabase.from("menu_items").insert({
        restaurant_id: restaurant.id,
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
        available: true,
      });

      if (error) throw error;

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Main Course");
      setImageFile(null);
      setShowAddForm(false);

      await loadMenuItems(restaurant.id);
      alert("✅ Menu item added successfully!");
    } catch (error: any) {
      alert("Failed to add menu item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);

    if (!error && restaurant) {
      await loadMenuItems(restaurant.id);
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    if (!confirm("Delete this menu item?")) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", itemId);

    if (!error && restaurant) {
      await loadMenuItems(restaurant.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/restaurant-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-8 w-8 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  setPreviewImage({
                    src: restaurant.logo_url!,
                    alt: `${restaurant.name} logo`,
                  })
                }
              />
            )}
            <div>
              <h1 className="font-bold">{restaurant.name}</h1>
              <p className="text-xs text-muted-foreground">
                Restaurant Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              👁️ View Menu
            </a>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.div
            className="rounded-lg border bg-card p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {menuItems.length}
            </motion.div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </motion.div>
          <motion.div
            className="rounded-lg border bg-card p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.2)",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.1,
            }}
          >
            <motion.div
              className="text-2xl font-bold text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {menuItems.filter((i) => i.available).length}
            </motion.div>
            <div className="text-xs text-muted-foreground">Available</div>
          </motion.div>
          <motion.div
            className="rounded-lg border bg-card p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 25px rgba(234, 88, 12, 0.2)",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.2,
            }}
          >
            <motion.div
              className="text-2xl font-bold text-orange-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {menuItems.filter((i) => !i.available).length}
            </motion.div>
            <div className="text-xs text-muted-foreground">Unavailable</div>
          </motion.div>
          <motion.div
            className="rounded-lg border bg-card p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.3,
            }}
          >
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {new Set(menuItems.map((i) => i.category)).size}
            </motion.div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </motion.div>
        </motion.div>
        {/* QR Code Section */}
        {restaurant.qr_url && (
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Your QR Code</h2>
            <div className="flex items-center gap-6">
              <img
                src={restaurant.qr_url}
                alt="QR Code"
                className="w-48 h-48 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  setPreviewImage({
                    src: restaurant.qr_url!,
                    alt: `${restaurant.name} QR Code`,
                  })
                }
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Customers can scan this QR code to view your menu
                </p>
                <Button
                  onClick={() =>
                    downloadQRCode(
                      restaurant.qr_url!,
                      `${restaurant.slug}-qr.png`,
                    )
                  }
                  className="inline-flex h-10 items-center rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90"
                >
                  📥 Download QR Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">
              Menu Items ({menuItems.length})
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-md border px-3 text-sm flex-1 sm:w-64"
              />
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Cancel" : "+ Add Item"}
              </Button>
            </div>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddMenuItem}
              className="bg-muted/50 rounded-lg p-4 mb-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-md border px-3"
                  placeholder="e.g. Margherita Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 min-h-[80px]"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-10 rounded-md border px-3"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-md border px-3"
                  required
                >
                  {MENU_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full h-10 rounded-md border px-3 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-2"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Menu Item"}
              </Button>
            </form>
          )}

          {/* Menu Items List */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
          >
            {menuItems.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                (item.description &&
                  item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())),
            ).length === 0 ? (
              searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items found matching "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No menu items yet. Add your first item!</p>
                </div>
              )
            ) : (
              menuItems
                .filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.category
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    (item.description &&
                      item.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
                )
                .map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 5px 15px rgba(16, 185, 129, 0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          setPreviewImage({
                            src: item.image_url!,
                            alt: item.name,
                          })
                        }
                      />
                    ) : (
                      <div className="w-20 h-20 rounded bg-muted grid place-items-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm font-medium">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          • 📁 {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(item)}
                      >
                        {item.available ? "⏸️" : "▶️"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </main>
      {previewImage && (
        <ImagePreview
          src={previewImage.src}
          alt={previewImage.alt}
          open={!!previewImage}
          onOpenChange={(open) => !open && setPreviewImage(null)}
        />
      )}
    </div>
  );
}

// Helper function to download QR code
function downloadQRCode(url: string, filename: string) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("Download failed:", error);
      alert(
        'Failed to download QR code. Please try right-clicking the QR image and selecting "Save image as..."',
      );
    });
}

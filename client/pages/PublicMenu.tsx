import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { ImagePreview } from "@/components/ImagePreview";

interface Restaurant { id: string; name: string; slug: string; logo_url: string | null; active?: boolean }
interface MenuItem { id: string; name: string; description: string | null; price: number; image_url: string | null; available: boolean; category: string }

export default function PublicMenu() {
  const params = useParams();
  const slug = params.slug as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: r, error: rErr } = await supabase.from("restaurants").select("id,name,slug,logo_url,active").eq("slug", slug).maybeSingle();
      if (rErr || !r) { setLoading(false); return; }
      setRestaurant(r as any);
      const { data: mi } = await supabase.from("menu_items").select("id,name,description,price,image_url,available,category").eq("restaurant_id", r.id).order("category").order("name");
      setItems((mi || []) as any);
      setLoading(false);
    };
    if (slug) void load();
  }, [slug]);

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!restaurant) return <div className="min-h-screen grid place-items-center">Restaurant not found</div>;
  
  // Check if restaurant is disabled
  if (restaurant.active === false) {
    return (
      <div className="min-h-screen grid place-items-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold">Restaurant Temporarily Unavailable</h1>
          <p className="text-muted-foreground">
            This restaurant has been temporarily disabled due to pending subscription payment.
          </p>
          <p className="text-sm font-medium">
            Please contact the restaurant administrator to resolve this issue.
          </p>
          <div className="pt-4">
            <img src="/khadyamqr-logo.svg" alt="KhadyamQR" className="h-8 w-8 mx-auto opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="container h-16 flex items-center gap-3">
          {restaurant.logo_url ? (
            <img 
              src={restaurant.logo_url} 
              alt="logo" 
              className="h-10 w-10 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => setPreviewImage({ src: restaurant.logo_url!, alt: `${restaurant.name} logo` })}
            />
          ) : (
            <div className="h-10 w-10 rounded bg-muted" />
          )}
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <img src="/khadyamqr-logo.svg" alt="KhadyamQR logo" className="h-5 w-5 rounded" />
            <Link to="/">KhadyamQR</Link>
          </div>
        </div>
      </header>
      <main className="container py-6">
        {/* Group items by category */}
        {Object.entries(
          items.reduce((acc, item) => {
            const cat = item.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {} as Record<string, MenuItem[]>)
        ).map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map(item => (
            <article key={item.id} className="rounded-xl border bg-card overflow-hidden relative">
              <div className="absolute left-2 top-2 z-10">
                <Badge variant={item.available ? "secondary" : "destructive"}>
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className={`h-40 w-full object-cover cursor-pointer hover:opacity-70 transition-opacity ${item.available ? '' : 'opacity-50'}`}
                  onClick={() => setPreviewImage({ src: item.image_url!, alt: item.name })}
                />
              ) : (
                <div className={`h-40 w-full bg-muted ${item.available ? '' : 'opacity-50'}`} />
              )}
              <div className="p-4 grid gap-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`font-semibold ${item.available ? '' : 'line-through opacity-70'}`}>{item.name}</h3>
                  <div className="font-semibold">₹{Number(item.price).toFixed(2)}</div>
                </div>
                {item.description && <p className={`text-sm text-muted-foreground ${item.available ? '' : 'opacity-70'}`}>{item.description}</p>}
              </div>
              </article>
              ))}
            </div>
          </div>
        ))}
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

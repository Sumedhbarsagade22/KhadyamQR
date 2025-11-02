import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
// icons removed - unused in this file
import { getBaseUrl } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { checkAuth, signOut as authSignOut } from "@/lib/auth";
import { ResetPasswordDialog } from "@/components/admin/ResetPasswordDialog";
import slugify from "slugify";
import { QRCodeCanvas } from "qrcode.react";
import { ImagePreview } from "@/components/ImagePreview";
import { MENU_CATEGORIES } from "@shared/api";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  qr_url: string | null;
  active?: boolean;
  created_at: string;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function MenuManager({ restaurant }: { restaurant: Restaurant }) {
  const [items, setItems] = useState<{ id: string; name: string; description: string | null; price: number; image_url: string | null; available: boolean; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState("");
  const [d, setD] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("Main Course");
  const [f, setF] = useState<File | null>(null);
  const [a, setA] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/restaurants/${restaurant.id}/menu-items`);
      const data = await resp.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = { name: n, price: Number(p), description: d || undefined, category: c, available: a };
    if (f) body.image_base64 = await fileToBase64(f);
    const resp = await fetch(`/api/restaurants/${restaurant.id}/menu-items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!resp.ok) return alert(await resp.text());
    setN(""); setD(""); setP(""); setC("Main Course"); setF(null); setA(true);
    await load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const resp = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    if (!resp.ok) return alert(await resp.text());
    await load();
  };

  const setAvail = async (id: string, available: boolean) => {
    const resp = await fetch(`/api/menu-items/${id}/availability`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available }) });
    if (!resp.ok) return alert(await resp.text());
    await load();
  };

  return (
    <div className="mt-3 grid gap-3">
      <form onSubmit={add} className="grid gap-2">
        <div className="grid sm:grid-cols-2 gap-2">
          <input className="h-9 rounded-md border px-3" placeholder="Item name" value={n} onChange={e=>setN(e.target.value)} required />
          <input className="h-9 rounded-md border px-3" placeholder="Price" type="number" step="0.01" value={p} onChange={e=>setP(e.target.value)} required />
        </div>
        <textarea className="min-h-20 rounded-md border px-3 py-2" placeholder="Description (optional)" value={d} onChange={e=>setD(e.target.value)} />
        <select className="h-9 rounded-md border px-3" value={c} onChange={e=>setC(e.target.value)}>
          {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={a} onChange={e=>setA(e.target.checked)} />
          Available
        </label>
        <input className="h-10 rounded-md border px-3 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-2" type="file" accept="image/*" onChange={e=>setF(e.target.files?.[0]|| null)} />
        <Button type="submit">Add Item</Button>
      </form>
      <div className="grid gap-2">
        {loading ? <div className="text-sm text-muted-foreground">Loading...</div> : null}
        {items.map(it => (
          <div key={it.id} className="flex items-center gap-3 rounded-lg border p-2">
            {it.image_url ? (
              <img 
                src={it.image_url} 
                alt={it.name} 
                className="h-12 w-12 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => setPreviewImage({ src: it.image_url!, alt: it.name })}
              />
            ) : (
              <div className="h-12 w-12 rounded bg-muted" />
            )}
            <div className="flex-1">
              <div className="font-medium">{it.name} <span className="text-xs text-muted-foreground">₹{Number(it.price).toFixed(2)}</span></div>
              {it.description && <div className="text-xs text-muted-foreground">{it.description}</div>}
              <div className="text-xs text-muted-foreground mt-0.5">📁 {it.category}</div>
            </div>
            <label className="flex items-center gap-1 text-xs mr-2">
              <input type="checkbox" checked={it.available} onChange={e=>setAvail(it.id, e.target.checked)} />
              Available
            </label>
            <Button variant="outline" onClick={() => del(it.id)}>Delete</Button>
          </div>
        ))}
      </div>
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

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      if (!auth.isAdmin) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    void verifyAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchRestaurants();
    }
  }, [isAuthenticated]);

  const signOut = async () => {
    await authSignOut();
    navigate("/login");
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
  // fetching restaurants
      
      const resp = await fetch(`${baseUrl}/api/restaurants`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies/auth
      });
      
  // response status available in resp.status
      
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${resp.status}, message: ${errorText}`);
      }
      
      const data = (await resp.json()) as Restaurant[];
  // fetched restaurants data
      setRestaurants(data);
    } catch (e) {
      console.error('Error in fetchRestaurants:', e);
      alert('Failed to fetch restaurants. Check console for details.');
    } finally {
      setLoading(false);
    }
  };


  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const slug = slugify(name, { lower: true, strict: true });
    let logo_base64: string | undefined;
    if (logoFile) logo_base64 = await fileToBase64(logoFile);
    try {
      const resp = await fetch('/api/restaurants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, logo_base64 }) });
      if (!resp.ok) throw new Error(await resp.text());
      setName("");
      setLogoFile(null);
      await fetchRestaurants();
    } catch (err: any) {
      alert(err?.message || 'Create failed');
    }
  };

  const generateQr = async (r: Restaurant, isRegenerate: boolean = false) => {
    // Show confirmation dialog for regenerate
    if (isRegenerate) {
      const confirmed = confirm(
        `⚠️ Regenerate QR Code for "${r.name}"?\n\n` +
        `This will replace the existing QR code. The old QR code will no longer work if it was different.\n\n` +
        `Do you want to continue?`
      );
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      const url = `${getBaseUrl()}/menu/${r.slug}`;
  // generating QR for URL
      
      const dataUrl = await renderQrToDataUrl(url);
      if (!dataUrl) {
        console.error('❌ QR generation returned null');
        return alert('QR render failed - please try again');
      }
      
  // QR data URL generated
      const resp = await fetch('/api/restaurants/qr', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ slug: r.slug, restaurant_id: r.id, qr_base64: dataUrl }) 
      });
      
      if (!resp.ok) {
        const error = await resp.text();
        console.error('❌ QR upload failed:', error);
        throw new Error(error);
      }
      
  // QR uploaded successfully
      await fetchRestaurants();
      alert(isRegenerate ? '✅ QR code regenerated successfully!' : '✅ QR code generated successfully!');
    } catch (e: any) {
      console.error('❌ QR generation error:', e);
      alert(e?.message || 'QR generation failed - check console for details');
    } finally {
      setLoading(false);
    }
  };

  const createRestaurantLogin = async (r: Restaurant) => {
    const email = prompt(`Enter email for ${r.name} owner:`, `${r.slug}@restaurant.com`);
    if (!email) return;

    const password = prompt(`Enter password for ${email}:`, '');
    if (!password) return;

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch('/api/restaurants/create-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_id: r.id, email, password })
      });

      if (!resp.ok) throw new Error(await resp.text());
      
  await resp.json();
  alert(`✅ Login created successfully!\n\nEmail: ${email}\nPassword: ${password}\n\nShare these credentials with the restaurant owner.\nThey can login at: ${getBaseUrl()}/restaurant-login`);
    } catch (e: any) {
      alert(e?.message || 'Failed to create login');
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (r: Restaurant) => {
    if (!confirm(`Delete "${r.name}"? This will also delete all menu items.`)) return;
    try {
      const resp = await fetch(`/api/restaurants/${r.id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error(await resp.text());
      await fetchRestaurants();
    } catch (e: any) {
      alert(e?.message || 'Delete failed');
    }
  };

  const toggleRestaurantStatus = async (r: Restaurant) => {
    const newStatus = !(r.active ?? true);
    try {
      const resp = await fetch(`/api/restaurants/${r.id}/status`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ active: newStatus }) 
      });
      if (!resp.ok) throw new Error(await resp.text());
      await fetchRestaurants();
    } catch (e: any) {
      alert(e?.message || 'Status update failed');
    }
  };

  const renderQrToDataUrl = async (value: string): Promise<string | null> => {
    const LOGO_URL = "/khadyamqr-logo.svg";
    let logoDataUrl: string | null = null;
    
    // Step 1: Load logo with retries
  // loading logo for QR
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await fetch(LOGO_URL, { 
          cache: 'no-cache',
          headers: { 'Accept': 'image/svg+xml,image/*' }
        });
        
        if (!resp.ok) {
          throw new Error(`Logo fetch failed: ${resp.status} ${resp.statusText}`);
        }
        
        const blob = await resp.blob();
  // logo blob loaded
        
        logoDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = String(reader.result);
            // logo converted to base64
            resolve(result);
          };
          reader.onerror = () => reject(new Error('FileReader error'));
          reader.readAsDataURL(blob);
        });
        
  // logo loaded successfully for QR
        break; // Success, exit retry loop
        
      } catch (e) {
        console.warn(`⚠️ Logo load attempt ${attempt}/3 failed:`, e);
        if (attempt === 3) {
          console.error('❌ All logo load attempts failed - generating QR without logo');
        } else {
          await new Promise(r => setTimeout(r, 100)); // Wait before retry
        }
      }
    }

    // Step 2: Generate QR with logo
    return await new Promise<string | null>((resolve) => {
  // rendering QR code
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      document.body.appendChild(container);
      
      const root = createRoot(container);
      
      const finish = () => {
        const canvas = container.querySelector("canvas");
        let url: string | null = null;
        
        if (canvas) {
          try { 
            url = canvas.toDataURL("image/png");
            // QR generated successfully
          } catch (e) {
            console.error('❌ Canvas toDataURL failed:', e);
          }
        } else {
          console.error('❌ Canvas element not found');
        }
        
        root.unmount();
        container.remove();
        resolve(url);
      };
      
      const size = 512;
      const imageSettings = logoDataUrl ? {
        src: logoDataUrl,
        height: Math.round(size * 0.22),
        width: Math.round(size * 0.22),
        excavate: true
      } : undefined;
      
  // rendering QRCodeCanvas
      
      root.render(
        <QRCodeCanvas
          value={value}
          includeMargin
          size={size}
          level="H"
          imageSettings={imageSettings}
        />,
      );
      
      // Wait longer for logo to render properly
      requestAnimationFrame(() => setTimeout(finish, 500));
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
            <img src="/khadyamqr-logo.svg" alt="KhadyamQR logo" className="h-8 w-8 rounded" />
            <span>KhadyamQR</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground">Home</a>
            <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container py-8 grid gap-10">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold">{restaurants.length}</div>
            <div className="text-xs text-muted-foreground">Total Restaurants</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold text-green-600">{restaurants.filter(r => r.active ?? true).length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold text-orange-600">{restaurants.filter(r => !(r.active ?? true)).length}</div>
            <div className="text-xs text-muted-foreground">Disabled</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold">{restaurants.filter(r => r.qr_url).length}</div>
            <div className="text-xs text-muted-foreground">QR Generated</div>
          </div>
        </div>

        <section className="grid gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Restaurants ({restaurants.filter(r => 
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.slug.toLowerCase().includes(searchQuery.toLowerCase())
            ).length})</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-md border px-3 text-sm flex-1 sm:w-64"
              />
              <Button variant="outline" size="sm" onClick={fetchRestaurants} disabled={loading}>
                {loading ? '⏳ Loading...' : '🔄 Refresh'}
              </Button>
              <a href="#add-restaurant" className="inline-flex h-9 items-center rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90">+ Add Restaurant</a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.filter(r => 
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.slug.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {searchQuery ? `No restaurants found matching "${searchQuery}"` : 'No restaurants yet. Add your first restaurant below!'}
              </div>
            ) : (
              restaurants.filter(r => 
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.slug.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((r) => (
              <div key={r.id} className={`rounded-xl border bg-card p-4 grid gap-3 ${(r.active ?? true) ? '' : 'opacity-60'}`}>
                <div className="flex items-center gap-3">
                  {r.logo_url ? (
                    <img 
                      src={r.logo_url} 
                      alt="logo" 
                      className="h-10 w-10 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => setPreviewImage({ src: r.logo_url!, alt: `${r.name} logo` })}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted grid place-items-center text-xs">N/A</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{r.name}</div>
                      {(r.active ?? true) ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Disabled</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">/{r.slug}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={(r.active ?? true) ? "text-orange-600 hover:text-orange-600 hover:bg-orange-50" : "text-green-600 hover:text-green-600 hover:bg-green-50"}
                    onClick={() => toggleRestaurantStatus(r)}
                    title={(r.active ?? true) ? "Disable restaurant" : "Enable restaurant"}
                    disabled={loading}
                  >
                    {(r.active ?? true) ? '⏸️' : '▶️'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteRestaurant(r)} disabled={loading}>🗑️</Button>
                </div>
                {r.qr_url ? (
                  <img 
                    src={r.qr_url} 
                    alt="QR" 
                    className="w-full rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => setPreviewImage({ src: r.qr_url!, alt: `${r.name} QR Code` })}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No QR yet</div>
                )}
                <div className="flex flex-wrap gap-2 items-center">
                  {r.qr_url ? (
                    <>
                      <Button 
                        className="inline-flex h-10 items-center rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90"
                        onClick={() => downloadQRCode(r.qr_url!, `${r.slug}-qr.png`)}
                        disabled={loading}
                      >
                        📥 Download QR
                      </Button>
                      <Button variant="secondary" onClick={() => navigator.clipboard.writeText(`${getBaseUrl()}/menu/${r.slug}`)} disabled={loading}>📋 Copy URL</Button>
                      <Button variant="outline" size="sm" onClick={() => generateQr(r, true)} disabled={loading}>🔄 Regenerate</Button>
                    </>
                  ) : (
                    <Button onClick={() => generateQr(r, false)} disabled={loading}>✨ Generate QR</Button>
                  )}
                  <a className="inline-flex h-10 items-center rounded-md border px-4 text-sm hover:bg-accent" href={`/menu/${r.slug}`} target="_blank" rel="noreferrer">👁️ Preview</a>
                  <Button variant="outline" onClick={() => createRestaurantLogin(r)} disabled={loading}>🔑 Create Login</Button>
                  <ResetPasswordDialog email={`${r.slug}@restaurant.com`} onSuccess={() => fetchRestaurants()}>
                    <Button variant="outline" disabled={loading}>🔒 Reset Password</Button>
                  </ResetPasswordDialog>
                  <Button variant="outline" className="ml-auto" onClick={() => setOpenMenuFor(openMenuFor === r.id ? null : r.id)} disabled={loading}>
                    {openMenuFor === r.id ? '▲ Close' : '🍽️ Manage Menu'}
                  </Button>
                </div>
                {openMenuFor === r.id ? (
                  <MenuManager restaurant={r} />
                ) : null}
              </div>
              ))
            )}
          </div>
        </section>

        <section id="add-restaurant" className="grid gap-3 scroll-mt-20">
          <h3 className="text-lg font-semibold">➕ Add New Restaurant</h3>
          <form onSubmit={handleAddRestaurant} className="grid gap-3 max-w-xl">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Name</span>
              <input className="h-10 rounded-md border px-3" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Spice Villa" required />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Logo</span>
              <input className="h-10 rounded-md border px-3 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-2" type="file" accept="image/*" onChange={(e)=>setLogoFile(e.target.files?.[0]|| null)} />
            </label>
            <div className="text-xs text-muted-foreground">Slug will be generated automatically</div>
            <Button type="submit">Create</Button>
          </form>
        </section>
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
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Download failed:', error);
      alert('Failed to download QR code. Please try right-clicking the QR image and selecting "Save image as..."');
    });
}

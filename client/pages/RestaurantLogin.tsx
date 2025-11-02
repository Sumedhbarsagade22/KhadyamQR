import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if user has a restaurant in restaurant_users table
      const { data: restaurantUserData, error: ruError } = await supabase
        .from("restaurant_users")
        .select("restaurant_id")
        .eq("email", email)
        .single();

      if (ruError || !restaurantUserData) {
        await supabase.auth.signOut();
        throw new Error("No restaurant found for this account. Contact admin to set up your restaurant.");
      }

      navigate("/restaurant-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src="/khadyamqr-logo.svg" alt="KhadyamQR" className="h-12 w-12 rounded" />
            <div>
              <h1 className="text-2xl font-bold">Restaurant Login</h1>
              <p className="text-sm text-muted-foreground">Manage your menu</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="restaurant@example.com"
                className="w-full h-11 rounded-lg border px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-lg border px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Forgot password?{' '}
                <a 
                  href="https://wa.me/918830778401?text=Hello%20Admin%2C%20I%20need%20to%20reset%20my%20restaurant%20account%20password.%20My%20email%20is%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Contact Admin
                </a>
              </p>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground block">
                ← Back to Home
              </a>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Don't have an account?
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
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

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("email, role")
        .eq("email", email)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error(`Access denied. Email "${email}" is not in admin_users table.`);
      }

      navigate("/admin");
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
            <h1 className="text-2xl font-bold">KhadyamQR Admin</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Forgot password?{' '}
                <a 
                  href="mailto:admin@khadyamqr.com?subject=Password Reset Request"
                  className="text-emerald-600 hover:underline"
                >
                  Contact Admin
                </a>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 block">
                ← Back to Home
              </Link>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Admin access only. Contact your administrator for credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

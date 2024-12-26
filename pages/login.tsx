import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black admin-page">
      <Card className="w-full max-w-lg mx-auto bg-gray-900 border-gray-800">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle className="text-3xl text-center font-bold text-white">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-lg text-center text-gray-400">
            Enter your email and password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 text-base bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 w-full h-12 text-base bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 w-full h-12 text-base bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary-500 hover:bg-primary-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

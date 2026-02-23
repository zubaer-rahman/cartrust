'use client'

import { useState, useEffect } from 'react';
import { createBrowserClient as createClient } from '@cartrust/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@cartrust/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/complete-profile');
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    await router.refresh();
    router.push(callback || '/complete-profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-12">
      <Card className="w-full max-w-md bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-12 pb-6">
          <CardTitle className="text-4xl font-black tracking-tighter text-primary">CARTRUST</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 font-medium">Welcome back! Sign in to continue.</CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-12">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-2xl h-14 px-6 border bg-muted/20 focus:bg-background transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="rounded-2xl h-14 px-6 border bg-muted/20 focus:bg-background transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm font-bold text-center">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-14 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
              Register Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

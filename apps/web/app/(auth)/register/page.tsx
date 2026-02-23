'use client'

import { useState } from 'react';
import { createBrowserClient as createClient } from '@cartrust/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@cartrust/ui';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  const handleNextStep = () => {
    if (role) setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      alert('Registration successful!');
      router.push('/complete-profile' + (callback ? `?callback=${encodeURIComponent(callback)}` : ''));
    } else {
      alert('Registration successful! If required, please check your email for confirmation.');
      router.push('/login' + (callback ? `?callback=${encodeURIComponent(callback)}` : ''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-12 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative z-10 transition-all duration-500 hover:shadow-primary/5">
        <CardHeader className="text-center pt-12 pb-6">
          <CardTitle className="text-4xl font-black tracking-tighter text-primary">CARTRUST</CardTitle>
          <CardDescription className="text-muted-foreground mt-3 font-medium px-4">
            {step === 1 ? 'Choose how you want to use CarTrust.' : 'Tell us a bit about yourself to get started.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-12">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`relative overflow-hidden group rounded-3xl p-6 text-left border-2 transition-all duration-300 ${
                    role === 'buyer' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-muted hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'buyer' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground group-hover:bg-primary/20'}`}>
                      🛒
                    </div>
                    <div>
                      <h3 className={`font-black tracking-tight text-lg ${role === 'buyer' ? 'text-primary' : ''}`}>I want to Buy</h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1">Browse premium vehicles.</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`relative overflow-hidden group rounded-3xl p-6 text-left border-2 transition-all duration-300 ${
                    role === 'seller' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-muted hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'seller' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground group-hover:bg-primary/20'}`}>
                      🏷️
                    </div>
                    <div>
                      <h3 className={`font-black tracking-tight text-lg ${role === 'seller' ? 'text-primary' : ''}`}>I want to Sell (Private)</h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1">List your car securely.</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('dealer')}
                  className={`relative overflow-hidden group rounded-3xl p-6 text-left border-2 transition-all duration-300 ${
                    role === 'dealer' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-muted hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'dealer' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground group-hover:bg-primary/20'}`}>
                      🏢
                    </div>
                    <div>
                      <h3 className={`font-black tracking-tight text-lg ${role === 'dealer' ? 'text-primary' : ''}`}>Trade Seller / Garage</h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1">Manage bulk listings & profile.</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-4">
                 <Button
                    onClick={handleNextStep}
                    disabled={!role}
                    size="lg"
                    className="w-full h-14 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    <span className="flex items-center justify-center gap-2">
                      Continue <ArrowRight className="w-5 h-5" />
                    </span>
                 </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500" onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="rounded-2xl h-14 px-6 border bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="rounded-2xl h-14 px-6 border bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  </div>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="rounded-2xl h-14 px-6 border bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                   <p className="text-destructive text-xs font-bold text-center">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                   type="button"
                   variant="outline"
                   onClick={() => setStep(1)}
                   className="h-14 w-14 rounded-2xl p-0 border-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 pointer-events-auto">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

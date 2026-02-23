'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardDescription } from '@cartrust/ui';
import { submitProfileCompletion } from '@/actions/profile';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function ProfileCompletionForm({ userId, role }: { userId: string, role: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitProfileCompletion(userId, formData);
    
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${role}/dashboard`);
        router.refresh(); // Force nav revalidation
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <Card className="text-center p-12 bg-primary/5 border border-primary/20 rounded-[2rem] shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>
        <CardTitle className="text-3xl font-black mb-2 tracking-tight">Profile Completed!</CardTitle>
        <CardDescription className="text-lg">Your identity is being verified.</CardDescription>
        <p className="text-sm font-bold mt-8 text-muted-foreground uppercase tracking-widest animate-pulse">Redirecting to Dashboard...</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2.5rem] border-0 bg-card shadow-2xl overflow-hidden max-w-2xl mx-auto border-t-8 border-t-primary">
      <CardHeader className="p-10 border-b">
        <CardTitle className="text-3xl font-black text-foreground">Verify Your Identity</CardTitle>
        <CardDescription className="text-lg font-medium mt-2">
          We need to verify your details before you can officially publish car listings and receive inquiries. Once verified, you can publish your drafts from the dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Phone Number</label>
            <Input 
              name="phoneNumber" 
              type="tel" 
              required 
              placeholder="+880 1..." 
              className="h-14 rounded-2xl px-5 text-lg font-medium bg-muted/30 focus:bg-background transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">National ID (NID) / Passport</label>
            <Input 
              name="nid" 
              type="text" 
              required 
              placeholder="e.g. 1990..." 
              className="h-14 rounded-2xl px-5 text-lg font-medium bg-muted/30 focus:bg-background transition-all" 
            />
          </div>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive text-sm font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-16 rounded-[1.5rem] text-xl font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Submitting...
              </span>
            ) : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

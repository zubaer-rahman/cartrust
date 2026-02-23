import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@cartrust/ui';
import { createClient } from '@cartrust/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (authUser) {
    redirect('/complete-profile');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 py-6 border-b flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-primary">CARTRUST</h1>
        <nav className="flex gap-6 items-center font-medium">
          <Link href="/browse" className="hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider">Browse</Link>
          <Link href="/login">
            <Button size="sm" className="rounded-full font-black px-6 shadow-lg shadow-primary/20">
              Login / Register
            </Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="px-6 py-24 md:py-40 flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black tracking-widest uppercase mb-4 border border-primary/20">
            Next Generation Marketplace
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-balance">
            TRUSTED WAY TO <br />
            <span className="text-primary italic">BUY & SELL</span> CARS.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Verified listings, transparent pricing, and secure transactions. 
            Experience the future of automotive commerce in Bangladesh.
          </p>
          <div className="flex flex-wrap gap-6 justify-center pt-8">
            <Link href="/browse">
              <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                Browse Cars
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl font-black text-xl hover:scale-105 transition-all border-2">
                Sell Your Car
              </Button>
            </Link>
          </div>
        </section>

        <section className="px-6 py-32 bg-muted/30">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Verified Sellers', desc: 'Every seller is vetted and verified for your safety.' },
              { title: 'Secure Payments', desc: 'Integrated bKash and bank transfers for transparency.' },
              { title: 'Boosted Listings', desc: 'Sell faster with premium placement on our platform.' }
            ].map((feature, i) => (
              <Card key={i} className="group p-2 rounded-[2.5rem] bg-card border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span className="font-black text-2xl">{i + 1}</span>
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight mb-4">{feature.title}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="p-16 border-t text-center bg-card">
        <div className="container mx-auto flex flex-col items-center gap-8">
          <h2 className="text-2xl font-black tracking-tighter text-primary">CARTRUST</h2>
          <div className="flex gap-8 font-bold text-sm text-muted-foreground uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          <p className="text-sm font-medium text-muted-foreground">© 2026 CarTrust Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

import { VehicleRepository } from '@cartrust/vehicle-core';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@cartrust/ui';
import { ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@cartrust/auth';
import { VehicleContactSection } from '../../../components/VehicleContactSection';

export default async function VehicleDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const repo = new VehicleRepository();
  const vehicle = await repo.findById(params.id);

  if (!vehicle || vehicle.status !== 'PUBLISHED') {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 py-6 border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/browse" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Browse
          </Link>
          <div className="flex gap-4">
            <Button className="rounded-2xl font-black px-8 shadow-xl shadow-primary/20">Contact Seller</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="aspect-[16/10] bg-muted rounded-[3rem] overflow-hidden border-0 shadow-2xl relative group">
              {vehicle.media?.[0] ? (
                <img 
                  src={vehicle.media[0].url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Vehicle" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black italic uppercase tracking-widest opacity-20">
                  No Image
                </div>
              )}
              {vehicle.condition && (
                <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border border-white/20">
                  {vehicle.condition}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {vehicle.media?.slice(1).map((m: any, i: number) => (
                <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer shadow-lg">
                  <img src={m.url} className="w-full h-full object-cover" alt="Vehicle thumbnail" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-10">
            <div>
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                Verified Listing • {vehicle.sellerType}
              </div>
              <h1 className="text-6xl font-black tracking-tight leading-[0.9] text-balance">
                {vehicle.year} {vehicle.make} <span className="text-primary italic">{vehicle.model}</span>
              </h1>
              <div className="flex items-center gap-4 mt-8">
                <span className="text-4xl font-black text-primary">৳{vehicle.price.toLocaleString()}</span>
                <span className="text-muted-foreground font-bold">Negotiable</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} KM`, icon: '🛣️' },
                { label: 'Fuel Type', value: vehicle.fuelType, icon: '⛽' },
                { label: 'Transmission', value: vehicle.transmission, icon: '⚙️' },
                { label: 'Location', value: `${vehicle.district}, ${vehicle.division}`, icon: '📍' },
              ].map((spec, i) => (
                <div key={i} className="p-6 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{spec.icon}</div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{spec.label}</p>
                  <p className="text-lg font-black mt-1 leading-tight">{spec.value}</p>
                </div>
              ))}
            </div>

            <Card className="rounded-[2.5rem] border-0 bg-muted/30 shadow-inner">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black uppercase tracking-widest">Description</CardTitle>
                <CardContent className="p-0 mt-4">
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {vehicle.description || "The seller has not provided a detailed description for this vehicle yet. Please contact them for more information."}
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <VehicleContactSection 
              vehicleId={vehicle.id}
              sellerName={vehicle.seller?.fullName || 'Private Seller'}
              sellerPhone={vehicle.seller?.phoneNumber || ''}
              authenticatedUser={user}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

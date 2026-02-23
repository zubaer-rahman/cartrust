import { prisma } from '@cartrust/db';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@cartrust/ui';
import { FileText, Plus } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@cartrust/auth';
import { PublishButton } from '@/components/PublishButton';
import Link from 'next/link';

export default async function MyCarsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return notFound();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser || dbUser.role !== 'seller') {
     notFound();
  }

  const myListings = await prisma.vehicle.findMany({ 
    where: { sellerId: dbUser.id },
    include: { media: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight">My Car Inventory</h2>
          <p className="text-muted-foreground font-medium mt-1">Manage and publish your vehicle listings.</p>
        </div>
        <Link href="/seller/list-vehicle">
          <Button className="rounded-2xl font-black px-8 shadow-xl shadow-primary/20 h-14 text-lg">
            <Plus className="w-5 h-5 mr-2" /> New Listing
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border-0 bg-white shadow-2xl overflow-hidden">
        <CardHeader className="p-10 border-b border-muted/50">
          <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-4">
              <FileText className="w-7 h-7 text-primary" /> Active Inventory
              </CardTitle>
              <div className="bg-muted/50 rounded-2xl p-1 flex gap-2">
                  <button className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-primary">All</button>
                  <button className="px-4 py-2 hover:bg-white rounded-xl transition-all text-xs font-black uppercase tracking-widest text-muted-foreground">Drafts</button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {myListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <p className="text-muted-foreground font-black text-xl">No cars found.</p>
              <p className="text-muted-foreground text-sm font-medium">Start by adding your first car for sale.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <tr>
                    <th className="px-12 py-6">Car Specification</th>
                    <th className="px-12 py-6">Model Year</th>
                    <th className="px-12 py-6">Market Price</th>
                    <th className="px-12 py-6">Publication Status</th>
                    <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50 font-medium">
                  {myListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-12 py-8 font-black text-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {listing.media?.[0] ? (
                              <img src={listing.media[0].url} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold opacity-20">No Img</div>
                            )}
                          </div>
                          <span>{listing.make} <span className="text-primary italic">{listing.model}</span></span>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-foreground font-bold">{listing.year}</td>
                      <td className="px-12 py-8 text-primary font-black text-xl">৳{listing.price.toLocaleString()}</td>
                      <td className="px-12 py-8">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 ${
                          listing.status === 'PUBLISHED' ? 'bg-green-500/5 text-green-600 border-green-500/10' :
                          listing.status === 'DRAFT' ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' :
                          'bg-muted/50 text-muted-foreground border-transparent'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <PublishButton 
                          vehicleId={listing.id} 
                          sellerId={listing.sellerId} 
                          isVerified={dbUser?.verificationStatus === 'VERIFIED'} 
                          status={listing.status} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

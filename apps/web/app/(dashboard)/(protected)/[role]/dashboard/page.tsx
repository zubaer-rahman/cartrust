import { prisma } from '@cartrust/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@cartrust/ui';
import { ArrowRight, FileText, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@cartrust/auth';
import { PublishButton } from '@/components/PublishButton';
import { AdminUserActions } from '@/components/AdminUserActions';

export default async function DashboardPage(props: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await props.params;

  if (!['buyer', 'seller', 'admin'].includes(role)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

  const userCount = role === 'admin' ? await prisma.user.count() : null;
  const vehicleCount = role === 'seller' ? await prisma.vehicle.count({ where: { sellerId: dbUser?.id } }) : null;
  const activeListings = role === 'seller' ? await prisma.vehicle.count({ where: { sellerId: dbUser?.id, status: 'PUBLISHED' } }) : null;

  const myListings = role === 'seller' && dbUser ? await prisma.vehicle.findMany({ 
    where: { sellerId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  }) : [];

  const allUsers = role === 'admin' ? await prisma.user.findMany({
    where: { role: { not: 'admin' } },
    orderBy: { updatedAt: 'desc' }
  }) : [];

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight capitalize">{role} Central</h2>
          <p className="text-muted-foreground font-medium">Monitoring your performance and system insights.</p>
        </div>
        <div className="flex gap-4">
          {role === 'seller' && (
            <Link href="/seller/list-vehicle">
              <Button className="rounded-2xl font-black px-8 shadow-xl shadow-primary/20 h-14 text-lg">
                + New Listing
              </Button>
            </Link>
          )}
          <Button variant="outline" className="rounded-2xl font-black px-8 border-2 h-14 bg-white">
            System Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {role === 'admin' && (
          <Card className="rounded-2xl border-0 bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(35,46,183,0.3)] overflow-hidden relative p-4">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <CardHeader className="p-10">
              <CardDescription className="text-primary-foreground/70 font-black uppercase tracking-widest text-[10px]">Active Platforms Users</CardDescription>
              <CardTitle className="text-6xl font-black mt-2 leading-none">{userCount}</CardTitle>
            </CardHeader>
          </Card>
        )}

        {role === 'seller' && (
          <>
            <Card className="rounded-2xl border-0 bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(35,46,183,0.3)] overflow-hidden relative p-4">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <CardHeader className="p-10">
                <CardDescription className="text-primary-foreground/70 font-black uppercase tracking-widest text-[10px]">Total Listings</CardDescription>
                <CardTitle className="text-6xl font-black mt-2 leading-none">{vehicleCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-0 bg-white shadow-2xl p-4">
              <CardHeader className="p-10">
                <CardDescription className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Live on Market</CardDescription>
                <CardTitle className="text-6xl font-black mt-2 text-primary leading-none">{activeListings}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-0 bg-white shadow-2xl p-4">
              <CardHeader className="p-10">
                <CardDescription className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Action Needed</CardDescription>
                <CardTitle className="text-6xl font-black mt-2 text-foreground leading-none">{(vehicleCount || 0) - (activeListings || 0)}</CardTitle>
              </CardHeader>
            </Card>
          </>
        )}

        {role === 'buyer' && (
          <Card className="rounded-2xl border-0 bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(35,46,183,0.3)] overflow-hidden relative col-span-full">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <CardHeader className="p-16">
              <CardTitle className="text-6xl font-black tracking-tight max-w-2xl leading-[0.9]">Find your next dream car today.</CardTitle>
              <CardDescription className="text-primary-foreground/80 mt-6 text-xl font-medium max-w-xl leading-relaxed">
                Connect with verified sellers and participate in exclusive auctions on BangladeshBangladesh's premium platformapos;s premium platform.
              </CardDescription>
              <div className="mt-12 flex gap-4">
                <Link href="/browse">
                  <Button className="bg-white text-primary hover:bg-white/90 rounded-[1.5rem] font-black px-12 h-16 text-xl shadow-2xl">
                    Explore Marketplace
                  </Button>
                </Link>
                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-[1.5rem] font-black px-12 h-16 text-xl">
                  Saved Search
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="rounded-2xl border-0 bg-white shadow-2xl overflow-hidden min-h-[400px]">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight">Recent Activity</CardTitle>
            <CardDescription className="font-medium">Live updates from your account interactions.</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 rounded-xl border-2 border-dashed border-muted/50">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-3xl">🚗</div>
                <div className="space-y-2">
                   <p className="text-foreground font-black text-xl">System Synced</p>
                   <p className="text-muted-foreground font-medium max-w-xs mx-auto">All your listing and bids are currently up to date.</p>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-white shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight">Market Intelligence</CardTitle>
            <CardDescription className="font-medium">Data-driven insights for your next big move.</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-4">
              {[
                { label: "Optimal Pricing Strategy for 2026", icon: "📈", cat: "Trends" },
                { label: "Selling your EV: A complete guide", icon: "⚡", cat: "Guides" },
                { label: "Top 10 highest resale value cars", icon: "🏆", cat: "Rankings" },
                { label: "Safety protocols for private viewing", icon: "🛡️", cat: "Security" }
              ].map((tip, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl hover:bg-muted/60 transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                   <div className="flex items-center gap-6">
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{tip.icon}</span>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{tip.cat}</p>
                         <p className="font-bold text-lg leading-tight mt-1">{tip.label}</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                   </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>


      {role === 'admin' && (
        <Card className="rounded-2xl border-0 bg-white shadow-2xl overflow-hidden mt-10">
          <CardHeader className="p-10 border-b border-muted/50 bg-muted/10">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-4">
              <Users className="w-7 h-7 text-primary" /> Identity & Access Management
            </CardTitle>
            <CardDescription className="font-medium text-base mt-1">
              Authoritative control over system participants and verification flows.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {allUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <p className="text-muted-foreground font-black text-xl">Protocol clear. No users to manage.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-12 py-6">Identity Profile</th>
                      <th className="px-12 py-6">Access Role</th>
                      <th className="px-12 py-6">Contact Sync</th>
                      <th className="px-12 py-6">Verification Protocol</th>
                      <th className="px-12 py-6 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/50 font-medium">
                    {allUsers.map(u => (
                      <tr key={u.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-12 py-8">
                          <p className="font-black text-lg leading-none">{u.fullName || u.email}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{u.email}</p>
                          {u.nid && <p className="text-[10px] font-mono mt-2 text-primary/40 p-1 bg-primary/5 rounded w-fit">NID: {u.nid}</p>}
                        </td>
                        <td className="px-12 py-8">
                            <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">{u.role}</span>
                        </td>
                        <td className="px-12 py-8 text-foreground font-bold">{u.phoneNumber || 'N/A'}</td>
                        <td className="px-12 py-8">
                            <div className="flex flex-col gap-2">
                                <span className={`text-[9px] w-fit font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 ${
                                    u.verificationStatus === 'VERIFIED' ? 'bg-green-500/5 text-green-600 border-green-500/10' :
                                    u.verificationStatus === 'PENDING' ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' :
                                    u.verificationStatus === 'REJECTED' ? 'bg-destructive/5 text-destructive border-destructive/10' :
                                    'bg-muted/50 text-muted-foreground border-transparent'
                                }`}>
                                    {u.verificationStatus}
                                </span>
                                {u.isSuspended && (
                                   <span className="text-[9px] w-fit font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-destructive text-white border-2 border-destructive shadow-lg animate-pulse">
                                       ACCOUNT SUSPENDED
                                   </span>
                                )}
                            </div>
                        </td>
                        <td className="px-12 py-8 text-right relative">
                          <AdminUserActions 
                            userId={u.id} 
                            verificationStatus={u.verificationStatus} 
                            isSuspended={u.isSuspended} 
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
      )}
    </div>
  );
}

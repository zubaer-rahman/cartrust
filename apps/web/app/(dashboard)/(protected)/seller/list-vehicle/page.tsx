import { VehicleForm } from '@/components/VehicleForm';
import { createClient } from '@cartrust/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@cartrust/db';

export default async function ListVehiclePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== 'seller') {
    redirect('/buyer/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">Sell Your Vehicle</h1>
        <p className="text-muted-foreground text-lg font-medium">Create a premium listing and reach thousands of potential buyers.</p>
      </div>
      
      <VehicleForm sellerId={user.id} />
    </div>
  );
}

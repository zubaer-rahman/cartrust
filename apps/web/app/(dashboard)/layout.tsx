import { redirect } from 'next/navigation';
import { prisma } from '@cartrust/db';
import { createClient } from '@cartrust/auth';
import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let user = null;
  if (authUser) {
    user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });
  }

  const userRole = user?.role || 'guest';

  return (
    <div className="flex bg-muted/30 min-h-screen">
      <AppSidebar userRole={userRole} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppHeader 
           title="CarTrust" 
           user={user ? { fullName: user.fullName, email: user.email } : { fullName: 'Guest', email: '' }} 
        />
        
        <main className="flex-1 overflow-hidden bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { prisma } from '@cartrust/db';
import { createClient } from '@cartrust/auth';
import { cookies } from 'next/headers';
import { ProfileWarningBanner } from '@/components/ProfileWarningBanner';

export default async function ProtectedLayout(props: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { children } = props;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    redirect('/complete-profile');
  }

  if (user.isSuspended) {
    redirect('/suspended');
  }

  return (
    <div className="h-full overflow-y-auto px-8 pb-8">
      {!user.isProfileComplete && <div className="mb-10 pt-8"><ProfileWarningBanner userRole={user.role} /></div>}
      <div className={!user.isProfileComplete ? "" : "pt-8"}>
        {children}
      </div>
    </div>
  );
}

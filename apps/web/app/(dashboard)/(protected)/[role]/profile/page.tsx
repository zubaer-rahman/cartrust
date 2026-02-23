import { prisma } from '@cartrust/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@cartrust/auth';
import { ProfileCompletionForm } from '@/components/ProfileForm';

export default async function ProfilePage(props: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await props.params;

  if (!['buyer', 'seller', 'dealer'].includes(role)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return notFound();

  const user = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!user) return notFound();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-5xl font-black tracking-tighter">Complete Profile</h2>
        <p className="text-muted-foreground font-medium mt-4 text-lg">
          {user.isProfileComplete 
            ? "Your profile is verified and active!" 
            : "Complete your identity verification below to unlock all marketplace features and allow you to publish your saved drafts."}
        </p>
      </div>

      {!user.isProfileComplete ? (
        <ProfileCompletionForm userId={user.id} role={user.role} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-primary/5 rounded-[3rem] border-2 border-primary/20 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">✅</div>
          <h3 className="text-2xl font-black text-foreground">YouYou're All Setapos;re All Set!</h3>
          <p className="text-muted-foreground font-medium">Your profile verification is complete.</p>
        </div>
      )}
    </div>
  );
}

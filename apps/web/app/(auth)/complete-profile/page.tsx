import { completeProfile } from '@/actions/auth';

export default async function CompleteProfilePage(props: {
  searchParams: Promise<{ callback?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callback;
  
  // This page will automatically try to sync the profile on load
  await completeProfile(callbackUrl);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
      <h1 className="text-3xl font-black tracking-tight mb-2">Setting up your profile...</h1>
      <p className="text-muted-foreground font-medium">Please wait while we prepare your CarTrust experience.</p>
    </div>
  );
}

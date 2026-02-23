import { createClient } from '@cartrust/auth';
import { prisma } from '@cartrust/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in first! Register an account and then visit this URL.' }, { status: 401 });
  }

  // Update their database profile directly to Admin
  await prisma.user.update({
    where: { id: user.id },
    data: {
      role: 'admin',
      isProfileComplete: true,
      verificationStatus: 'VERIFIED'
    }
  });

  return NextResponse.json({ 
    success: true, 
    message: `Success! The account ${user.email} is now fully VERIFIED and holds the ADMIN role. You can now visit /admin/dashboard!` 
  });
}

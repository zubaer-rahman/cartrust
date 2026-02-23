'use server'

import { prisma } from '@cartrust/db';
import { createClient } from '@cartrust/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function completeProfile(callback?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (existingUser) {
    redirect(callback || `/${existingUser.role}/dashboard`);
  }

  // Create user in Prisma using metadata from Supabase
  const metadata = authUser.user_metadata;
  
  const newUser = await prisma.user.create({
    data: {
      id: authUser.id,
      email: authUser.email!,
      fullName: metadata.full_name || '',
      role: (metadata.role as any) || 'buyer',
    }
  });

  redirect(callback || `/${newUser.role}/dashboard`);
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/login');
}

import { createClient } from '@supabase/supabase-js';
import { prisma } from '@cartrust/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'system-admin@gmail.com',
    password: 'Passw0rd',
    options: {
      data: {
        full_name: 'Sys Admin',
        role: 'admin'
      }
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
        email: 'system-admin@gmail.com',
        password: 'Passw0rd',
      });
      if (!signError && signData.user) {
         await ensureDbAdmin(signData.user);
         return NextResponse.json({ message: 'Admin authenticated and seeded successfully!' });
      }
      return NextResponse.json({ error: signError?.message }, { status: 400 });
    }
    return NextResponse.json({ error: authError.message });
  }

  await ensureDbAdmin(authData.user);
  return NextResponse.json({ message: 'New Admin created and seeded successfully!' });
}

async function ensureDbAdmin(user: any) {
  const existing = await prisma.user.findUnique({ where: { id: user.id } });
  if (!existing) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        role: 'admin',
        fullName: 'System Admin',
        isProfileComplete: true,
        verificationStatus: 'VERIFIED'
      }
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'admin',
        isProfileComplete: true,
        verificationStatus: 'VERIFIED'
      }
    });
  }
}

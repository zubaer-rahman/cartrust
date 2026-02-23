const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../../apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

async function addAdmin() {
  console.log('Registering system-admin@gmail.com...');
  
  // 1. Create in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'system-admin@gmail.com',
    password: 'Passw0rd',
    options: {
      data: {
        full_name: 'System Admin',
        role: 'admin'
      }
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log('User already exists in auth. Fetching user ID...');
        // If they already exist, we need to login to get their ID since we don't have a service key
        const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
            email: 'system-admin@gmail.com',
            password: 'Passw0rd',
        });
        if (signError) {
            console.error('Failed to log in existing admin:', signError);
            return;
        }
        await makeAdminInDb(signData.user);
    } else {
        console.error('Auth error:', authError);
    }
    return;
  }

  console.log('Created in Supabase. Adding to Database...');
  await makeAdminInDb(authData.user);
}

async function makeAdminInDb(user) {
    if (!user) {
        console.error('No user found');
        return;
    }
    
    // 2. Ensure they exist in Prisma
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
    console.log('Successfully configured system-admin@gmail.com as ADMIN!');
}

addAdmin().finally(() => prisma.$disconnect());

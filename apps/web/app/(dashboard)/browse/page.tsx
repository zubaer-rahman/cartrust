import { cookies } from 'next/headers';
import { createClient } from '@cartrust/auth';
import { prisma } from '@cartrust/db';
import { BrowseClient } from './BrowseClient';

import { Suspense } from 'react';
import { BrowseSkeleton } from '@/components/BrowseSkeleton';

export const dynamic = 'force-dynamic';

async function BrowseContent() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const listings = await prisma.vehicle.findMany({
    where: { status: 'PUBLISHED' },
    include: { media: true },
    orderBy: { createdAt: 'desc' }
  });

  const dbUser = authUser ? await prisma.user.findUnique({ where: { id: authUser.id } }) : null;

  return (
    <BrowseClient 
        initialListings={JSON.parse(JSON.stringify(listings))} 
        user={dbUser ? JSON.parse(JSON.stringify(dbUser)) : null} 
    />
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <BrowseContent />
    </Suspense>
  );
}

'use client'

import { useState } from 'react';
import { Button } from '@cartrust/ui';
import { Loader2 } from 'lucide-react';
import { publishVehicleListing } from '../actions/vehicle';
import { useRouter } from 'next/navigation';

export function PublishButton({ vehicleId, sellerId, isVerified, status }: { vehicleId: string, sellerId: string, isVerified: boolean, status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setLoading(true);
    const result = await publishVehicleListing(vehicleId, sellerId);
    setLoading(false);

    if (result.success) {
      router.refresh(); // Refresh the page to update the table
    } else {
      alert('Error: ' + result.error);
    }
  };

  if (status === 'PUBLISHED') {
    return <span className="text-xs font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">Published</span>;
  }

  return (
    <Button 
      onClick={handlePublish}
      disabled={loading || !isVerified}
      size="sm"
      variant={isVerified ? "default" : "secondary"}
      className="rounded-xl font-bold px-4 disabled:opacity-50"
      title={!isVerified ? "Awaiting Admin Verification" : "Publish Listing"}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish"}
    </Button>
  );
}

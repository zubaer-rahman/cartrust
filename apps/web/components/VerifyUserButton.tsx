'use client'

import { useState } from 'react';
import { Button } from '@cartrust/ui';
import { Loader2 } from 'lucide-react';
import { updateUserStatus } from '../actions/admin';
import { useRouter } from 'next/navigation';

export function VerifyUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    const result = await updateUserStatus(userId, 'VERIFY');
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <Button 
      onClick={handleVerify}
      disabled={loading}
      size="sm"
      className="rounded-xl font-bold px-4 bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
    </Button>
  );
}

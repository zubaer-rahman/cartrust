'use client';

import { useState, useEffect } from 'react';
import { Button } from '@cartrust/ui';
import Link from 'next/link';
import { X } from 'lucide-react';

export function ProfileWarningBanner({ userRole }: { userRole: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const skipped = sessionStorage.getItem('profileWarningSkipped');
    if (skipped) setIsVisible(false);
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem('profileWarningSkipped', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <span className="text-amber-500 text-lg">⚠️</span>
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          Your profile is incomplete. We need your NID/Passport (and Trade License for dealers) to verify your account. 
          Unverified accounts can only save listings as drafts.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href={`/${userRole}/profile`}>
          <Button size="sm" className="h-8 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg px-4 shadow-md hover:scale-105 transition-all">
            Complete Profile
          </Button>
        </Link>
        <button 
          title="Skip for now"
          onClick={handleSkip} 
          className="p-1 rounded-md text-amber-600/60 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

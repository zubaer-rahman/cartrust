'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@cartrust/ui';
import { Phone } from 'lucide-react';
import { createBrowserClient } from '@cartrust/auth';

interface VehicleContactSectionProps {
  vehicleId: string;
  sellerName: string;
  sellerPhone: string;
  authenticatedUser: any;
}

export function VehicleContactSection({ vehicleId, sellerName, sellerPhone, authenticatedUser }: VehicleContactSectionProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [user, setUser] = useState(authenticatedUser);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    // Re-check user on client side to be sure
    async function checkUser() {
      if (!user) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) setUser(authUser);
      }
    }
    checkUser();
  }, [user, supabase]);

  const handleContact = () => {
    if (!user) {
      router.push(`/login?callback=/vehicle/${vehicleId}`);
      return;
    }
    setShowPhone(true);
  };

  return (
    <div className="p-10 bg-primary/5 border-2 border-primary/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/5">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/30">
          {sellerName?.[0] || 'S'}
        </div>
        <div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Seller</p>
          <p className="text-xl font-black max-w-[200px] truncate">{sellerName || 'Private Seller'}</p>
          <p className="text-xs text-primary font-bold mt-1">✓ Verified Member</p>
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Button 
          onClick={handleContact}
          size="lg" 
          className="flex-1 md:flex-none h-16 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all group/btn overflow-hidden relative"
        >
          <span className={`flex items-center gap-3 transition-all duration-500 ${showPhone ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
            <Phone className="w-5 h-5" /> Show Phone Number
          </span>
          <span className={`absolute flex items-center gap-3 transition-all duration-500 inset-0 justify-center ${showPhone ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            {sellerPhone || 'No Number'}
          </span>
        </Button>
      </div>
    </div>
  );
}

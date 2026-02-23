'use client'

import { useState } from 'react';
import { Button } from '@cartrust/ui';
import { Loader2, MoreVertical, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { updateUserStatus } from '../actions/admin';
import { useRouter } from 'next/navigation';

export function AdminUserActions({ userId, verificationStatus, isSuspended }: { userId: string, verificationStatus: string, isSuspended: boolean }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAction = async (action: 'VERIFY' | 'REJECT' | 'SUSPEND' | 'RESTORE') => {
    setLoading(true);
    setOpen(false);
    const result = await updateUserStatus(userId, action);
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button 
        onClick={() => setOpen(!open)}
        disabled={loading}
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 rounded-full"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            
            <div className="p-2 space-y-1">
              <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-full text-left">Actions</p>
              
              {verificationStatus !== 'VERIFIED' && (
                <button 
                  onClick={() => handleAction('VERIFY')}
                  className="w-full text-left px-3 py-2 text-sm font-bold flex items-center justify-between text-green-600 hover:bg-green-500/10 rounded-xl transition-colors"
                >
                  Verify <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              {verificationStatus !== 'REJECTED' && (
                <button 
                  onClick={() => handleAction('REJECT')}
                  className="w-full text-left px-3 py-2 text-sm font-bold flex items-center justify-between text-amber-600 hover:bg-amber-500/10 rounded-xl transition-colors"
                >
                  Reject <XCircle className="w-4 h-4" />
                </button>
              )}
              
              <div className="h-px bg-border my-1 w-full" />
              
              {!isSuspended ? (
                <button 
                  onClick={() => handleAction('SUSPEND')}
                  className="w-full text-left px-3 py-2 text-sm font-bold flex items-center justify-between text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  Suspend <AlertTriangle className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => handleAction('RESTORE')}
                  className="w-full text-left px-3 py-2 text-sm font-bold flex items-center justify-between text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                  Restore <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

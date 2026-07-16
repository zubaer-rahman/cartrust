import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, Skeleton } from '@cartrust/ui';
import { Search } from 'lucide-react';

export function BrowseSkeleton() {
  return (
    <main className="h-full overflow-hidden flex gap-8 px-8 pb-8 pt-8">
      {/* Left Column: Car Tracking Skeleton */}
      <div className="flex-[1.1] flex flex-col min-w-0">
        <Card className="flex-1 rounded-2xl border-0 shadow-2xl overflow-hidden flex flex-col bg-white border-0">
          <CardHeader className="p-10 pb-2 space-y-8">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-black text-[#1a1c2e]">Car Tracking</CardTitle>
              <div className="relative w-60">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <div className="w-full pl-12 h-10 bg-muted/30 rounded-full" />
              </div>
            </div>

            <div className="flex gap-10 border-b border-muted overflow-x-auto no-scrollbar">
              {['All', 'Used', 'New', 'Single Owner'].map((tab) => (
                <button key={tab} className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all relative pb-5 px-1 ${tab === 'All' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab}
                  {tab === 'All' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(124,58,237,0.3)]" />}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-hidden px-10 pb-10 mt-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative bg-white border p-5 rounded-xl flex gap-6 items-center transition-all border-slate-100 shadow-sm">
                  <Skeleton className="w-40 h-28 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-muted-foreground/20">
                          <Search className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="pt-3 flex items-end justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-7 w-24" />
                      </div>
                      <div className="h-10 w-28 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Map & Detail Skeleton */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Map View Skeleton - Always show map background */}
        <Card className="flex-[1.2] rounded-2xl border-0 shadow-2xl overflow-hidden bg-white relative">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5]" 
            alt="Map loading" 
          />
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </Card>

        {/* Quick Detail Card Skeleton */}
        <Card className="flex-1 rounded-2xl border-0 shadow-2xl overflow-hidden bg-white p-6 flex flex-col">
          <Skeleton className="h-7 w-64 mb-6" />
          
          <div className="flex-1 flex items-center justify-center p-4">
            <Skeleton className="w-full h-full max-w-sm rounded-3xl" />
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl flex flex-col items-start justify-between min-h-[140px] border border-slate-50">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="mt-4 space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

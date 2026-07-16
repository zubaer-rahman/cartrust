'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, Button } from '@cartrust/ui';
import { 
  Bookmark, 
  Search, 
  Timer,
  Crosshair,
  Zap,
  Car
} from 'lucide-react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-muted/30 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5]" 
        alt="Map loading" 
      />
      <div className="absolute inset-0 bg-background/20 animate-pulse" />
    </div>
  )
});

export function BrowseClient({ initialListings, user }: { initialListings: any[]; user: any | null }) {
  const [activeTab, setActiveTab] = useState('All');
  const [activeCarId, setActiveCarId] = useState<string | null>(initialListings.length > 0 ? initialListings[0].id : null);
  const [listings] = useState<any[]>(initialListings);

  const filteredListings = listings.filter(car => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Used') return car.condition === 'Used';
    if (activeTab === 'New') return car.condition === 'New';
    if (activeTab === 'Single Owner') return car.sellerType === 'Owner';
    return true;
  });

  const selectedCar = filteredListings.find(c => c.id === activeCarId) || filteredListings[0];

  return (
    <main className="h-full overflow-hidden flex gap-8 px-8 pb-8 pt-8">
            
            {/* Left Column: Car Tracking */}
            <div className="flex-[1.1] flex flex-col min-w-0">
                <Card className="flex-1 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col">
                    <CardHeader className="p-10 pb-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-black text-foreground">Car Tracking</CardTitle>
                            <div className="relative w-60">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input className="w-full pl-12 h-10 bg-muted/30 border-0 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search" />
                            </div>
                        </div>

                        <div className="flex gap-10 border-b border-muted overflow-x-auto no-scrollbar">
                           {['All', 'Used', 'New', 'Single Owner'].map((tab) => (
                               <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all relative pb-5 px-1 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                               >
                                   {tab}
                                   {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(124,58,237,0.3)]" />}
                               </button>
                           ))}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar px-10 pb-10 mt-6">
                        <div className="space-y-4">
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-20 font-bold text-muted-foreground">No cars listed yet.</div>
                            ) : (
                                filteredListings.map((car) => (
                                    <div 
                                        key={car.id} 
                                        onClick={() => setActiveCarId(car.id)}
                                        className={`group relative bg-card border p-5 rounded-xl flex gap-6 items-center transition-all cursor-pointer ${activeCarId === car.id ? 'border-primary shadow-xl' : 'border-border hover:shadow-xl shadow-sm'}`}
                                    >
                                        <div className="w-40 h-28 rounded-2xl overflow-hidden bg-muted/30 flex-shrink-0">
                                            {car.media?.[0] ? (
                                                <img src={car.media[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={car.model} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground opacity-30">No Image</div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-0.5 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-black text-foreground truncate">{car.year} {car.make} {car.model}</h3>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{car.mileage.toLocaleString()} Miles • #{car.id.slice(0, 8)}</p>
                                                </div>
                                            </div>

                                            <button className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-all z-10 shadow-sm border border-border">
                                                <Bookmark className="w-4 h-4 fill-current opacity-20 group-hover:opacity-100" />
                                            </button>
                                            
                                            <div className="pt-3 flex items-end justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none opacity-50">Price</p>
                                                    <p className="text-xl font-black text-foreground mt-1.5">৳{car.price.toLocaleString()}</p>
                                                </div>
                                                <Link href={`/vehicle/${car.id}`}>
                                                    <Button className="rounded-xl font-black px-8 py-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 text-[10px] uppercase tracking-[0.1em]">
                                                        Place Bid
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Map & Detail */}
            <div className="flex-1 flex flex-col gap-8">
                {/* Map View */}
                <Card className="flex-[1.2] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden relative group">
                    <DynamicMap vehicles={filteredListings} activeVehicleId={activeCarId} />
                </Card>

                {/* Quick Detail Card - Stable Layout */}
                <Card className="flex-1 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden p-6 flex flex-col relative min-h-0">
                    {selectedCar ? (
                        <>
                            <div className="mb-1">
                                <h2 className="text-xl font-black tracking-tight text-foreground truncate">{selectedCar.year} {selectedCar.make} {selectedCar.model}</h2>
                            </div>
                            
                            <div className="flex-1 relative flex items-center justify-center p-2 min-h-0 group">
                                <img 
                                  src={selectedCar.media?.[0]?.url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070"} 
                                  className="max-w-full max-h-full object-contain relative z-10 transition-all duration-500" 
                                  alt="Featured" 
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {[
                                    { 
                                        label: 'Speed', 
                                        value: `${120 + (parseInt(selectedCar.id.slice(0, 2), 16) % 60)} km/h`, 
                                        icon: Timer, 
                                        color: 'text-[#4d7ef2]', 
                                        bg: 'bg-card', 
                                        iconBg: 'bg-muted/30', 
                                        border: 'border-border' 
                                    },
                                    { 
                                        label: 'Voltage', 
                                        value: `${200 + (parseInt(selectedCar.id.slice(2, 4), 16) % 50)} Volt`, 
                                        icon: Zap, 
                                        color: 'text-white', 
                                        bg: 'bg-primary shadow-xl', 
                                        iconBg: 'bg-white/20', 
                                        border: 'border-transparent' 
                                    },
                                    { 
                                        label: 'GPS Status', 
                                        value: parseInt(selectedCar.id.slice(4, 6), 16) % 2 === 0 ? 'Fix' : 'Live', 
                                        icon: Crosshair, 
                                        color: 'text-[#00d084]', 
                                        bg: 'bg-card', 
                                        iconBg: 'bg-muted/30', 
                                        border: 'border-border' 
                                    },
                                    { 
                                        label: 'Car Temp', 
                                        value: `${22 + (parseInt(selectedCar.id.slice(6, 8), 16) % 12)} °`, 
                                        icon: Car, 
                                        color: 'text-[#ff6a4d]', 
                                        bg: 'bg-card', 
                                        iconBg: 'bg-muted/30', 
                                        border: 'border-border' 
                                    },
                                ].map((spec, i) => (
                                    <div key={i} className={`p-4 rounded-xl flex flex-col items-start justify-between min-h-[140px] transition-all border ${spec.border} ${spec.bg}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${spec.iconBg}`}>
                                            <spec.icon className={`w-4 h-4 ${spec.color}`} />
                                        </div>
                                        <div className="mt-4">
                                            <p className={`text-[15px] font-black leading-none ${spec.color === 'text-white' ? 'text-white' : 'text-foreground'}`}>{spec.value}</p>
                                            <p className={`text-[10px] font-bold mt-2 ${spec.color === 'text-white' ? 'text-white/60' : 'text-muted-foreground'}`}>{spec.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground/30">
                                <Car className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-foreground">No Selection</h3>
                                <p className="text-xs font-medium text-muted-foreground mt-1">Select a vehicle from the list to view its details and specifications.</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </main>
  );
}

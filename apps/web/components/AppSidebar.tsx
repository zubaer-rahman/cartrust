'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CarFront, 
  Calendar, 
  Bookmark, 
  Activity, 
  Gavel, 
  LogOut,
  Car
} from 'lucide-react';
import { logout } from '@/actions/auth';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Find Car', href: '/browse', icon: CarFront },
  { label: 'Saved', href: '/saved', icon: Bookmark },
  // Extra items for Seller
  { label: 'My Cars', href: '/seller/my-cars', icon: Car, roles: ['seller'] },
];

export function AppSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  
  return (
    <aside className="w-80 h-screen sticky top-0 bg-[#0d0e1a] text-white/50 flex flex-col p-8 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-16 pl-2">
         <div className="bg-primary p-2 rounded-lg">
            <Car className="w-6 h-6 text-white" />
         </div>
         <span className="text-2xl font-black tracking-tighter text-white">CarTrust</span>
      </div>

      <nav className="flex-1 space-y-10">
        {userRole !== 'guest' && (
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Main Menu</p>
            <div className="space-y-2">
              {menuItems
                .filter(item => !item.roles || item.roles.includes(userRole))
                .filter(item => ['Dashboard', 'My Cars', 'Add Listing'].includes(item.label))
                .map((item) => {
                const isActive = pathname.includes(item.href) || (item.label === 'Dashboard' && pathname.includes('/dashboard'));
                return (
                  <Link 
                    key={item.label} 
                    href={item.href.startsWith('/') && !['seller', 'buyer', 'admin'].some(r => item.href.includes(r)) ? `/${userRole}${item.href}` : item.href}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div>
           <p className="px-4 text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Car Finder</p>
           <div className="space-y-2">
             {menuItems
              .filter(item => ['Find Car', 'Saved'].includes(item.label))
              .map((item) => {
               const isActive = pathname.includes(item.href);
               return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                </Link>
              );
             })}
           </div>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-8">
         <div className="bg-white/5 rounded-[2rem] p-6 mb-8 border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Car className="w-5 h-5 text-primary" />
                </div>
                <p className="text-white font-black text-sm">Enterprise Team</p>
                <p className="text-[10px] font-medium text-white/60 mt-1 mb-4">A new way to buy and sell cars.</p>
                <Link href="/register">
                    <button className="w-full rounded-xl h-10 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest transition-all">
                        Sell your Car
                    </button>
                </Link>
            </div>
         </div>

         {userRole !== 'guest' && (
           <form action={logout}>
              <button className="flex items-center gap-4 px-4 py-2 w-full text-white/40 hover:text-white transition-colors font-bold text-sm">
                  <LogOut className="w-5 h-5" />
                  Logout
              </button>
           </form>
         )}
      </div>
    </aside>
  );
}

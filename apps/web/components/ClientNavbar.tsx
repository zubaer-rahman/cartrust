'use client'

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User as UserIcon, Settings, LogOut, CarFront, LayoutDashboard } from 'lucide-react';
import { logout } from '@/actions/auth';
import { Button } from '@cartrust/ui';

type UserContext = {
  fullName: string | null;
  email: string;
  role: string;
};

export function ClientNavbar({ user }: { user: UserContext }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (user.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const menuItems = [
    { label: 'Dashboard', href: `/${user.role}/dashboard`, icon: LayoutDashboard },
    { label: 'Browse Vehicles', href: '/browse', icon: CarFront },
  ];

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <CarFront className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary group-hover:drop-shadow-sm transition-all">
            CARTRUST
          </span>
        </Link>

        {/* Desktop Navigation Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between ml-8">
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>



          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-0 lg:gap-3 p-1.5 lg:pr-4 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black shadow-inner shadow-primary-foreground/20">
                {getInitials()}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-black tracking-tight leading-none text-foreground">{user.fullName || user.email}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-primary mt-1 leading-none">{user.role}</p>
              </div>
            </button>

            {/* Dropdown UI */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-card rounded-[2rem] shadow-2xl border border-muted-foreground/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="p-5 bg-muted/30 border-b border-border lg:hidden">
                  <p className="text-sm font-black text-foreground truncate">{user.fullName || user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="mt-3 lg:hidden inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border border-primary/20">
                    {user.role}
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link href={`/${user.role}/profile`}>
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors">
                      <UserIcon className="w-4 h-4 mr-3 opacity-70" />
                      My Profile
                    </Button>
                  </Link>
                  <Link href={`/${user.role}/settings`}>
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors">
                      <Settings className="w-4 h-4 mr-3 opacity-70" />
                      Account Settings
                    </Button>
                  </Link>
                </div>
                <div className="p-2 border-t border-border">
                  <form action={logout}>
                    <Button type="submit" variant="ghost" className="w-full justify-start h-12 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <LogOut className="w-4 h-4 mr-3 opacity-70" />
                      Log out
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-card animate-in fade-in slide-in-from-top-2">
          <div className="p-6 flex flex-col gap-6">
            {/* Mobile User Profile Summary */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-border">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-inner shadow-primary-foreground/20">
                {getInitials()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-lg tracking-tight truncate">{user.fullName || user.email}</p>
                <div className="inline-block mt-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest border border-primary/20">
                  {user.role}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2 mb-2">Navigation</p>
              {menuItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:bg-muted/50 font-bold transition-colors"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  {item.label}
                </Link>
              ))}
              
              <Link href={`/${user.role}/profile`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-muted/50 font-bold transition-colors">
                <UserIcon className="w-5 h-5 text-primary" />
                My Profile
              </Link>
              
              <Link href={`/${user.role}/settings`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-muted/50 font-bold transition-colors">
                <Settings className="w-5 h-5 text-primary" />
                Settings
              </Link>
            </div>

            <form action={logout} className="mt-4">
              <Button type="submit" variant="outline" className="w-full h-14 rounded-2xl font-black text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all">
                <LogOut className="w-5 h-5 mr-2" />
                Log out
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

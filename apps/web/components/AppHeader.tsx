'use client'

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Search, Bell, User, ChevronDown, LogOut, Settings, Sun, Moon, Laptop, ChevronRight, Palette } from 'lucide-react';
import { Input } from '@cartrust/ui';
import { logout } from '@/actions/auth';
import Link from 'next/link';

export function AppHeader({ title, user }: { title: string, user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex justify-between items-center py-3 px-8 relative z-50 bg-card border-b border-border">
      <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
      
      <div className="flex items-center gap-6 flex-1 max-w-2xl justify-end">
        <div className="relative w-full max-w-md hidden md:block">
           <Input 
             className="w-full h-11 bg-muted/30 border-0 rounded-full font-medium pr-12 text-sm focus:bg-background transition-all text-foreground" 
             placeholder="Search"
           />
           <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
             <Search className="w-4 h-4" />
           </button>
        </div>

        <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative">
                <div 
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (isOpen) setPrefOpen(false);
                    }}
                    className="flex items-center gap-2 bg-card p-1 pr-3 rounded-full transition-all cursor-pointer hover:bg-muted/30"
                >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black uppercase overflow-hidden">
                        {user.fullName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-card rounded-2xl shadow-2xl border border-border p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-3 mb-2 border-b border-border/50">
                            <p className="text-sm font-black text-foreground">{user.fullName || 'User'}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-0.5">{user.role} Account</p>
                        </div>
                        
                        <div className="space-y-1">
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors text-sm font-bold text-foreground">
                                <User className="w-4 h-4 text-muted-foreground" />
                                My Profile
                            </Link>
                            <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors text-sm font-bold text-foreground">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                                Settings
                            </Link>

                            <div className="relative group">
                                <button 
                                    onClick={() => setPrefOpen(!prefOpen)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors text-sm font-bold text-foreground ${prefOpen ? 'bg-muted/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Palette className="w-4 h-4 text-muted-foreground" />
                                        Preferences
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${prefOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {prefOpen && (
                                    <div className="absolute right-[calc(100%+0.75rem)] top-0 w-44 bg-card rounded-xl shadow-2xl border border-border p-2 animate-in fade-in slide-in-from-right-2 duration-300">
                                        <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 pt-1">Theme</p>
                                        <div className="space-y-0.5">
                                            {[
                                                { id: 'light', icon: Sun, label: 'Light' },
                                                { id: 'dark', icon: Moon, label: 'Dark' },
                                                { id: 'system', icon: Laptop, label: 'System' }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all text-sm font-bold ${
                                                        theme === t.id 
                                                            ? 'bg-primary/10 text-primary' 
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                                    }`}
                                                >
                                                    <t.icon className="w-4 h-4" />
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form action={logout} className="mt-2 pt-2 border-t border-border">
                                <button 
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-destructive/5 text-destructive transition-colors text-sm font-bold"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}

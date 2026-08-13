'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, RefreshCw, ShoppingBag, Sliders, ShieldCheck, ArrowLeft, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: RefreshCw },
    { name: 'Taste Preferences', href: '/dashboard/preferences', icon: Sliders },
    { name: 'Admin Portal', href: '/admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#120a06] text-amber-50 flex flex-col md:flex-row font-inter">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1a0f0a] border-b md:border-b-0 md:border-r border-amber-900/30 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950">
              <Coffee className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h1 className="font-playfair text-lg font-bold tracking-tight text-amber-100">CRAFT COFFEE</h1>
              <span className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase">SaaS Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-600 text-amber-950 font-semibold shadow-md shadow-amber-900/40'
                      : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-950' : 'text-amber-400/80'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="mt-8 pt-4 border-t border-amber-900/30 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to 3D Experience
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 bg-amber-950/30 rounded-xl border border-amber-900/20 mt-2">
            <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-amber-200 truncate">demo.user@coffee.io</p>
              <p className="text-[10px] text-amber-400/70 capitalize">Subscriber Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#120a06] p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

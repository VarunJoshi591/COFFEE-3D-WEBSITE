'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Calendar, RefreshCw, Sparkles, CheckCircle2, ChevronRight, Truck, Award } from 'lucide-react';

export default function CustomerDashboardPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscriptions) {
          setSubscriptions(data.subscriptions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeSub = subscriptions.find((s) => s.status === 'ACTIVE') || subscriptions[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-[#2a170e] to-amber-900 border border-amber-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Specialty Coffee Club Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-amber-100 mb-2">
            Welcome Back, Coffee Connoisseur!
          </h1>
          <p className="text-amber-200/80 text-sm sm:text-base leading-relaxed">
            Your next artisanal roast is currently scheduled for freshly roasted small-batch delivery. Custom grind profile: <span className="text-amber-300 font-semibold">{activeSub?.grindPreference || 'Espresso'}</span>.
          </p>
        </div>
      </div>

      {/* Grid Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Next Shipment Card */}
        <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Next Dispatch</span>
              <div className="p-2 bg-amber-600/20 rounded-xl text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-100">August 28, 2026</p>
            <p className="text-xs text-amber-300/70 mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Includes Express Courier Shipping
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-900/30 flex items-center justify-between text-xs text-amber-400">
            <span>Status: Roast Prepared</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">On Schedule</span>
          </div>
        </div>

        {/* Current Active Plan Card */}
        <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Active Subscription</span>
              <div className="p-2 bg-amber-600/20 rounded-xl text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-100 capitalize">
              {activeSub?.roastPreference?.toLowerCase() || 'Dark'} Roast Reserve
            </p>
            <p className="text-xs text-amber-300/70 mt-1">
              Frequency: <span className="text-amber-200 font-medium">{activeSub?.frequency || 'Monthly'}</span> | Bags: <span className="text-amber-200 font-medium">{activeSub?.quantity || 2} Bags</span>
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-900/30 flex items-center justify-between text-xs">
            <span className="text-amber-400">$18.99 / delivery</span>
            <Link href="/dashboard/subscriptions" className="text-amber-300 hover:text-amber-100 font-semibold flex items-center gap-1">
              Manage Plan <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Taste Profile Status */}
        <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Taste Profile</span>
              <div className="p-2 bg-amber-600/20 rounded-xl text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-100">Espresso & V60</p>
            <p className="text-xs text-amber-300/70 mt-1">
              Notes: <span className="text-amber-200 font-medium">Dark Chocolate, Caramel, Cherry</span>
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-900/30 flex items-center justify-between text-xs">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profile 100% Tailored
            </span>
            <Link href="/dashboard/preferences" className="text-amber-300 hover:text-amber-100 font-semibold flex items-center gap-1">
              Adjust <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Deliveries Table */}
      <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-playfair font-bold text-amber-100">Recent Deliveries & Orders</h2>
            <p className="text-xs text-amber-300/60">Track past artisanal coffee shipments and invoice details.</p>
          </div>
          <Link
            href="/dashboard/subscriptions"
            className="px-4 py-2 rounded-xl bg-amber-600 text-amber-950 text-xs font-bold hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/30"
          >
            Manage Subscription
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-amber-200/80">
            <thead className="bg-amber-950/40 uppercase tracking-wider text-amber-400/80 border-b border-amber-900/30">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Blend / Roast</th>
                <th className="py-3.5 px-4 font-semibold">Date Dispatched</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/20">
              <tr className="hover:bg-amber-950/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-amber-300">#ORD-9082</td>
                <td className="py-3.5 px-4 font-medium text-amber-100">Obsidian Roast Blend (Whole Bean)</td>
                <td className="py-3.5 px-4">July 28, 2026</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Delivered
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-100">$18.99</td>
              </tr>
              <tr className="hover:bg-amber-950/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-amber-300">#ORD-8411</td>
                <td className="py-3.5 px-4 font-medium text-amber-100">Aetheria Light Roast (Espresso Grind)</td>
                <td className="py-3.5 px-4">June 28, 2026</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Delivered
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-100">$21.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

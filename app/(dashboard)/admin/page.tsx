'use client';

import React from 'react';
import { DollarSign, Users, RefreshCw, ShoppingBag, ArrowUpRight, TrendingUp, PackageCheck, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const metrics = [
    { name: 'Monthly Recurring Revenue', value: '$12,450', change: '+14.2%', icon: DollarSign },
    { name: 'Active Subscribers', value: '648', change: '+8.5%', icon: Users },
    { name: 'Avg Subscription Value', value: '$19.21', change: '+2.1%', icon: RefreshCw },
    { name: 'Monthly Churn Rate', value: '1.2%', change: '-0.4%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-amber-100">Merchant Admin Portal</h1>
          <p className="text-sm text-amber-300/70 mt-1">
            Real-time subscriber analytics, coffee inventory pipeline, and subscription revenue tracking.
          </p>
        </div>
        <span className="self-start px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
          LIVE DEMO METRICS
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{m.name}</span>
                <div className="p-2 bg-amber-600/20 rounded-xl text-amber-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-amber-100">{m.value}</p>
                <span className="text-xs font-bold text-emerald-400">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Fulfillment Queue & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriber Fulfillment Queue */}
        <div className="lg:col-span-2 bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
            <div>
              <h2 className="text-lg font-playfair font-bold text-amber-100">Roast & Dispatch Queue</h2>
              <p className="text-xs text-amber-300/60">Upcoming batch shipments for active subscribers.</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-amber-600/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              Batch #409
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-amber-200/80">
              <thead className="bg-amber-950/40 uppercase tracking-wider text-amber-400/80 border-b border-amber-900/30">
                <tr>
                  <th className="py-3 px-3 font-semibold">Subscriber</th>
                  <th className="py-3 px-3 font-semibold">Selected Blend</th>
                  <th className="py-3 px-3 font-semibold">Grind Size</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/20">
                <tr>
                  <td className="py-3 px-3 font-medium text-amber-100">Alex Morgan</td>
                  <td className="py-3 px-3 text-amber-300">Obsidian Dark Roast</td>
                  <td className="py-3 px-3">Espresso Fine</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Roasting
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-amber-100">Sarah Chen</td>
                  <td className="py-3 px-3 text-amber-300">Aetheria Light Roast</td>
                  <td className="py-3 px-3">Whole Bean</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ready to Ship
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-amber-100">Michael Vance</td>
                  <td className="py-3 px-3 text-amber-300">Velvet Horizon Medium</td>
                  <td className="py-3 px-3">French Press</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Queued
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock & Bean Inventory Panel */}
        <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-amber-900/30 pb-4">
            <h2 className="text-lg font-playfair font-bold text-amber-100">Bean Stock Inventory</h2>
            <p className="text-xs text-amber-300/60">Green bean supply & roasted stock reserve.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-amber-200 mb-1">
                <span>Ethiopia Yirgacheffe (Light)</span>
                <span>80 / 100 Bags</span>
              </div>
              <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-amber-200 mb-1">
                <span>Colombia Dark Blend (Obsidian)</span>
                <span>150 / 200 Bags</span>
              </div>
              <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-amber-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-amber-200 mb-1">
                <span>Guatemala Medium (Velvet)</span>
                <span>120 / 150 Bags</span>
              </div>
              <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-amber-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

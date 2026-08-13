'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Pause, Play, XCircle, CheckCircle2, Sliders, Coffee, ArrowUpRight, AlertCircle } from 'lucide-react';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      if (data.subscriptions) {
        setSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (subscriptionId: string, action: 'PAUSE' | 'RESUME' | 'CANCEL') => {
    setUpdatingId(subscriptionId);
    setMessage(null);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, action }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          text: `Subscription successfully ${action === 'PAUSE' ? 'paused' : action === 'RESUME' ? 'activated' : 'canceled'}.`,
          type: 'success',
        });
        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? {
                  ...sub,
                  status: action === 'PAUSE' ? 'PAUSED' : action === 'RESUME' ? 'ACTIVE' : 'CANCELED',
                }
              : sub
          )
        );
      } else {
        setMessage({ text: data.error || 'Failed to update subscription.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error connecting to subscription server.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePreferenceChange = async (subscriptionId: string, field: string, value: string) => {
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Subscription preferences saved!', type: 'success' });
        fetchSubscriptions();
      }
    } catch {
      setMessage({ text: 'Failed to update preference.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-amber-100">Subscription Portal</h1>
        <p className="text-sm text-amber-300/70 mt-1">
          Manage active deliveries, modify grind preferences, upgrade delivery frequency, or pause anytime.
        </p>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Subscription Cards List */}
      {loading ? (
        <div className="p-12 text-center text-amber-400 animate-pulse">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-8 text-center space-y-4">
          <Coffee className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-amber-100">No Active Subscriptions Found</h3>
          <p className="text-sm text-amber-300/70 max-w-md mx-auto">
            You don&apos;t have an active coffee delivery subscription yet. Choose your blend on our 3D showcase.
          </p>
          <a
            href="/#products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-500 transition-colors"
          >
            Explore Coffee Blends <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6"
            >
              {/* Top Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <RefreshCw className={`w-6 h-6 ${sub.status === 'ACTIVE' ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-playfair font-bold text-amber-100">Specialty Coffee Reserve</h2>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : sub.status === 'PAUSED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-amber-300/70 mt-1">
                      ID: <span className="font-mono text-amber-400">{sub.stripeSubscriptionId}</span>
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  {sub.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleAction(sub.id, 'PAUSE')}
                      disabled={updatingId === sub.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900/40 border border-amber-700/50 text-amber-200 text-xs font-semibold hover:bg-amber-800/40 transition-colors disabled:opacity-50"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause Subscription
                    </button>
                  )}

                  {sub.status === 'PAUSED' && (
                    <button
                      onClick={() => handleAction(sub.id, 'RESUME')}
                      disabled={updatingId === sub.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume Subscription
                    </button>
                  )}

                  {sub.status !== 'CANCELED' && (
                    <button
                      onClick={() => handleAction(sub.id, 'CANCEL')}
                      disabled={updatingId === sub.id}
                      className="p-2 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
                      title="Cancel Subscription"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Preferences Configuration Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Frequency Select */}
                <div>
                  <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    Delivery Frequency
                  </label>
                  <select
                    value={sub.frequency}
                    onChange={(e) => handlePreferenceChange(sub.id, 'frequency', e.target.value)}
                    className="w-full bg-[#120a06] border border-amber-900/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="WEEKLY">Weekly Fresh Roast</option>
                    <option value="BIWEEKLY">Every 2 Weeks</option>
                    <option value="MONTHLY">Monthly Reserve (Standard)</option>
                  </select>
                </div>

                {/* Grind Select */}
                <div>
                  <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    Grind Size Preference
                  </label>
                  <select
                    value={sub.grindPreference}
                    onChange={(e) => handlePreferenceChange(sub.id, 'grindPreference', e.target.value)}
                    className="w-full bg-[#120a06] border border-amber-900/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="WHOLE_BEAN">Whole Bean (Recommended)</option>
                    <option value="ESPRESSO">Espresso Fine Grind</option>
                    <option value="FRENCH_PRESS">Coarse French Press</option>
                    <option value="DRIP">Drip / Filter Fine</option>
                  </select>
                </div>

                {/* Roast Level */}
                <div>
                  <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    Roast Profile
                  </label>
                  <select
                    value={sub.roastPreference}
                    onChange={(e) => handlePreferenceChange(sub.id, 'roastPreference', e.target.value)}
                    className="w-full bg-[#120a06] border border-amber-900/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="LIGHT">Light Roast (Floral & Acidic)</option>
                    <option value="MEDIUM">Medium Roast (Balanced & Sweet)</option>
                    <option value="DARK">Dark Obsidian (Bold & Smoky)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

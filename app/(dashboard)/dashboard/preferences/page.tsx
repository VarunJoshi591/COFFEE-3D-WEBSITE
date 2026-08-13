'use client';

import React, { useState } from 'react';
import { Sliders, Sparkles, CheckCircle2, Flame, Droplets, Utensils } from 'lucide-react';

export default function TastePreferencesPage() {
  const [brewMethod, setBrewMethod] = useState('V60');
  const [grindSize, setGrindSize] = useState(5);
  const [flavorNotes, setFlavorNotes] = useState<string[]>(['Chocolatey', 'Nutty']);
  const [saved, setSaved] = useState(false);

  const availableNotes = ['Dark Chocolate', 'Caramel', 'Hazelnut', 'Bergamot', 'Jasmine', 'Black Cherry', 'Peach', 'Almond'];

  const toggleNote = (note: string) => {
    setFlavorNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-amber-100">Coffee Taste Profile Engine</h1>
        <p className="text-sm text-amber-300/70 mt-1">
          Customize your coffee extraction physics, favorite flavor notes, and brewing methods for tailored monthly deliveries.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Your custom taste profile has been saved and synced to your subscription master profile!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#1a0f0a] border border-amber-900/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Preferred Brew Method */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-amber-100 mb-4">
            <Utensils className="w-4 h-4 text-amber-400" /> Preferred Brew Equipment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['V60 Pour Over', 'Espresso Machine', 'French Press', 'Aeropress'].map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setBrewMethod(method)}
                className={`p-4 rounded-xl border text-xs font-semibold text-center transition-all ${
                  brewMethod === method
                    ? 'bg-amber-600 text-amber-950 border-amber-500 shadow-lg shadow-amber-900/40 font-bold'
                    : 'bg-[#120a06] border-amber-900/40 text-amber-200/80 hover:border-amber-700/60'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Grind Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-bold text-amber-100">
              <Sliders className="w-4 h-4 text-amber-400" /> Grind Size Calibration (1 = Fine, 10 = Coarse)
            </label>
            <span className="text-sm font-bold text-amber-400 font-mono">Level {grindSize}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={grindSize}
            onChange={(e) => setGrindSize(Number(e.target.value))}
            className="w-full h-2 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-amber-400/60 mt-2 font-mono">
            <span>1 (Turkish Fine)</span>
            <span>5 (V60 Medium)</span>
            <span>10 (French Press Coarse)</span>
          </div>
        </div>

        {/* Flavor Notes Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-amber-100 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" /> Desired Flavor Profile & Aromatics
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableNotes.map((note) => {
              const isSelected = flavorNotes.includes(note);
              return (
                <button
                  type="button"
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                      : 'bg-[#120a06] text-amber-200/60 border-amber-900/30 hover:border-amber-800'
                  }`}
                >
                  {note}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-amber-900/30 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-600 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-500 transition-colors shadow-lg shadow-amber-950"
          >
            Save Taste Profile
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Coffee, CheckCircle2, Globe, Flame } from "lucide-react";
import { HIGHLIGHT_FEATURES } from "@/data/products";

const brewMethods = [
  {
    name: "V60 Pourover",
    ratio: "1:16 (15g coffee / 240g water)",
    grind: "Medium-Fine (like sand)",
    temp: "94°C / 201°F",
    instructions: "Bloom with 40g water for 35s, then pour in circular motions in three equal stages."
  },
  {
    name: "French Press",
    ratio: "1:15 (20g coffee / 300g water)",
    grind: "Coarse (like sea salt)",
    temp: "95°C / 203°F",
    instructions: "Pour all water, stir gently, steep for 4 minutes. Plunge slowly and serve immediately."
  },
  {
    name: "Espresso",
    ratio: "1:2 (18g coffee in / 36g out)",
    grind: "Fine (like flour)",
    temp: "93°C / 199°F",
    instructions: "Aim for a 28-32 second extraction time with 9 bars of pressure for a rich, golden crema."
  }
];

export default function FeatureSection() {
  const [activeBrewMethod, setActiveBrewMethod] = useState("V60 Pourover");

  return (
    <>
      {/* --- BREWING METHODOLOGY SECTION --- */}
      <section
        id="brewing"
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-coffee-espresso border-y border-coffee-border/20"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          {/* Method selector text area */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-secondary/80 border border-coffee-border/50 text-coffee-accent text-xs uppercase tracking-[0.25em] mb-4">
              <Feather className="w-3.5 h-3.5" /> Ritual & Craft
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-playfair tracking-tight mb-6">
              THE ART OF BREWING
            </h2>
            <p className="text-coffee-textSecondary text-sm md:text-base leading-relaxed mb-8">
              A premium roast requires precise parameters. We have calculated the optimal extraction
              ratio, water temperature, and grind profiles to highlight our beans inherent
              characteristics.
            </p>

            {/* Brewing Method Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {brewMethods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setActiveBrewMethod(method.name)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                    activeBrewMethod === method.name
                      ? "bg-coffee-accent text-coffee-espresso shadow-lg shadow-coffee-accent/20"
                      : "bg-coffee-secondary text-coffee-textSecondary hover:text-coffee-textPrimary border border-coffee-border/30"
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Interactive Brew parameters card */}
            <div className="bg-coffee-secondary/60 border border-coffee-border/30 rounded-2xl p-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {brewMethods.map((method) => {
                  if (method.name !== activeBrewMethod) return null;
                  return (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="bg-coffee-espresso/55 p-3 rounded-lg border border-coffee-border/10">
                          <span className="text-coffee-textSecondary block mb-1">Brew Ratio</span>
                          <span className="font-semibold text-coffee-textPrimary">
                            {method.ratio}
                          </span>
                        </div>
                        <div className="bg-coffee-espresso/55 p-3 rounded-lg border border-coffee-border/10">
                          <span className="text-coffee-textSecondary block mb-1">Grind Size</span>
                          <span className="font-semibold text-coffee-textPrimary">
                            {method.grind}
                          </span>
                        </div>
                        <div className="bg-coffee-espresso/55 p-3 rounded-lg border border-coffee-border/10">
                          <span className="text-coffee-textSecondary block mb-1">Water Temp</span>
                          <span className="font-semibold text-coffee-accent">{method.temp}</span>
                        </div>
                      </div>

                      <div className="border-t border-coffee-border/20 pt-4">
                        <span className="text-xs text-coffee-accent uppercase tracking-widest font-bold block mb-2">
                          Instructions
                        </span>
                        <p className="text-xs md:text-sm text-coffee-textSecondary leading-relaxed">
                          {method.instructions}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Graphical Brewing Art Display */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="absolute -inset-4 bg-coffee-accent/5 rounded-full filter blur-2xl pointer-events-none" />
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-coffee-border/30 flex items-center justify-center p-6 bg-coffee-secondary/20">
              {/* Floating inner rings */}
              <div className="absolute inset-8 rounded-full border border-dashed border-coffee-border/25 animate-[spin_50s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-coffee-accent/25 animate-[spin_30s_linear_infinite]" />

              <div className="text-center z-10 max-w-xs">
                <Coffee className="w-12 h-12 text-coffee-accent mx-auto mb-4 animate-bounce" />
                <h4 className="text-lg font-bold font-playfair tracking-wide mb-2">
                  Artisanal Parameters
                </h4>
                <p className="text-xs text-coffee-textSecondary leading-relaxed">
                  Carefully calibrated to enhance acidity balance, flavor clarity, and lingering
                  finish characteristics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOURCING / SUSTAINABILITY SECTION --- */}
      <section
        id="sourcing"
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-coffee-espresso to-[#160b06]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-secondary/80 border border-coffee-border/50 text-coffee-accent text-xs uppercase tracking-[0.25em]">
                <Globe className="w-3.5 h-3.5" /> Traceable Origin
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-playfair tracking-tight">
                OUR SOURCING PHILOSOPHY
              </h2>
              <p className="text-coffee-textSecondary text-sm md:text-base leading-relaxed">
                We trade directly with micro-lot farms across East Africa and Central America. By
                bypassing middlemen, we guarantee premium pricing for our growers and secure first
                selection of specialty microlots.
              </p>

              {/* Direct Trade list details */}
              <div className="space-y-4 pt-4">
                {HIGHLIGHT_FEATURES.map((feat, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-coffee-accent/10 border border-coffee-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-coffee-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-coffee-textPrimary">{feat.title}</h4>
                      <p className="text-xs text-coffee-textSecondary mt-0.5">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Earthy Graphic (Procedural grid showcasing metrics) */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-coffee-secondary/50 border border-coffee-border/30 rounded-2xl p-6 text-center shadow-inner">
                <span className="text-2xl md:text-4xl font-bold font-playfair text-coffee-accent block mb-1">
                  85+
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-coffee-textSecondary">
                  SCA Score Standard
                </span>
              </div>
              <div className="bg-coffee-secondary/50 border border-coffee-border/30 rounded-2xl p-6 text-center shadow-inner">
                <span className="text-2xl md:text-4xl font-bold font-playfair text-coffee-accent block mb-1">
                  +35%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-coffee-textSecondary">
                  Above Fair Trade Minimum
                </span>
              </div>
              <div className="bg-coffee-secondary/50 border border-coffee-border/30 rounded-2xl p-6 text-center shadow-inner col-span-2">
                <span className="text-2xl md:text-4xl font-bold font-playfair text-coffee-textPrimary block mb-1">
                  100% Carbon Offset
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-coffee-textSecondary">
                  Micro-Batch Roasting Process
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

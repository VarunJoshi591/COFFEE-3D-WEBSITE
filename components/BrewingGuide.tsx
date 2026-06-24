'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Scale, Thermometer, Coffee } from 'lucide-react';

interface BrewMethod {
  id: string;
  name: string;
  ratio: string;
  grind: string;
  time: string;
  temp: string;
  steps: string[];
}

const brewMethods: BrewMethod[] = [
  {
    id: 'v60',
    name: 'V60 Pour Over',
    ratio: '1:15 (20g / 300g)',
    grind: 'Medium-Fine',
    time: '3:00 mins',
    temp: '93°C / 200°F',
    steps: [
      'Place filter paper in V60 and rinse with hot water to wash away paper taste.',
      'Add 20g of medium-fine coffee and tap to level the coffee bed.',
      'Pour 50g of water for blooming. Swirl gently and wait 45 seconds.',
      'Pour in circular motions up to 150g, keeping the water level stable.',
      'Pour in a final steady stream to 300g, letting it draw down completely.'
    ]
  },
  {
    id: 'frenchpress',
    name: 'French Press',
    ratio: '1:16 (30g / 480g)',
    grind: 'Coarse',
    time: '4:00 mins',
    temp: '95°C / 203°F',
    steps: [
      'Preheat the French Press carafe with warm water, then discard it.',
      'Add 30g of coarsely ground coffee to the bottom of the carafe.',
      'Pour in 480g of hot water quickly, ensuring all grounds are saturated.',
      'Place the lid on top without plunging. Let it steep for 4 minutes.',
      'Plunge slowly and evenly. Pour immediately into cups to stop extraction.'
    ]
  },
  {
    id: 'espresso',
    name: 'Espresso',
    ratio: '1:2 (18g / 36g)',
    grind: 'Fine (Powder)',
    time: '28-32 secs',
    temp: '92°C / 198°F',
    steps: [
      'Wipe filter basket clean and dry. Grind 18g of espresso-fine coffee.',
      'Distribute the grounds evenly and tamp firmly to create a level bed.',
      'Lock portafilter into the group head and start extraction immediately.',
      'Pre-infuse for 5 seconds to wet the puck, then engage full pressure.',
      'Stop the extraction when the output scales reach 36g (in 28-32 seconds).'
    ]
  }
];

export default function BrewingGuide() {
  const [activeTab, setActiveTab] = useState('v60');
  const current = brewMethods.find((m) => m.id === activeTab) || brewMethods[0];

  return (
    <section id="brewing" className="py-32 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-[#1A0F0A] to-[#0D0705]">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-coffee-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#D4A574]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4A574] font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-3 font-inter"
          >
            The Ritual of Brewing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-playfair font-bold text-coffee-text-primary"
          >
            Brewing Guide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-coffee-text-secondary mt-4 max-w-xl mx-auto font-inter"
          >
            Master the art of extraction with our recommended brewing parameters.
          </motion.p>
        </div>

        {/* Tab Selectors */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
          {brewMethods.map((method) => {
            const isActive = method.id === activeTab;
            return (
              <button
                key={method.id}
                onClick={() => setActiveTab(method.id)}
                className="relative px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-widest uppercase font-inter transition-all duration-300 overflow-hidden"
              >
                {/* Active Slider Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-coffee-accent to-[#3D8B7F] rounded-full shadow-lg"
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-coffee-text-secondary hover:text-coffee-text-primary'}`}>
                  {method.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Details Card */}
        <div className="bg-coffee-secondary/40 backdrop-blur-md border border-coffee-border/40 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-12"
            >
              {/* Metrics Column */}
              <div className="lg:col-span-2 space-y-6 flex flex-col justify-center">
                <h3 className="text-3xl font-playfair font-bold text-coffee-text-primary mb-2 flex items-center gap-3">
                  <Coffee className="w-7 h-7 text-[#D4A574]" /> {current.name} Parameters
                </h3>
                <p className="text-sm text-coffee-text-secondary leading-relaxed font-inter mb-6">
                  Fine-tuned guidelines to extract the optimal sweetness, complexity, and clarity of our signature beans.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Ratio */}
                  <div className="bg-[#1A0F0A]/60 border border-coffee-border/20 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#D4A574] mb-2">
                      <Scale className="w-4 h-4" />
                      <span className="text-[10px] tracking-wider uppercase font-bold font-inter">Ratio</span>
                    </div>
                    <span className="text-sm font-semibold text-coffee-text-primary font-inter">{current.ratio}</span>
                  </div>

                  {/* Grind */}
                  <div className="bg-[#1A0F0A]/60 border border-coffee-border/20 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-coffee-accent mb-2">
                      <Coffee className="w-4 h-4" />
                      <span className="text-[10px] tracking-wider uppercase font-bold font-inter">Grind Size</span>
                    </div>
                    <span className="text-sm font-semibold text-coffee-text-primary font-inter">{current.grind}</span>
                  </div>

                  {/* Time */}
                  <div className="bg-[#1A0F0A]/60 border border-coffee-border/20 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-coffee-accent mb-2">
                      <Timer className="w-4 h-4" />
                      <span className="text-[10px] tracking-wider uppercase font-bold font-inter">Target Time</span>
                    </div>
                    <span className="text-sm font-semibold text-coffee-text-primary font-inter">{current.time}</span>
                  </div>

                  {/* Temp */}
                  <div className="bg-[#1A0F0A]/60 border border-coffee-border/20 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#D4A574] mb-2">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-[10px] tracking-wider uppercase font-bold font-inter">Temperature</span>
                    </div>
                    <span className="text-sm font-semibold text-coffee-text-primary font-inter">{current.temp}</span>
                  </div>
                </div>
              </div>

              {/* Step by Step Column */}
              <div className="lg:col-span-3 space-y-6">
                <h4 className="text-sm font-bold tracking-widest text-[#D4A574] uppercase font-inter">
                  Step-by-Step Directions
                </h4>
                <div className="space-y-4">
                  {current.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 items-start p-4 rounded-2xl bg-coffee-secondary/20 hover:bg-coffee-secondary/40 border border-coffee-border/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-coffee-accent/25 border border-coffee-accent/40 flex items-center justify-center text-xs font-bold text-[#F5E6D3] shrink-0 font-inter">
                        {idx + 1}
                      </div>
                      <p className="text-sm md:text-base text-coffee-text-primary/90 leading-relaxed font-inter pt-0.5">
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

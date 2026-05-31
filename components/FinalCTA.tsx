"use client";

import React from "react";
import { Coffee, ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <footer className="bg-[#0A0503] border-t border-coffee-border/20 py-16 px-6 md:px-12 lg:px-24 text-coffee-textSecondary text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 items-start">
        <div className="space-y-4 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coffee-accent/20 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-coffee-accent" />
            </div>
            <span className="text-lg font-bold font-playfair tracking-widest text-coffee-textPrimary">
              L&apos;AROMA
            </span>
          </div>
          <p className="leading-relaxed">
            Crafting premium micro-batch roast expressions since 2026. Empowering specialty farms
            globally.
          </p>
        </div>

        {/* Links 1 */}
        <div className="space-y-3">
          <h4 className="font-bold tracking-widest text-coffee-textPrimary uppercase">
            Experience
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#hero" className="hover:text-coffee-accent transition-colors duration-300">
                Sticky Canvas
              </a>
            </li>
            <li>
              <a href="#blends" className="hover:text-coffee-accent transition-colors duration-300">
                Reserve Line
              </a>
            </li>
            <li>
              <a href="#brewing" className="hover:text-coffee-accent transition-colors duration-300">
                Extraction parameters
              </a>
            </li>
          </ul>
        </div>

        {/* Links 2 */}
        <div className="space-y-3">
          <h4 className="font-bold tracking-widest text-coffee-textPrimary uppercase">
            Craftsmanship
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#sourcing" className="hover:text-coffee-accent transition-colors duration-300">
                Direct Trade
              </a>
            </li>
            <li>
              <a href="#sourcing" className="hover:text-coffee-accent transition-colors duration-300">
                SCA Guidelines
              </a>
            </li>
            <li>
              <a href="#brewing" className="hover:text-coffee-accent transition-colors duration-300">
                Roast Levels
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Form */}
        <div className="space-y-3 w-full md:w-auto">
          <h4 className="font-bold tracking-widest text-coffee-textPrimary uppercase">
            Micro-Lot Bulletins
          </h4>
          <p className="mb-2">
            Subscribe to receive exclusive notifications on highly limited micro-batch releases.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-coffee-espresso border border-coffee-border/40 px-4 py-2.5 rounded-full text-coffee-textPrimary placeholder:text-coffee-textSecondary/50 focus:outline-none focus:border-coffee-accent text-xs w-full max-w-[200px]"
            />
            <button
              className="bg-coffee-accent text-coffee-espresso font-bold p-2.5 rounded-full hover:bg-white transition-colors duration-300"
              aria-label="Subscribe to newsletter"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-coffee-border/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-coffee-textSecondary/60">
        <span>
          &copy; {new Date().getFullYear()} L&apos;Aroma Specialty Coffee. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-coffee-accent transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-coffee-accent transition-colors duration-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

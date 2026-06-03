'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coffee } from 'lucide-react';

export default function Navbar() {
  const [cartCount] = useState(0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-coffee-espresso/70 backdrop-blur-xl border-b border-coffee-border/30 px-6 py-4 md:px-12 flex items-center justify-between">
      {/* Brand Emblem */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-coffee-accent to-coffee-border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Coffee className="w-5 h-5 text-coffee-text-primary group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full border border-coffee-accent/40 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
        </div>
        <span className="text-xl md:text-2xl font-bold font-playfair tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-coffee-text-primary to-[#D4A574]">
          L&apos;AROMA
        </span>
      </div>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-widest text-coffee-text-secondary uppercase font-inter">
        <a href="#hero" className="hover:text-coffee-accent transition-colors duration-300">
          Experience
        </a>
        <a href="#blends" className="hover:text-coffee-accent transition-colors duration-300">
          The Blends
        </a>
        <a href="#brewing" className="hover:text-coffee-accent transition-colors duration-300">
          Brewing Guide
        </a>
        <a href="#sourcing" className="hover:text-coffee-accent transition-colors duration-300">
          Sourcing
        </a>
      </nav>

      {/* CTA & Shopping Cart indicator */}
      <div className="flex items-center gap-4">
        {/* Shopping Cart count */}
        <div className="relative p-2 rounded-full hover:bg-coffee-secondary/60 cursor-pointer transition-colors duration-300">
          <ShoppingBag className="w-5 h-5 text-coffee-text-primary" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-coffee-accent text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-coffee-accent/30"
            >
              {cartCount}
            </motion.span>
          )}
        </div>

        <a
          href="#blends"
          className="relative overflow-hidden group bg-coffee-accent text-coffee-espresso font-semibold text-xs tracking-widest uppercase py-3 px-6 rounded-full shadow-lg shadow-coffee-accent/20 hover:shadow-coffee-accent/45 transition-all duration-300 active:scale-95 font-inter"
        >
          <span className="relative z-10 font-bold">Secure Blend</span>
          <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out opacity-25" />
        </a>
      </div>
    </header>
  );
}

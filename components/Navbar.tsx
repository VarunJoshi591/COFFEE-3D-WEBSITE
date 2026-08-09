'use client';
 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coffee, Menu, X } from 'lucide-react';
 
interface NavbarProps {
  cartCount?: number;
}

const NAV_TARGETS: Record<string, number> = {
  hero: 0.00,       // Hero
  enter: 0.12,      // Enter shop
  blends: 0.25,     // The Counter / Signature Blends
  sourcing: 0.38,   // Roasting Room / Sourcing
  brewing: 0.52,    // Coffee Machine / Brewing Guide
  table: 0.68,      // Table
  checkout: 0.82,   // Checkout
};

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToAct = (key: string) => {
    setIsOpen(false);
    const fraction = NAV_TARGETS[key] ?? 0;
    const container = document.getElementById('scroll-journey-container');
    if (container) {
      const totalScrollable = container.scrollHeight - window.innerHeight;
      const targetY = container.offsetTop + fraction * totalScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      const el = document.getElementById(key);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-coffee-espresso/85 backdrop-blur-xl border-b border-coffee-border/30 px-4 sm:px-6 py-3.5 md:px-12 flex items-center justify-between">
      {/* Brand Emblem */}
      <div 
        onClick={() => scrollToAct('hero')}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-coffee-accent to-coffee-border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-coffee-text-primary group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full border border-coffee-accent/40 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
        </div>
        <span className="text-lg xs:text-xl md:text-2xl font-extrabold font-inter tracking-[0.14em] sm:tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-coffee-text-primary via-[#F5E6D3] to-[#D4A574]">
          BREWHAUS
        </span>
      </div>

      {/* Desktop & Tablet Links */}
      <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-xs lg:text-sm font-semibold tracking-widest text-coffee-text-secondary uppercase font-inter">
        <button onClick={() => scrollToAct('hero')} className="hover:text-coffee-accent transition-colors duration-300">
          Experience
        </button>
        <button onClick={() => scrollToAct('blends')} className="hover:text-coffee-accent transition-colors duration-300">
          The Blends
        </button>
        <button onClick={() => scrollToAct('roasting')} className="hover:text-coffee-accent transition-colors duration-300">
          Roasting
        </button>
        <button onClick={() => scrollToAct('brewing')} className="hover:text-coffee-accent transition-colors duration-300">
          Brewing Guide
        </button>
        <button onClick={() => scrollToAct('checkout')} className="hover:text-coffee-accent transition-colors duration-300">
          Checkout
        </button>
      </nav>

      {/* CTA, Shopping Cart & Mobile Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
        {/* Shopping Cart count */}
        <div 
          onClick={() => scrollToAct('checkout')}
          className="relative p-2 rounded-full hover:bg-coffee-secondary/60 cursor-pointer transition-colors duration-300"
        >
          <motion.div
            key={cartCount}
            animate={cartCount > 0 ? { scale: [1, 1.25, 0.9, 1.15, 1] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ShoppingBag className="w-5 h-5 text-coffee-text-primary" />
          </motion.div>
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

        <button
          onClick={() => scrollToAct('blends')}
          className="hidden sm:relative sm:inline-block sm:overflow-hidden sm:group sm:bg-coffee-accent sm:text-coffee-espresso sm:font-semibold sm:text-xs sm:tracking-widest sm:uppercase sm:py-2.5 sm:px-5 md:py-3 md:px-6 sm:rounded-full sm:shadow-lg sm:shadow-coffee-accent/20 sm:hover:shadow-coffee-accent/45 sm:transition-all sm:duration-300 sm:active:scale-95 sm:font-inter cursor-pointer"
        >
          <span className="relative z-10 font-bold">Secure Blend</span>
          <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out opacity-25" />
        </button>

        {/* Hamburger Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-coffee-text-primary hover:text-coffee-accent transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-coffee-espresso/95 backdrop-blur-2xl border-b border-coffee-border/40 py-6 px-6 flex flex-col items-center gap-4 z-40 md:hidden shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => scrollToAct('hero')}
              className="w-full text-center py-2.5 text-base font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToAct('blends')}
              className="w-full text-center py-2.5 text-base font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              The Blends
            </button>
            <button
              onClick={() => scrollToAct('roasting')}
              className="w-full text-center py-2.5 text-base font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Roasting Room
            </button>
            <button
              onClick={() => scrollToAct('brewing')}
              className="w-full text-center py-2.5 text-base font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Brewing Guide
            </button>
            <button
              onClick={() => scrollToAct('checkout')}
              className="w-full text-center py-2.5 text-base font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Checkout
            </button>
            <button
              onClick={() => scrollToAct('blends')}
              className="sm:hidden w-full text-center bg-coffee-accent text-coffee-espresso font-bold text-xs tracking-widest uppercase py-3.5 px-6 rounded-full font-inter shadow-lg mt-2"
            >
              Secure Blend
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


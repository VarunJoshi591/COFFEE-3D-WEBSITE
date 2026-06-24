'use client';
 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coffee, Menu, X } from 'lucide-react';
 
interface NavbarProps {
  cartCount?: number;
}
 
export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-coffee-espresso/80 backdrop-blur-xl border-b border-coffee-border/30 px-6 py-4 md:px-12 flex items-center justify-between">
      {/* Brand Emblem */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-coffee-accent to-coffee-border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Coffee className="w-5 h-5 text-coffee-text-primary group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full border border-coffee-accent/40 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
        </div>
        <span className="text-xl md:text-2xl font-bold font-playfair tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-coffee-text-primary to-[#D4A574]">
          BREWHAUS
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
 
      {/* CTA, Shopping Cart & Mobile Toggle */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Shopping Cart count */}
        <div className="relative p-2 rounded-full hover:bg-coffee-secondary/60 cursor-pointer transition-colors duration-300">
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
 
        <a
          href="#blends"
          className="hidden sm:relative sm:overflow-hidden sm:group sm:bg-coffee-accent sm:text-coffee-espresso sm:font-semibold sm:text-xs sm:tracking-widest sm:uppercase sm:py-3 sm:px-6 sm:rounded-full sm:shadow-lg sm:shadow-coffee-accent/20 sm:hover:shadow-coffee-accent/45 sm:transition-all sm:duration-300 sm:active:scale-95 sm:font-inter"
        >
          <span className="relative z-10 font-bold">Secure Blend</span>
          <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out opacity-25" />
        </a>
 
        {/* Hamburger Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-coffee-text-primary hover:text-coffee-accent transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
 
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-coffee-espresso/95 backdrop-blur-2xl border-b border-coffee-border/30 py-8 px-6 flex flex-col items-center gap-6 z-40 md:hidden shadow-2xl"
          >
            <a
              href="#hero"
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Experience
            </a>
            <a
              href="#blends"
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              The Blends
            </a>
            <a
              href="#brewing"
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Brewing Guide
            </a>
            <a
              href="#sourcing"
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold tracking-wider text-coffee-text-secondary hover:text-coffee-accent transition-colors font-inter"
            >
              Sourcing
            </a>
            <a
              href="#blends"
              onClick={() => setIsOpen(false)}
              className="sm:hidden w-full text-center bg-coffee-accent text-coffee-espresso font-bold text-sm tracking-widest uppercase py-3.5 px-6 rounded-full font-inter"
            >
              Secure Blend
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

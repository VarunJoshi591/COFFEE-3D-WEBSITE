"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, MapPin, Plus, Coffee, Flame } from "lucide-react";
import { COFFEE_PRODUCTS } from "@/data/products";

export default function ProductShowcase() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <>
      {/* --- PRESETS NAVBAR --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-coffee-espresso/70 backdrop-blur-xl border-b border-coffee-border/30 px-6 py-4 md:px-12 flex items-center justify-between">
        {/* Brand Emblem */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-coffee-accent to-coffee-border flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Coffee className="w-5 h-5 text-coffee-textPrimary group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full border border-coffee-accent/40 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
          </div>
          <span className="text-xl md:text-2xl font-bold font-playfair tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-coffee-textPrimary to-[#D4A574]">
            L&apos;AROMA
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-widest text-coffee-textSecondary uppercase">
          <a href="#hero" className="hover:text-coffee-accent hover-text-glow transition-colors duration-300">
            Experience
          </a>
          <a href="#blends" className="hover:text-coffee-accent hover-text-glow transition-colors duration-300">
            The Blends
          </a>
          <a href="#brewing" className="hover:text-coffee-accent hover-text-glow transition-colors duration-300">
            Brewing Guide
          </a>
          <a href="#sourcing" className="hover:text-coffee-accent hover-text-glow transition-colors duration-300">
            Sourcing
          </a>
        </nav>

        {/* CTA & Shopping Cart indicator */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart count */}
          <div className="relative p-2 rounded-full hover:bg-coffee-secondary/60 cursor-pointer transition-colors duration-300">
            <ShoppingBag className="w-5 h-5 text-coffee-textPrimary" />
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
            className="relative overflow-hidden group bg-coffee-accent text-coffee-espresso font-semibold text-xs tracking-widest uppercase py-3 px-6 rounded-full shadow-lg shadow-coffee-accent/20 hover:shadow-coffee-accent/45 transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 font-bold">Secure Blend</span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out opacity-25" />
          </a>
        </div>
      </header>

      {/* --- ARTISANAL PRODUCTS GRID SECTION --- */}
      <section
        id="blends"
        className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-coffee-espresso via-[#22130C] to-coffee-espresso"
      >
        {/* Header Decorator */}
        <div className="max-w-4xl mx-auto text-center mb-16 mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-secondary/80 border border-coffee-border/50 text-coffee-accent text-xs uppercase tracking-[0.25em] mb-4">
            <Flame className="w-3.5 h-3.5" /> Handcrafted Batch Roasts
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-playfair tracking-tight mb-6">
            THE RESERVE LINE
          </h2>
          <p className="text-coffee-textSecondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Meticulously sourced, batch-roasted, and sealed fresh. Experience coffee flavors
            optimized for luxury palates.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COFFEE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between bg-coffee-secondary border border-coffee-border/40 rounded-3xl p-6 coffee-card-glow"
            >
              {/* Card Header tag */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-coffee-accent bg-coffee-accent/15 px-3 py-1 rounded-full">
                  {product.tag}
                </span>
                <span className="text-xs text-coffee-textSecondary flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-coffee-gold stroke-coffee-gold" />
                  <span className="font-bold text-coffee-textPrimary">{product.rating}</span> (
                  {product.reviewsCount})
                </span>
              </div>

              {/* Card Image placeholder overlay (renders premium procedural shape) */}
              <div className="relative w-full h-44 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-coffee-espresso/80 to-[#2c1a12] border border-coffee-border/20">
                {/* 3D vector gradient art to mimic a luxurious bag */}
                <div className="absolute w-24 h-36 bg-gradient-to-b from-[#4a2e1d] to-[#1a0c05] rounded-xl shadow-inner border border-coffee-border/60 transform group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500 ease-out flex flex-col justify-between p-3.5">
                  <div className="w-full h-4 border-b border-coffee-border/40 flex justify-center">
                    <div className="w-6 h-1 bg-coffee-gold rounded-full opacity-60" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#F5E6D3] opacity-80 text-center leading-none">
                      {product.name.split(" ")[0]}
                    </span>
                    <span className="text-[5px] uppercase font-bold tracking-widest text-coffee-accent mt-1">
                      Reserve
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[6px] text-coffee-textSecondary">
                      {product.roastLevel}
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full bg-coffee-accent/20 flex items-center justify-center">
                      <Coffee className="w-2 h-2 text-coffee-accent" />
                    </div>
                  </div>
                </div>

                {/* Subtle light reflections */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>

              {/* Info details */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-playfair tracking-wide group-hover:text-coffee-accent transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-xs text-coffee-accent italic tracking-wide mt-1 mb-3">
                    &ldquo;{product.tagline}&rdquo;
                  </p>
                  <p className="text-xs text-coffee-textSecondary leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Sourcing details */}
                <div className="border-t border-coffee-border/30 pt-4 mb-4 flex justify-between text-[10px] text-coffee-textSecondary font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-coffee-accent" />{" "}
                    {product.origin.split(",")[0]}
                  </span>
                  <span>{product.elevation}</span>
                </div>
              </div>

              {/* Footer pricing and CTA button */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-coffee-border/20">
                <div>
                  <span className="text-xs text-coffee-textSecondary block">Pricing</span>
                  <span className="text-xl font-bold font-playfair text-[#F5E6D3]">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-coffee-accent text-coffee-espresso hover:bg-white hover:text-coffee-espresso transition-all duration-300 shadow-md hover:shadow-coffee-accent/40 active:scale-95 group-hover:scale-105"
                  aria-label={`Add ${product.name} to Cart`}
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

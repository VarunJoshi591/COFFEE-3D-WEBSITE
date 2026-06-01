'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Coffee, ShoppingCart } from 'lucide-react';
import { CoffeeProduct } from '@/data/products';

interface ProductCardProps {
  product: CoffeeProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col justify-between bg-gradient-to-b from-[#3D2820]/90 to-[#2D1810]/95 border border-[#5A4034]/40 rounded-3xl p-6 shadow-xl hover:shadow-[#4F9C8F]/10 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Glow Effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-transparent via-[#4F9C8F]/0 to-transparent group-hover:via-[#4F9C8F]/20 rounded-3xl transition-all duration-500 -z-10" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#4F9C8F] bg-[#4F9C8F]/15 px-3.5 py-1.5 rounded-full border border-[#4F9C8F]/25">
          {product.tag}
        </span>
        <span className="text-xs text-[#C9B8A0] flex items-center gap-1.5 font-['Inter']">
          <Star className="w-3.5 h-3.5 fill-[#FFD700] stroke-[#FFD700]" />
          <span className="font-bold text-[#F5E6D3]">{product.rating}</span>
          <span className="opacity-60">({product.reviewsCount})</span>
        </span>
      </div>

      {/* Product Image Art (Luxurious Package Mockup) */}
      <div className="relative w-full h-48 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-[#1A0F0A] to-[#3D2820]/60 border border-[#5A4034]/20 group-hover:border-[#4F9C8F]/30 transition-colors duration-300">
        <div className="absolute w-24 h-36 bg-gradient-to-b from-[#4D3428] to-[#1A0F0A] rounded-xl shadow-2xl border border-[#5A4034]/60 transform group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500 ease-out flex flex-col justify-between p-3.5">
          <div className="w-full h-4 border-b border-[#5A4034]/40 flex justify-center">
            <div className="w-6 h-1 bg-[#FFD700] rounded-full opacity-60" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase font-bold tracking-widest text-[#F5E6D3] opacity-90 text-center leading-none">
              {product.name.split(' ')[0]}
            </span>
            <span className="text-[6px] uppercase font-bold tracking-widest text-[#4F9C8F] mt-1">
              Reserve
            </span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-[6px] text-[#C9B8A0] font-['Inter']">
              {product.roastLevel}
            </span>
            <div className="w-4 h-4 rounded-full bg-[#4F9C8F]/25 flex items-center justify-center">
              <Coffee className="w-2.5 h-2.5 text-[#4F9C8F]" />
            </div>
          </div>
        </div>

        {/* Ambient Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Info details */}
      <div className="flex-grow flex flex-col justify-between relative z-10">
        <div>
          <h3 className="text-2xl font-bold font-['Playfair_Display'] tracking-wide text-[#F5E6D3] group-hover:text-[#4F9C8F] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-[#4F9C8F] italic tracking-wide mt-1 mb-3">
            &ldquo;{product.tagline}&rdquo;
          </p>
          <p className="text-sm text-[#C9B8A0] leading-relaxed mb-4 font-['Inter'] font-light">
            {product.description}
          </p>

          {/* Flavor Notes */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.notes.map((note) => (
              <span key={note} className="text-[10px] text-[#C9B8A0] bg-[#1A0F0A]/40 border border-[#5A4034]/25 px-2 py-0.5 rounded-md font-['Inter']">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Sourcing details */}
        <div className="border-t border-[#5A4034]/30 pt-4 mb-4 flex justify-between text-[11px] text-[#C9B8A0] font-medium font-['Inter']">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#4F9C8F]" />
            {product.origin}
          </span>
          <span className="opacity-80">{product.elevation}</span>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#5A4034]/20 relative z-10">
        <div>
          <span className="text-[10px] text-[#C9B8A0] block uppercase tracking-wider font-['Inter'] opacity-70">Price</span>
          <span className="text-2xl font-bold font-['Playfair_Display'] text-[#F5E6D3]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white hover:from-white hover:to-white hover:text-[#1A0F0A] transition-all duration-300 shadow-md hover:shadow-[#4F9C8F]/30 active:scale-95 text-xs font-bold uppercase tracking-wider font-['Inter']"
          aria-label={`Buy ${product.name}`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </motion.div>
  );
}

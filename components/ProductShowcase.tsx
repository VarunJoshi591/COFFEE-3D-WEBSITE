'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { coffeeProducts } from '@/data/products';

interface ProductShowcaseProps {
  onAddToCart?: () => void;
}

type CategoryType = 'all' | 'hot' | 'cold' | 'specialty';

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'All Menu' },
  { id: 'hot', label: 'Hot Coffees' },
  { id: 'cold', label: 'Cold Brew & Iced' },
  { id: 'specialty', label: 'Specialty Blends' },
];

export default function ProductShowcase({ onAddToCart }: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const filteredProducts = coffeeProducts.filter((product) =>
    activeCategory === 'all' ? true : product.category === activeCategory
  );

  return (
    <section id="blends" className="pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 md:px-8 relative">
      {/* Product Grid Container */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            className="text-coffee-accent font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-2 sm:mb-3 font-inter"
          >
            ARTISAN MENU
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-coffee-text-primary"
          >
            Our Signature <span className="italic font-playfair font-normal">Creations</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm md:text-base text-coffee-text-secondary mt-3 sm:mt-4 max-w-2xl mx-auto font-inter px-2 leading-relaxed"
          >
            Meticulously roasted, masterfully brewed. Explore our expanded collection of single-origin espressos, velvety lattes, and artisanal specialty beverages.
          </motion.p>

          {/* Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? coffeeProducts.length
                  : coffeeProducts.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 font-inter cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'text-coffee-espresso font-bold shadow-lg shadow-coffee-accent/25'
                      : 'text-coffee-text-secondary hover:text-coffee-text-primary bg-coffee-secondary/40 hover:bg-coffee-secondary/80 border border-coffee-border/40'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--coffee-accent)' : undefined,
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-coffee-espresso text-coffee-accent'
                        : 'bg-coffee-border/40 text-coffee-text-secondary'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Dynamic Product Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <ProductCard product={product} index={index} onAdd={onAddToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

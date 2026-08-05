'use client';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { coffeeProducts } from '@/data/products';

interface ProductShowcaseProps {
  onAddToCart?: () => void;
}

export default function ProductShowcase({ onAddToCart }: ProductShowcaseProps) {
  return (
    <section id="blends" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 relative">
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            className="text-coffee-accent font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-2 sm:mb-3 font-inter"
          >
            MENU
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-coffee-text-primary"
          >
            Our Signature <span className="italic font-playfair font-normal">Blends</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm md:text-base text-coffee-text-secondary mt-3 sm:mt-4 max-w-xl mx-auto font-inter px-2"
          >
            Three timeless creations — meticulously brewed, endlessly beloved.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {coffeeProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAdd={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

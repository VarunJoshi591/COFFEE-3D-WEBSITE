'use client';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { coffeeProducts } from '@/data/products';

interface ProductShowcaseProps {
  onAddToCart?: () => void;
}

export default function ProductShowcase({ onAddToCart }: ProductShowcaseProps) {
  return (
    <section id="blends" className="py-24 px-4 md:px-8 relative">
      {/* Coffee Splash Banner */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative h-64 mb-16 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2418] via-[#4D3428] to-[#3D2418]" />
        <img
          src="/coffee/splash-banner.jpg"
          alt="Coffee Splash"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        {/* Floating Coffee Beans */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: i * 0.3
            }}
            className="absolute w-8 h-8 opacity-40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + Math.random() * 40}%`
            }}
          >
            <img src="/coffee/bean.png" alt="Coffee Bean" className="w-full h-full object-contain" />
          </motion.div>
        ))}
      </motion.div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            className="text-coffee-accent font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-3 font-inter"
          >
            MENU
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-coffee-text-primary"
          >
            Our Signature <span className="italic font-playfair font-normal">Blends</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-coffee-text-secondary mt-4 max-w-xl mx-auto font-inter"
          >
            Three timeless creations — meticulously brewed, endlessly beloved.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coffeeProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAdd={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-coffee-espresso to-coffee-primary" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-coffee-accent/20 rounded-full blur-3xl pointer-events-none"
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-playfair font-bold text-coffee-text-primary mb-4 sm:mb-6 leading-tight"
        >
          Find the Perfect <span className="italic font-playfair font-normal text-coffee-accent">Coffee</span> for You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl text-coffee-text-secondary mb-8 sm:mb-10 font-inter max-w-2xl mx-auto leading-relaxed px-2"
        >
          Explore our full collection of artisan blends, seasonal specials, and barista favorites — each one a small ceremony in a cup.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3.5 sm:px-8 sm:py-4 md:px-16 md:py-5 bg-coffee-accent text-coffee-espresso rounded-full text-sm sm:text-base md:text-xl font-bold font-inter shadow-2xl hover:shadow-coffee-accent/40 transition-all duration-300"
        >
          Explore Full Menu →
        </motion.button>
        {/* Decorative Sparkle */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mt-8 sm:mt-12 text-[#D4A574] text-3xl sm:text-4xl"
        >
          ✦
        </motion.div>
      </div>
    </section>
  );
}

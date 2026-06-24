'use client';
import { motion } from 'framer-motion';
import { features } from '@/data/products';
import { Coffee, Heart, Sparkles, Users } from 'lucide-react';
 
export default function FeatureSection() {
  const getIcon = (title: string) => {
    switch (title) {
      case 'High-Quality Beans':
        return <Coffee className="w-5 h-5 text-coffee-accent" />;
      case 'Individual Approach':
        return <Heart className="w-5 h-5 text-coffee-accent" />;
      case 'Atmosphere of Inspiration':
        return <Sparkles className="w-5 h-5 text-coffee-accent" />;
      case 'Professional Baristas':
        return <Users className="w-5 h-5 text-coffee-accent" />;
      default:
        return <Coffee className="w-5 h-5 text-coffee-accent" />;
    }
  };
 
  return (
    <section id="sourcing" className="py-24 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-coffee-espresso via-coffee-primary/30 to-coffee-espresso">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-coffee-accent/5 rounded-full blur-3xl pointer-events-none" />
 
      {/* Section Header */}
      <div className="text-center mb-20 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true }}
          className="text-coffee-accent font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-3 font-inter"
        >
          WHY BREWHAUS
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-coffee-text-primary"
        >
          Crafted with <span className="italic font-playfair font-normal">intention</span>
        </motion.h2>
      </div>
 
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-6 xl:gap-12 items-center">
          {/* Left Features - Icon on the right of title */}
          <div className="space-y-8 order-2 lg:order-1">
            {features.filter(f => f.position === 'left').map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-coffee-secondary/60 backdrop-blur-sm p-6 rounded-2xl border border-coffee-border/50 hover:border-coffee-accent/40 transition-colors duration-300"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-text-primary">
                    {feature.title}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-coffee-accent/10 border border-coffee-accent/30 flex items-center justify-center shrink-0">
                    {getIcon(feature.title)}
                  </div>
                </div>
                <p className="text-sm text-coffee-text-secondary font-inter leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
 
          {/* Center: Premium Coffee Cup Circle Backing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center order-1 lg:order-2 my-4 lg:my-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Radial Blur Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,156,143,0.25)_0%,transparent_70%)] blur-2xl" />
              
              {/* Inner Circle Frame */}
              <div className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full bg-gradient-to-b from-[#1A0F0A]/95 to-[#2D1810]/95 border border-[#5A4034]/40 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,156,143,0.1)_0%,transparent_60%)]" />
              </div>
              
              {/* Overlapping Coffee Cup */}
              <img
                src="/coffee/cup-centered.png"
                alt="Premium Coffee Cup"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </motion.div>
 
          {/* Right Features - Icon on the left of title */}
          <div className="space-y-8 order-3">
            {features.filter(f => f.position === 'right').map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-coffee-secondary/60 backdrop-blur-sm p-6 rounded-2xl border border-coffee-border/50 hover:border-coffee-accent/40 transition-colors duration-300"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-coffee-accent/10 border border-coffee-accent/30 flex items-center justify-center shrink-0">
                    {getIcon(feature.title)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-text-primary">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-coffee-text-secondary font-inter leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

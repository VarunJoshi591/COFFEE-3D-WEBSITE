'use client'; 

import { useState, useEffect } from 'react';
import ThemeProvider, { useTheme } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import HeroCanvasAnimation from '@/components/HeroCanvasAnimation';
import ProductShowcase from '@/components/ProductShowcase';
import FeatureSection from '@/components/FeatureSection';
import BrewingGuide from '@/components/BrewingGuide';
import FinalCTA from '@/components/FinalCTA';
import SoundToggle from '@/components/SoundToggle';
import CoffeeLoader from '@/components/CoffeeLoader';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeBadge() {
  const { emoji, label, theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [theme]);

  // Re-show on theme change
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-full shadow-2xl border backdrop-blur-xl cursor-pointer"
          style={{
            backgroundColor: 'var(--coffee-bg-secondary)',
            borderColor: 'var(--coffee-border)',
          }}
          onClick={() => setVisible(false)}
        >
          <span className="text-xl">{emoji}</span>
          <span
            className="text-sm font-semibold font-inter tracking-wide"
            style={{ color: 'var(--coffee-text-primary)' }}
          >
            {label}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--coffee-accent)',
              color: 'var(--coffee-bg-primary)',
            }}
          >
            {theme}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomeContent() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  // Dynamic background classes based on theme
  const bgColor = theme === 'morning'
    ? 'bg-[#2A1A10]'
    : theme === 'afternoon'
    ? 'bg-[#221410]'
    : 'bg-[#1A0F0A]';

  return (
    <main className={`${bgColor} min-h-screen transition-colors duration-1000`}>
      {/* 4-Phase Coffee Preparation Loading Screen */}
      {isLoading && <CoffeeLoader onComplete={() => setIsLoading(false)} />}

      {/* Navigation Header */}
      <Navbar cartCount={cartCount} />

      {/* Hero: Scroll-Triggered Canvas Animation */}
      <HeroCanvasAnimation />

      {/* Product Showcase Section */}
      <ProductShowcase onAddToCart={handleAddToCart} />

      {/* Feature Highlights Section */}
      <FeatureSection />

      {/* Interactive Brewing Guide */}
      <BrewingGuide />

      {/* Final Call-to-Action */}
      <FinalCTA />

      {/* Theme Badge Toast */}
      <ThemeBadge />

      {/* Ambient Sound Toggle */}
      <SoundToggle />
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}

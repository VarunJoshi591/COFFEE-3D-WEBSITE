'use client'; 

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroCanvasAnimation from '@/components/HeroCanvasAnimation';
import ProductShowcase from '@/components/ProductShowcase';
import FeatureSection from '@/components/FeatureSection';
import BrewingGuide from '@/components/BrewingGuide';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Ensure smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <main className="bg-[#1A0F0A] min-h-screen">
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
    </main>
  );
}


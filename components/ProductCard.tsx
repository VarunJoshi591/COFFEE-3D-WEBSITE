'use client';
import { motion } from 'framer-motion';
import { CoffeeProduct } from '@/data/products';
import { Plus } from 'lucide-react';
 
interface ProductCardProps {
  product: CoffeeProduct;
  index: number;
  onAdd?: () => void;
}
 
export default function ProductCard({ product, index, onAdd }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-coffee-secondary/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-coffee-border hover:border-coffee-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-coffee-accent/20"
    >
      {/* Coffee Image with absolute rating pill */}
      <div className="relative w-full h-48 sm:h-56 bg-coffee-primary rounded-xl mb-4 sm:mb-5 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {/* Star Rating Badge floating on top-left of image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1A0F0A]/85 border border-[#5A4034]/50 backdrop-blur-sm shadow-md">
          <span className="text-coffee-gold text-xs">★</span>
          <span className="text-coffee-text-primary font-bold text-xs">{product.rating.toFixed(1)}</span>
        </div>
      </div>
 
      {/* Title & Description */}
      <h3 className="text-lg sm:text-xl font-playfair font-bold text-coffee-text-primary mb-2 sm:mb-3">
        {product.name}
      </h3>
      <p className="text-xs sm:text-sm text-coffee-text-secondary mb-4 sm:mb-5 line-clamp-2 font-inter leading-relaxed">
        {product.description}
      </p>
 
      {/* Price & Add Button */}
      <div className="flex items-center justify-between">
        <span className="text-2xl sm:text-3xl font-bold text-coffee-accent font-inter">
          {product.price}
        </span>
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-coffee-accent to-[#3D8B7F] flex items-center justify-center hover:shadow-lg hover:shadow-coffee-accent/40 transition-shadow text-white active:scale-95"
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
}

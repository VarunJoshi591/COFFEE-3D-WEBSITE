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
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold text-coffee-accent font-inter">
            {product.price}
          </span>
          <span className="text-[10px] text-amber-300/60 font-medium">Per Bag</span>
        </div>
        <motion.button
          onClick={() => {
            if (onAdd) onAdd();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-coffee-accent to-amber-600 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-coffee-accent/20 hover:shadow-lg hover:shadow-coffee-accent/40 transition-shadow active:scale-95"
        >
          <span>Add to Cart</span>
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
}

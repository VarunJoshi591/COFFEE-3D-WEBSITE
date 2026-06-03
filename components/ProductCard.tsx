'use client';
import { motion } from 'framer-motion';
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
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-coffee-secondary/80 backdrop-blur-sm rounded-2xl p-6 border border-coffee-border hover:border-coffee-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-coffee-accent/20"
    >
      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-coffee-gold text-lg">★</span>
        <span className="text-coffee-text-primary font-semibold text-sm">{product.rating}</span>
      </div>

      {/* Coffee Image */}
      <div className="w-full h-56 bg-coffee-primary rounded-xl mb-5 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-playfair font-bold text-coffee-text-primary mb-3">
        {product.name}
      </h3>
      <p className="text-sm text-coffee-text-secondary mb-5 line-clamp-2 font-inter">
        {product.description}
      </p>

      {/* Price & Add Button */}
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-coffee-text-primary font-inter">
          {product.price}
        </span>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-accent to-[#3D8B7F] flex items-center justify-center hover:shadow-lg hover:shadow-coffee-accent/40 transition-shadow"
        >
          <span className="text-white text-2xl font-bold">+</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

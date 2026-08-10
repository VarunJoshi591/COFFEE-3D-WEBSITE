export interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  features: string[];
  category: 'hot' | 'cold' | 'specialty';
}

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Classic dark roast espresso with equal parts rich steamed milk and velvety thick foam cushion.',
    price: '$3.50',
    rating: 4.9,
    image: '/coffee/cappuccino.jpg',
    features: ['Espresso', 'Steamed Milk', 'Thick Foam'],
    category: 'hot',
  },
  {
    id: 'latte',
    name: 'Velvet Latte',
    description: 'Smooth double shot espresso combined with silky micro-steamed milk and subtle art rosette.',
    price: '$4.00',
    rating: 5.0,
    image: '/coffee/latte.jpg',
    features: ['Double Shot', 'Micro-Foam', 'Creamy'],
    category: 'hot',
  },
  {
    id: 'mocha',
    name: 'Artisan Mocha',
    description: 'Rich bittersweet dark chocolate melted into bold espresso and topped with velvety milk foam.',
    price: '$4.50',
    rating: 4.7,
    image: '/coffee/mocha.jpg',
    features: ['Espresso', 'Dark Cocoa', 'Whipped Milk'],
    category: 'hot',
  },
  {
    id: 'espresso',
    name: 'Espresso Supreme',
    description: 'Intense double shot of single-origin Ethiopian Arabica beans with a thick golden-brown crema.',
    price: '$3.00',
    rating: 4.9,
    image: '/coffee/espresso.jpg',
    features: ['100% Arabica', 'Golden Crema', 'Intense'],
    category: 'hot',
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Double ristretto shot finished with velvety steamed micro-foam for a smooth, coffee-forward taste.',
    price: '$4.20',
    rating: 4.8,
    image: '/coffee/flat_white.jpg',
    features: ['Double Ristretto', 'Velvet Foam', 'Smooth'],
    category: 'hot',
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk infused with Madagascar vanilla, marked with espresso and buttery caramel drizzle.',
    price: '$4.75',
    rating: 4.9,
    image: '/coffee/caramel_macchiato.jpg',
    features: ['Vanilla Milk', 'Caramel Drizzle', 'Layered'],
    category: 'hot',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Reserve',
    description: '18-hour steep of single-origin coarse roast served over an artisanal crystal ice sphere.',
    price: '$4.50',
    rating: 5.0,
    image: '/coffee/cold_brew.jpg',
    features: ['18-Hr Steep', 'Low Acidity', 'Crystal Ice'],
    category: 'cold',
  },
  {
    id: 'affogato',
    name: 'Affogato Al Caffè',
    description: 'Artisanal scoop of Madagascar vanilla bean gelato drowned in a freshly pulled hot espresso shot.',
    price: '$5.20',
    rating: 4.9,
    image: '/coffee/affogato.jpg',
    features: ['Vanilla Gelato', 'Hot Espresso', 'Dessert Blend'],
    category: 'specialty',
  },
  {
    id: 'matcha-latte',
    name: 'Ceremonial Matcha Latte',
    description: 'First-harvest Uji Japanese matcha whisked with warm oat milk for an antioxidant-rich elixir.',
    price: '$4.80',
    rating: 4.8,
    image: '/coffee/matcha_latte.jpg',
    features: ['Uji Matcha', 'Oat Milk', 'Antioxidant Rich'],
    category: 'specialty',
  },
];
export interface FeatureHighlight {
title: string;
description: string;
position: 'left' | 'right';
}
export const features: FeatureHighlight[] = [
  {
    title: 'High-Quality Beans',
    description: 'Hand-picked single-origin beans roasted to perfection in small batches.',
    position: 'left'
  },
  {
    title: 'Individual Approach',
    description: 'Every cup is crafted with care to suit your unique taste preferences.',
    position: 'left'
  },
  {
    title: 'Atmosphere of Inspiration',
    description: 'An ambiance designed to spark creativity and moments of stillness.',
    position: 'right'
  },
  {
    title: 'Professional Baristas',
    description: 'Award-winning baristas dedicated to the art of the perfect pour.',
    position: 'right'
  }
];

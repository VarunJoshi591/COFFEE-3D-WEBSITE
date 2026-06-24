export interface CoffeeProduct {
id: string;
name: string;
description: string;
price: string;
rating: number;
image: string;
features: string[];
}
export const coffeeProducts: CoffeeProduct[] = [
{
id: 'cappuccino',
name: 'Cappuccino',
description: 'Cappuccino is a latte made with more foam than steamed milk, often topped with cocoa powder.',
price: '$3.50',
rating: 4.9,
image: '/coffee/cappuccino.jpg',
features: ['Espresso', 'Steamed Milk', 'Foam']
},
{
id: 'latte',
name: 'Latte',
description: 'Latte is a coffee drink made with espresso and steamed milk. Rich, creamy, balanced.',
price: '$4.00',
rating: 5.0,
image: '/coffee/latte.jpg',
features: ['Espresso', 'Steamed Milk', 'Light Foam']
},
{
id: 'mocha',
name: 'Mocha',
description: 'Mocha is a coffee beverage where dark espresso meets rich chocolate and creamy milk.',
price: '$4.50',
rating: 4.7,
image: '/coffee/mocha.jpg',
features: ['Espresso', 'Chocolate', 'Steamed Milk']
}
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

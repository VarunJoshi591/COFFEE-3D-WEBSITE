export interface CoffeeProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  notes: string[];
  tag: string;
  origin: string;
  elevation: string;
}

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: 'ethiopian-yirgacheffe',
    name: 'Ethiopian Yirgacheffe',
    tagline: 'Elegance in a Cup',
    description: 'A delicate medium-light roast with sparkling notes of sweet jasmine, bright citrus, and honeyed tea texture.',
    price: 19.50,
    rating: 4.9,
    reviewsCount: 184,
    roastLevel: 'Light',
    notes: ['Jasmine', 'Lemon Zest', 'Orange Blossom'],
    tag: 'Single Origin',
    origin: 'Yirgacheffe, Ethiopia',
    elevation: '1,900m - 2,200m',
  },
  {
    id: 'sumatran-mandheling',
    name: 'Sumatra Mandheling',
    tagline: 'Deep, Dark & Mysterious',
    description: 'An extremely low-acid, heavy-bodied dark roast displaying complex layers of cedar, rich dark chocolate, and spicy finish.',
    price: 18.00,
    rating: 4.8,
    reviewsCount: 142,
    roastLevel: 'Dark',
    notes: ['Dark Chocolate', 'Cedar Wood', 'Brown Sugar'],
    tag: 'Best Seller',
    origin: 'Sumatra, Indonesia',
    elevation: '1,100m - 1,500m',
  },
  {
    id: 'guatemalan-antigua',
    name: 'Guatemalan Antigua',
    tagline: 'Perfect Harmony',
    description: 'A premium medium roast perfectly balanced with rich smoky cocoa undertones, subtle spice notes, and a clean caramel finish.',
    price: 21.00,
    rating: 4.9,
    reviewsCount: 98,
    roastLevel: 'Medium',
    notes: ['Cocoa', 'Caramel', 'Smoky Spice'],
    tag: 'Limited Batch',
    origin: 'Antigua Valley, Guatemala',
    elevation: '1,500m - 1,800m',
  },
  {
    id: 'espresso-signature',
    name: 'Espresso Signature',
    tagline: 'Rich Velvet Espresso',
    description: 'Our award-winning blend designed specifically for rich velvet espresso. Delivers an intense body, thick golden crema, and dark cocoa finish.',
    price: 16.50,
    rating: 5.0,
    reviewsCount: 312,
    roastLevel: 'Dark',
    notes: ['Toasted Almond', 'Treacle', 'Molasses'],
    tag: 'Signature Blend',
    origin: 'Brazil & Colombia Blend',
    elevation: '1,200m - 1,600m',
  }
];

export const HIGHLIGHT_FEATURES = [
  {
    title: "100% Arabica Specialty Grade",
    description: "Sourced exclusively from farms with SCA cupping ratings above 85 points."
  },
  {
    title: "Fresh Micro-Batch Roasting",
    description: "Roasted in small batches daily and shipped within 24 hours of roasting."
  },
  {
    title: "Direct Trade Partnership",
    description: "We pay 35% above Fair Trade prices directly to farmers, ensuring sustainability."
  }
];

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const initialProducts = [
  {
    name: 'Obsidian Roast Blend',
    slug: 'obsidian-roast-blend',
    description: 'Dark, rich espresso blend with notes of dark chocolate, toasted hazelnut, and subtle black cherry.',
    price: 18.99,
    roastLevel: 'Dark',
    origin: 'Ethiopia & Colombia',
    notes: 'Dark Chocolate, Hazelnut, Black Cherry',
    imageUrl: '/frames/frame_001.png',
    stock: 150,
    isSubscriptionEligible: true,
  },
  {
    name: 'Aetheria Light Roast',
    slug: 'aetheria-light-roast',
    description: 'Vibrant single-origin light roast with jasmine aromas, bergamot tea notes, and crisp Meyer lemon acidity.',
    price: 21.50,
    roastLevel: 'Light',
    origin: 'Yirgacheffe, Ethiopia',
    notes: 'Jasmine, Bergamot, Meyer Lemon',
    imageUrl: '/frames/frame_015.png',
    stock: 80,
    isSubscriptionEligible: true,
  },
  {
    name: 'Velvet Horizon Medium',
    slug: 'velvet-horizon-medium',
    description: 'Smooth and balanced medium roast featuring caramelized honey, ripe peach, and almond cream notes.',
    price: 19.50,
    roastLevel: 'Medium',
    origin: 'Huehuetenango, Guatemala',
    notes: 'Caramelized Honey, Peach, Almond Cream',
    imageUrl: '/frames/frame_030.png',
    stock: 120,
    isSubscriptionEligible: true,
  },
];

export async function POST() {
  try {
    const created = [];
    for (const prod of initialProducts) {
      const existing = await db.product.findUnique({
        where: { slug: prod.slug },
      });

      if (!existing) {
        const item = await db.product.create({
          data: prod,
        });
        created.push(item);
      } else {
        created.push(existing);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with coffee products',
      products: created,
    });
  } catch (error: any) {
    console.error('Database seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}

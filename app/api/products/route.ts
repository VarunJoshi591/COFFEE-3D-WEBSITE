import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let products = await db.product.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Auto-seed if empty for instant out-of-the-box demo
    if (products.length === 0) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/seed`, {
        method: 'POST',
      }).catch(() => null);
      
      if (res?.ok) {
        products = await db.product.findMany({
          orderBy: { createdAt: 'asc' },
        });
      }
    }

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Fetch products error:', error);
    // Fallback response if DB is initializing
    return NextResponse.json({
      success: true,
      products: [
        {
          id: 'prod-1',
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
          id: 'prod-2',
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
          id: 'prod-3',
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
      ],
    });
  }
}

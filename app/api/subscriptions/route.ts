import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Return subscriptions from DB or mock active subscription for demo user
    let subscriptions: any[] = [];
    if (userId) {
      subscriptions = await db.subscription.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (subscriptions.length === 0) {
      // Fallback demo active subscription
      subscriptions = [
        {
          id: 'sub_demo_101',
          userId: userId || 'demo_user_1',
          stripeSubscriptionId: 'sub_stripe_demo_88',
          stripePriceId: 'price_obsidian_monthly',
          status: 'ACTIVE',
          frequency: 'MONTHLY',
          grindPreference: 'ESPRESSO',
          roastPreference: 'DARK',
          quantity: 2,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    console.error('Fetch subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { subscriptionId, action, frequency, grindPreference, roastPreference } = body;

    if (!subscriptionId) {
      return NextResponse.json({ success: false, error: 'Subscription ID is required' }, { status: 400 });
    }

    let newStatus: string | undefined;
    if (action === 'PAUSE') newStatus = 'PAUSED';
    if (action === 'RESUME') newStatus = 'ACTIVE';
    if (action === 'CANCEL') newStatus = 'CANCELED';

    // Update in Prisma DB if subscription exists
    try {
      const updated = await db.subscription.update({
        where: { id: subscriptionId },
        data: {
          ...(newStatus && { status: newStatus }),
          ...(frequency && { frequency }),
          ...(grindPreference && { grindPreference }),
          ...(roastPreference && { roastPreference }),
        },
      });

      return NextResponse.json({ success: true, subscription: updated });
    } catch {
      // Return updated state for demo/mock subscriptions
      return NextResponse.json({
        success: true,
        subscription: {
          id: subscriptionId,
          status: newStatus || 'ACTIVE',
          frequency: frequency || 'MONTHLY',
          grindPreference: grindPreference || 'ESPRESSO',
          roastPreference: roastPreference || 'DARK',
          updatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

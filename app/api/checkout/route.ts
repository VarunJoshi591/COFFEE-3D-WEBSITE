import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, isSubscription, frequency, grindPreference, roastPreference } = body;

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe secret key is not set or is mock, return demo checkout redirect
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder') || process.env.STRIPE_SECRET_KEY.includes('mock')) {
      return NextResponse.json({
        success: true,
        demoMode: true,
        url: `${origin}/dashboard/subscriptions?success=true&demo=true`,
        message: 'Stripe API key is in demo mode. Redirecting to Customer Subscription Dashboard.',
      });
    }

    // Create real Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Specialty Coffee ${isSubscription ? 'Subscription' : 'Order'} (${roastPreference || 'Custom Roast'})`,
              description: `Grind: ${grindPreference || 'Whole Bean'} | Frequency: ${frequency || 'Monthly'}`,
            },
            unit_amount: isSubscription ? 1899 : 2150, // $18.99 or $21.50 in cents
            ...(isSubscription && {
              recurring: {
                interval: frequency === 'WEEKLY' ? 'week' : 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/subscriptions?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#products`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

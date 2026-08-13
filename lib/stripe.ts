import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
  appInfo: {
    name: 'Coffee 3D SaaS Platform',
    version: '0.1.0',
  },
});

import api from './api';
import { loadStripe } from '@stripe/stripe-js';

export const createCheckoutSession = async (priceId, planType) => {
  const res = await api.post('/payments/create-checkout-session', { priceId, planType, successUrl: window.location.origin + '/dashboard', cancelUrl: window.location.origin + '/pricing' });
  const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
};

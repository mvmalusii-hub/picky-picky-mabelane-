const Stripe = require('stripe');

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // use latest stable version
});

module.exports = stripe;

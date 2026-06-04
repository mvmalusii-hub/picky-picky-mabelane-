const stripe = require('../config/stripe');
const db = require('../config/database');

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { priceId, planType, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { plan_type: planType },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const planType = session.metadata.plan_type;
    const subscriptionId = session.subscription;

    await db('subscriptions').insert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      plan_type: planType,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  res.json({ received: true });
};

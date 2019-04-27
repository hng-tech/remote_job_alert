const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = (async () => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      name: 'Devalert',
      description: 'Devalert Agent payment',
      images: ['https://devalert.me/images/introimg.jpg'],
      amount: 200,
      currency: 'usd',
      quantity: 1,
    }],
    success_url: 'https://devalert.me/invoice',
    cancel_url: 'https://devalert.me/payment-error',
  });
  return session;
})();
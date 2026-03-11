const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, shippingAmount, customerEmail, productName } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'No line items provided.' });
        }

        // Build Stripe line_items — one per size ordered
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${productName || '5001 Staple Tee'} — Size ${item.size}`,
                    description: 'Custom printed premium cotton tee',
                },
                unit_amount: 1299,
            },
            quantity: item.quantity,
        }));

        const origin = req.headers.origin || `https://${req.headers.host}`;

        const sessionParams = {
            mode: 'payment',
            ui_mode: 'embedded',
            line_items: lineItems,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: shippingAmount,
                        currency: 'usd',
                    },
                    display_name: 'Standard Shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 10 },
                    },
                },
            }],
            return_url: `${origin}/${req.body.returnPage || 'configurator.html'}?session_id={CHECKOUT_SESSION_ID}`,
        };

        if (customerEmail) {
            sessionParams.customer_email = customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);
        res.json({ clientSecret: session.client_secret });
    } catch (err) {
        console.error('Checkout session error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

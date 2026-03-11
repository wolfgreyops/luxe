require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const STRIPE_PK = process.env.STRIPE_PUBLISHABLE_KEY || '';

// ---------------------------------------------------
// GET /config — expose publishable key to frontend
// ---------------------------------------------------
app.get('/config', (req, res) => {
    res.json({ publishableKey: STRIPE_PK });
});

// ---------------------------------------------------
// POST /create-checkout-session
// Accepts: { items: [{size, quantity}], shippingAmount, customerEmail }
// Returns: { clientSecret }
// ---------------------------------------------------
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, shippingAmount, customerEmail, productName, returnPage } = req.body;

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
                unit_amount: 1299, // $12.99 in cents
            },
            quantity: item.quantity,
        }));

        // Build the Checkout Session
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
                        amount: shippingAmount, // in cents
                        currency: 'usd',
                    },
                    display_name: 'Standard Shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 10 },
                    },
                },
            }],
            return_url: `${req.protocol}://${req.get('host')}/${returnPage || 'configurator.html'}?session_id={CHECKOUT_SESSION_ID}`,
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
});

// ---------------------------------------------------
// GET /session-status?session_id=cs_xxx
// Returns session status + customer email for confirmation page
// ---------------------------------------------------
app.get('/session-status', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        res.json({
            status: session.status,
            customer_email: session.customer_details?.email,
            payment_status: session.payment_status,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Six Thirteen server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/configurator.html`);
});

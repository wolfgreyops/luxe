const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
};

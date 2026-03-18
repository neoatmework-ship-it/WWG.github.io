require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const BUNDLES = {
    '100': { price: 99, name: '100 Void Coins' },
    '500': { price: 399, name: '500 Void Coins' },
    '2000': { price: 1499, name: '2000 Void Coins' }
};

app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body;
    const bundle = BUNDLES[amount];

    if (!bundle) {
        return res.status(400).json({ error: 'Invalid bundle amount' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: bundle.name,
                        },
                        unit_amount: bundle.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success?amount=${amount}`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        res.json({ id: session.id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Mock success/cancel endpoints for the local environment
app.get('/success', (req, res) => {
    res.send('<h1>Payment Successful!</h1><p>You can close this window and return to the shop.</p><script>setTimeout(() => window.close(), 3000)</script>');
});

app.get('/cancel', (req, res) => {
    res.send('<h1>Payment Canceled</h1><p>Returning to shop...</p><script>window.location.href="http://localhost:3000/shop.html"</script>');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`STRIPE BACKEND RUNNING AT http://localhost:${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const votingRoutes = require('./src/routes/votingRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const auditionRoutes = require('./src/routes/auditionRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/auditions', auditionRoutes);
app.use('/api/admin', adminRoutes);

// Stripe webhook (raw body)
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), require('./src/controllers/paymentController').handleStripeWebhook);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

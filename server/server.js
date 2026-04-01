require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const roomsRoutes = require('./routes/rooms');
const requirementsRoutes = require('./routes/requirements');
const matchesRoutes = require('./routes/matches');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

/**
 * 1. FIX: PAYLOAD TOO LARGE
 * Increased limits to handle large JSON objects (like image base64 strings)
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * 2. FIX: CORS POLICY
 * Explicitly allow your frontend port. 
 * Helmet is kept, but configured to be less restrictive for local development images.
 */
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'], // Covers React and Vite defaults
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    })
);

// HTTP request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

/**
 * 3. RATE LIMITING
 * Note: If you are testing heavily, you might want to increase 'max' 
 * so you don't block yourself while developing.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit for development
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/requirements', requirementsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/admin', adminRoutes);

// Error handler (should be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ CORS enabled for http://localhost:3000`);
    console.log(`📦 Max payload size set to 10MB`);
});
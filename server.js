import { config } from 'dotenv';
config();

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import paymentRoutes from './routes/payments.js';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

const app = express();

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'pages'), { index: 'landing.html' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/components', express.static(path.join(__dirname, 'frontend', 'src', 'components')));

// General route handler function
const serveFile = (res, filePath, errorMessage) => {
    console.log(`Serving file: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`${errorMessage}:`, err.message);
            res.status(404).send(`${errorMessage} not found`);
        }
    });
};

// Specific routes for serving HTML files
app.get('/', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html'), 'landing.html');
});

app.get('/admin-login.html', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'admin-login.html'), 'admin-login.html');
});

app.get('/admin.html', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'admin.html'), 'admin.html');
});

app.get('/events.html', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'events.html'), 'events.html');
});

app.get('/about.html', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'about.html'), 'about.html');
});

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);

// Catch-all route
app.get('*', (req, res) => {
    serveFile(res, path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html'), 'landing.html (catch-all)');
});

// Seeding function with error handling
const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists, skipping seeding.');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            username: 'admin',
            password: hashedPassword,
        });
        await admin.save();
        console.log('Default admin user seeded: username: admin, password: admin123');
    } catch (error) {
        console.error('Admin seeding error:', error.message);
    }
};

// Start server function with enhanced error handling
const startServer = async () => {
    try {
        await connectDB();
        await seedAdmin(); // Seed admin on startup

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
                app.listen(PORT + 1, () => {
                    console.log(`Server running on port ${PORT + 1}`);
                });
            } else {
                console.error('Server error:', err.message);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();

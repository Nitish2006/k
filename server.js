import { config } from 'dotenv';
config();

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import paymentRoutes from './routes/payments.js';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

const app = express();

// Serve static files from 'frontend/src/pages' with landing.html as default
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'pages'), {
    index: 'landing.html'
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/components', express.static(path.join(__dirname, 'frontend', 'src', 'components')));

// Handle specific routes
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html');
    console.log('Serving landing.html from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving landing.html:', err.message);
            res.status(404).send('landing.html not found');
        }
    });
});

app.get('/admin-login.html', (req, res) => {
    const loginPath = path.join(__dirname, 'frontend', 'src', 'pages', 'admin-login.html');
    console.log('Serving admin-login.html from:', loginPath);
    res.sendFile(loginPath, (err) => {
        if (err) {
            console.error('Error serving admin-login.html:', err.message);
            res.status(404).send('admin-login.html not found');
        }
    });
});

app.get('/admin.html', (req, res) => {
    const adminPath = path.join(__dirname, 'frontend', 'src', 'pages', 'admin.html');
    console.log('Serving admin.html from:', adminPath);
    res.sendFile(adminPath, (err) => {
        if (err) {
            console.error('Error serving admin.html:', err.message);
            res.status(404).send('admin.html not found');
        }
    });
});

app.get('/events.html', (req, res) => {
    const eventsPath = path.join(__dirname, 'frontend', 'src', 'pages', 'events.html');
    console.log('Serving events.html from:', eventsPath);
    res.sendFile(eventsPath, (err) => {
        if (err) {
            console.error('Error serving events.html:', err.message);
            res.status(404).send('events.html not found');
        }
    });
});

app.get('/about.html', (req, res) => {
    const aboutPath = path.join(__dirname, 'frontend', 'src', 'pages', 'about.html');
    console.log('Serving about.html from:', aboutPath);
    res.sendFile(aboutPath, (err) => {
        if (err) {
            console.error('Error serving about.html:', err.message);
            res.status(404).send('about.html not found');
        }
    });
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);

// Catch-all route
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html');
    console.log('Serving catch-all landing.html from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving catch-all landing.html:', err.message);
            res.status(404).send('landing.html not found');
        }
    });
});

// Seeding function
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
        console.log('Default admin user seeded with username: admin, password: admin123');
    } catch (error) {
        console.error('Admin seeding error:', error.message);
    }
};

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

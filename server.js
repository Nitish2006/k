import { config } from 'dotenv';
config();

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import paymentRoutes from './routes/payments.js';
import cors from 'cors';
import path from 'path';

const app = express();

// Serve static files from 'frontend/src/pages' with landingpage.html as default
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'pages'), {
    index: 'landingpage.html' // Default index file
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/components', express.static(path.join(__dirname, 'frontend', 'src', 'components'))); // Serve components directory

// Handle the root route to explicitly serve landing.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html'));
});

// Explicitly serve admin.html for /admin.html route
app.get('/admin.html', (req, res) => {
    const adminPath = path.join(__dirname, 'frontend', 'src', 'pages', 'admin.html');
    res.sendFile(adminPath, (err) => {
        if (err) {
            console.error('Error serving admin.html:', err);
            res.status(404).send('admin.html not found');
        }
    });
});

// Middleware
app.use(express.json());
app.use(cors()); // Optional, remove if not needed

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);

// Catch-all route for client-side routing (serves landing.html for unmatched routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'src', 'pages', 'landing.html'));
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is in use, trying port ${PORT + 1}...`);
                app.listen(PORT + 1, () => {
                    console.log(`Server running on port ${PORT + 1}`);
                });
            } else {
                console.error('Server error:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

startServer();

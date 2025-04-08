import express from 'express';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Get all events (publicly accessible)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: `Error fetching events: ${error.message}` });
    }
});

// Add an event (admin only, with file upload)
router.post('/', authMiddleware, upload.single('phonepeScreenshot'), async (req, res) => {
    console.log('Request headers:', req.headers); // Debug headers
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { name, date, coordinatorName, coordinatorContact, poster, whatsappLink } = req.body;
    const phonepeScreenshot = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !date || !coordinatorName || !coordinatorContact || !poster || !whatsappLink) {
        return res.status(400).json({ message: 'All fields are required except phonepeScreenshot' });
    }

    try {
        const event = new Event({
            name,
            date,
            coordinatorName,
            coordinatorContact,
            poster,
            phonepeScreenshot,
            whatsappLink
        });
        await event.save();
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        res.status(500).json({ message: `Error adding event: ${error.message}` });
    }
});

// Delete an event (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    console.log('Delete request for ID:', req.params.id); // Debug ID
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error deleting event: ${error.message}` });
    }
});

export default router;

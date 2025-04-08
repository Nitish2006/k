import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Define Event Schema
const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    coordinatorName: { type: String, required: true },
    coordinatorContact: { type: String, required: true },
    posterUrl: { type: String, required: true },
    phonePeScreenshot: { type: String, required: true }, // Store filename
    whatsappGroupLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads'); // Relative to routes directory
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
        }
    },
}).single('phonePeScreenshot');

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    next();
};

// Add Event Route
router.post('/', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        next();
    });
}, async (req, res) => {
    try {
        const { eventName, eventDate, coordinatorName, coordinatorContact, posterUrl, whatsappGroupLink } = req.body;
        const phonePeScreenshot = req.file ? req.file.filename : null;

        // Validate required fields
        if (!eventName || !eventDate || !coordinatorName || !coordinatorContact || !posterUrl || !whatsappGroupLink || !phonePeScreenshot) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Parse date (assuming YYYY-MM-DD from <input type="date">)
        const parsedDate = new Date(eventDate);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: 'Invalid event date format' });
        }

        const event = new Event({
            eventName,
            eventDate: parsedDate,
            coordinatorName,
            coordinatorContact,
            posterUrl,
            phonePeScreenshot,
            whatsappGroupLink,
        });

        await event.save();
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: `Error adding event: ${error.message}` });
    }
});

// Get All Events Route
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Error loading events:', error);
        res.status(500).json({ message: `Error loading events: ${error.message}` });
    }
});

// Delete Event Route
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: `Error deleting event: ${error.message}` });
    }
});

// Analytics Route (Basic Implementation)
router.get('/analytics', async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = 0; // Placeholder; implement registration counting if applicable
        res.json({ totalEvents, totalRegistrations });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: `Error fetching analytics: ${error.message}` });
    }
});

export default router;

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
    phonePeScreenshot: { type: String, required: true }, // Store filename or path
    whatsappGroupLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});
const upload = multer({ storage });

// Add Event Route
router.post('/', upload.single('phonePeScreenshot'), async (req, res) => {
    try {
        const { eventName, eventDate, coordinatorName, coordinatorContact, posterUrl, whatsappGroupLink } = req.body;
        const phonePeScreenshot = req.file ? req.file.filename : null;

        // Validate required fields
        if (!eventName || !eventDate || !coordinatorName || !coordinatorContact || !posterUrl || !whatsappGroupLink || !phonePeScreenshot) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Parse date (assuming MM-DD-YYYY format)
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

export default router;

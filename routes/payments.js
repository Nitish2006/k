import express from 'express';
import Payment from '../models/Payment.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('screenshot'), async (req, res) => {
  const { eventName, paymentMethod, screenshotUrl } = req.body;

  try {
    
    const finalScreenshotUrl = req.file
      ? `/uploads/${req.file.filename}`
      : screenshotUrl || null;

    
    if (!eventName || !paymentMethod) {
      return res.status(400).json({ message: 'eventName and paymentMethod are required' });
    }

    const payment = new Payment({
      eventName,
      username: req.user.username,
      regid: req.user.regid,
      paymentMethod,
      screenshotUrl: finalScreenshotUrl,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

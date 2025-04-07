import express from "express";
import Payment from '../models/Payment.js';
import authMiddleware  from "../middleware/authMiddleware.js";
const router = express.Router();
router.post('/', authMiddleware, async (req, res) => {
    const { eventName, paymentMethod, screenshotUrl } = req.body;
    try {
        const payment = new Payment({
            eventName,
            username: req.user.username,
            regid: req.user.regid,
            paymentMethod,
            screenshotUrl,
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
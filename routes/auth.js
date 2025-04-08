import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, regid, branch, year } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with hashed password
        const user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            regid,
            branch,
            year,
        });
        await user.save();

        // Generate JWT token for the user
        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login for user or admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Corrected 'passwrd' to 'password' and 'usrname' to 'username'

    try {
        // Search for user in User collection
        let user = await User.findOne({ username });
        let role = 'user';

        // If not found in User, search in Admin collection
        if (!user) {
            user = await Admin.findOne({ username }); // Corrected 'findone' to 'findOne'
            role = 'admin';
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Reset password for user or admin
router.post('/reset-password', async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        // Search for user in User collection
        let user = await User.findOne({ username });
        if (!user) {
            // If not found in User, search in Admin collection
            user = await Admin.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
        }

        // Update password with hashed new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

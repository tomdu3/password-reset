const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate a random token
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Forgot password controller
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken();
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Log the token to the console instead of sending an email
    console.log(`link: ${process.env.CLIENT_URL}/reset-password/${token}`);
    res.status(200).json({ message: 'Reset token generated', token });
};

// Verify reset token (GET request)
const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token', status: 'error' });
    }
    return res.status(200).json({ message: 'Token verified successfully', status: 'success' });
};

// Reset password controller (POST request)
const resetPassword = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from Bearer
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const { password } = req.body;

    const user = await User.findOne({ 
        resetToken: token, 
        resetTokenExpiry: { $gt: Date.now() } 
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if the password is empty, less than 6 characters, not combination of letters, numbers and special characters
    if (!password || password.length < 6 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long and contain a combination of letters, numbers, and special characters' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
};

// Login controller
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Logged in successfully' });
};

module.exports = {
    forgotPassword,
    resetPassword,
    verifyResetToken,
    login
};

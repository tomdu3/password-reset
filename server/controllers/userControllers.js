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
    console.log(`Password reset token for ${email}: ${token}`);
    res.status(200).json({ message: 'Reset token generated', token });
};

// Verify reset token (GET request)
const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Redirect to the frontend reset password form with the token
    res.redirect(`http://localhost:3000/reset-password/${token}`);
};

// Reset password controller (POST request)
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
};

module.exports = {
    forgotPassword,
    resetPassword,
    verifyResetToken
};
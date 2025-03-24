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


// Token verification function
const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ 
            message: 'Invalid or expired token',
            valid: false
        });
    }

    return res.status(200).json({ 
        message: 'Token is valid',
        valid: true,
        email: user.email
    });
};

// Simplified reset password function
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token (no need to check expiry again)
    const user = await User.findOne({ resetToken: token });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid token',
            status: 'error'
        });
    }

    // Validate password
    if (!password || password.length < 6) {
        return res.status(400).json({ 
            message: 'Password must be at least 6 characters' 
        });
    }

    // Update password
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ 
        message: 'Password updated successfully',
        status: 'success'
    });
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

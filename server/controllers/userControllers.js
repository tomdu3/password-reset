const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
    sendSignUpEmail,
    sendResetEmail
} = require('../utils/emailService');


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

    try {
        await sendResetEmail(user.email, token);
        console.log(`link: ${process.env.CLIENT_URL}/reset-password/${token}`);
        res.status(200).json({ message: 'Reset email sent successfully' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ message: 'Failed to send reset email' });
    }
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

// Signup controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    if (!password || password.length < 6 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long and contain a combination of letters, numbers, and special characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        await sendSignUpEmail(user.email, user.username);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};


module.exports = {
    forgotPassword,
    resetPassword,
    verifyResetToken,
    login,
    signup,
};

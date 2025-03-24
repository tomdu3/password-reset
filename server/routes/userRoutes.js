const express = require('express');
const router = express.Router();
const {
    forgotPassword,
    resetPassword,
    verifyResetToken,
    login
} = require('../controllers/userControllers');

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Verify token and reset password routes
router.get('/verify-token/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

// Login Route
router.post('/login', login);

module.exports = router;
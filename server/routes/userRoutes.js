const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword, verifyResetToken } = require('../controllers/userControllers');

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route (POST for updating password)
router.post('/reset-password/:token', resetPassword);

// Verify reset token and redirect to frontend (GET for link)
router.get('/reset-password/:token', verifyResetToken);

module.exports = router;
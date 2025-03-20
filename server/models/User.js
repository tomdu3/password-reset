const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

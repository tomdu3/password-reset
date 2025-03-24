require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send(`This is the API for the website on <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
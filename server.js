const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Financial Wallet Backend API is running running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully ✅'))
    .catch(err => console.error('Database connection error ❌:', err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});

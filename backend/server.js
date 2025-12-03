require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const trainRoutes = require('./routes/trainRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB(); // Connect to Database

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trains', trainRoutes);
app.use('/api/auth', authRoutes);

// Admin Auth Route (Simple)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, token: 'secret-admin-token' });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`>> Server running on port ${PORT}`));
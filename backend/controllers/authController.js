const User = require('../models/User');

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.json({ message: "Registration Successful! Please Login." });
    } catch (err) { res.status(400).json({ error: "Email already exists" }); }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // In real app, use bcrypt!
        if (!user) return res.status(400).json({ error: "Invalid Credentials" });
        
        res.json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email, bookings: user.bookings } 
        });
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
};

module.exports = { register, login };
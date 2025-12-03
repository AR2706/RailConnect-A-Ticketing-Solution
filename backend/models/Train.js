const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    source: { type: String, required: true },
    dest: { type: String, required: true },
    price: { type: Number, required: true },
    departureTime: { type: String, required: true },
    seats: [{
        number: Number,
        isBooked: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('Train', trainSchema);
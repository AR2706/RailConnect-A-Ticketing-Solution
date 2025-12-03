const Train = require('../models/Train');

// @desc    Get all trains
// @route   GET /api/trains
const getTrains = async (req, res) => {
    const trains = await Train.find();
    res.json(trains);
};

// @desc    Add a new train (Admin)
// @route   POST /api/trains
const addTrain = async (req, res) => {
    const { name, source, dest, price, departureTime } = req.body;
    // Create 20 seats
    const seats = Array.from({ length: 20 }, (_, i) => ({ number: i + 1, isBooked: false }));
    
    const train = new Train({ name, source, dest, price, departureTime, seats });
    await train.save();
    res.status(201).json(train);
};

// @desc    Book a seat
// @route   POST /api/trains/book
const bookSeat = async (req, res) => {
    const { trainId, seatNumber, passenger } = req.body;
    const train = await Train.findById(trainId);

    if (!train) return res.status(404).json({ error: "Train not found" });

    const seat = train.seats.find(s => s.number === seatNumber);
    if (seat.isBooked) return res.status(400).json({ error: "Seat already booked" });

    seat.isBooked = true;
    await train.save();
    res.json({ message: `Seat ${seatNumber} booked for ${passenger}` });
};

// @desc    Update Train Details
// @route   PUT /api/trains/:id
const updateTrain = async (req, res) => {
    try {
        const { name, source, dest, price, departureTime } = req.body;
        // We do NOT update seats here to avoid deleting booking data accidentally
        const updatedTrain = await Train.findByIdAndUpdate(
            req.params.id, 
            { name, source, dest, price, departureTime },
            { new: true } // Return the updated document
        );
        res.json(updatedTrain);
    } catch (error) {
        res.status(400).json({ error: "Update Failed" });
    }
};

// @desc    Delete a Train
// @route   DELETE /api/trains/:id
const deleteTrain = async (req, res) => {
    try {
        await Train.findByIdAndDelete(req.params.id);
        res.json({ message: "Train Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ error: "Delete Failed" });
    }
};

// DON'T FORGET TO ADD THEM TO EXPORT
module.exports = { getTrains, addTrain, bookSeat, updateTrain, deleteTrain };
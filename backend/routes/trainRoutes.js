const express = require('express');
const router = express.Router();
const { getTrains, addTrain, bookSeat,updateTrain,deleteTrain } = require('../controllers/trainController');

router.get('/', getTrains);
router.post('/', addTrain);      // Protected in real app, open for demo
router.post('/book', bookSeat);

router.put('/:id', updateTrain);    // Edit
router.delete('/:id', deleteTrain); // Delete

module.exports = router;
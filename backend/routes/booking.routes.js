const express = require('express');
const bookingController = require('../controllers/booking.controller');
const {
  validateBookingId,
  validateCreateBooking,
  validateUpdateBooking,
} = require('../validators/booking.validator');

const router = express.Router();

router.get('/', bookingController.getAllBookings);
router.post('/', validateCreateBooking, bookingController.createBooking);
router.get('/:id', validateBookingId, bookingController.getBookingById);
router.put('/:id', validateBookingId, validateUpdateBooking, bookingController.updateBooking);
router.delete('/:id', validateBookingId, bookingController.deleteBooking);

module.exports = router;

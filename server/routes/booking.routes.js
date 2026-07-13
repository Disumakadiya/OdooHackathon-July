import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { 
  validateBookingId,
  validateCreateBooking,
  validateUpdateBooking,
 } from "../validators/booking.validator.js";

const router = express.Router();

router.get('/', bookingController.getAllBookings);
router.post('/', validateCreateBooking, bookingController.createBooking);
router.get('/:id', validateBookingId, bookingController.getBookingById);
router.put('/:id', validateBookingId, validateUpdateBooking, bookingController.updateBooking);
router.delete('/:id', validateBookingId, bookingController.deleteBooking);

export default router;

import express from 'express'
import { checkAvailability, checkAvailabilityOfCar, chnageBookingStatus, createBooking, getOwnerBookings, getUserBookings } from '../controller/bookingController.js';
import { protect } from '../middleware/auth.js';

const bookingRounter = express.Router();

bookingRounter.post('/check-availability', checkAvailabilityOfCar)
bookingRounter.post('/create', protect, createBooking)
bookingRounter.get('/user',protect, getUserBookings)
bookingRounter.get('/owner',protect, getOwnerBookings)
bookingRounter.post('/change-status',protect, chnageBookingStatus)


export default bookingRounter
import express from 'express';
import BookingController from '../controllers/booking_controller';
import auth from '../middleware/auth';
import { validBooking } from '../middleware/validator';

const router = express.Router();

const { bookSeat, findAllBooking, deleteBooking } = BookingController;

// Create Bookings endpoint:users can book a seat on trip
// Creation of Object

// const booking_controller = new BookingController();
router.post('/', auth.auth, validBooking, bookSeat);
// View all bookings endpoint:
// An Admin can see all bookings, while user can see all of his/her
// bookings.
router.get('/', auth.auth, findAllBooking);

// Users can delete their bookings
router.delete('/:id', auth.auth, deleteBooking);


export default router;

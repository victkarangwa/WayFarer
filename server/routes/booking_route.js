import express from 'express';
import BookingController from '../controllers/booking_controller';
import auth from '../middleware/auth';

const router = express.Router();

// Create Bookings endpoint:users can book a seat on trip
// Creation of Object
const booking_controller = new BookingController();
// router.post('/', auth, booking_controller.bookSeat);
// View all bookings endpoint:
// An Admin can see all bookings, while user can see all of his/her
// bookings.
// router.get('/', auth, booking_controller.findAllBooking);

// Users can delete their bookings
// router.delete('/:id', auth, booking_controller.deleteBooking);

export default router;

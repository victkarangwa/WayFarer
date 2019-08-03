import express from 'express';
import TripController from '../controllers/trip_controller';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = express.Router();

// Create Trip endpoint: only admin can create a trip
// Creation of Object
const trip_controller = new TripController();
router.post('/', admin, trip_controller.createTrip);

// Get a specific trip: admins + users
router.get('/:id', auth, trip_controller.findOneTrip);

// Both admin and users can see all trips
router.get('/', auth, trip_controller.findAllTrip);

// Cancel a trip: only admin can be able to cancel
// a certain trip
router.patch('/:id/:cancel', admin, trip_controller.cancelTrip);

export default router;

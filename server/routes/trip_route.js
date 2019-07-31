import express from 'express';
import TripController from '../controllers/trip_controller';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = express.Router();

// Create Trip endpoint: only admin can create a trip
// Creation of Object
const trip_controller = new TripController();
router.post('/', admin, trip_controller.createTrip);

// Both admin and users can see all trips
router.get('/', auth, trip_controller.findAllTrip);

export default router;

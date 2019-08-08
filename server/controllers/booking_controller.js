import Joi from 'joi';
import Booking from '../models/booking_model';
import Trip from '../models/trip_model';
import status from '../helpers/StatusCode';
import userInfo from '../helpers/userInfo';

class BookingController {
    bookSeat = (req, res) => {
      const schema = {
        trip_id: Joi.number().required(),
      };
      const result = Joi.validate(req.body, schema);
      if (result.error == null) {
        // Before you create a booking
        // go ahead and check if a trip is available in trips []
        // and is active
        if (!Trip.isTripExist(req.body.trip_id)) {
          return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The Trip you are trying to book is not found!' });
        }
        if (!Trip.isTripActive(req.body.trip_id)) {
          return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is recently cancelled!' });
        }

        // Filter all bookings with suggested trip_id
        const exact_bookings = Booking.getBookings().filter(id => id.trip_id === req.body.trip_id);
        const exact_trip = Trip.getTripById(req.body.trip_id);
        // console.log(exact_bookings.length);

        // If there is no booking corresponding to the specified trip
        if (exact_bookings.length !== 0) {
          // Check if the trip is full of other bookings
          if (exact_bookings.length >= exact_trip.seating_capacity) {
            return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is full' });
          }
        }
        // Otherwise
        const booking = Booking.reserveSeat(res, req.body, req.header('x-auth-token'));
        return res.status(status.RESOURCE_CREATED).send(booking);
      }
      return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
    };

    findAllBooking = (req, res) => {
      const id = userInfo(res, req.header('x-auth-token'));
      const bookings = Booking.getAllBooking(req.header('x-auth-token'), res, id);
      if (bookings.length === 0) {
        return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'No bookings yet' });
      }
      return res.status(status.REQUEST_SUCCEDED).send({ status: status.REQUEST_SUCCEDED, data: bookings });
    };


    deleteBooking = (req, res) => {
      Booking.removeBooking(res, req.params.id, req.header('x-auth-token'));
    }
}

export default BookingController;

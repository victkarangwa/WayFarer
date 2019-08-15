import Joi from 'joi';
import Model from '../models/db';
import status from '../helpers/StatusCode';
import userInfo from '../helpers/userInfo';

class BookingController {
  static booking() {
    return new Model('bookings');
  }

  static user() {
    return new Model('users');
  }

  static trips() {
    return new Model('trips');
  }


    static bookSeat = async (req, res) => {
      const schema = {
        trip_id: Joi.number().required(),
      };
      const result = Joi.validate(req.body, schema);
      if (result.error === null) {
        // Before you create a booking
        // go ahead and check if a trip is available in trips []
        // and is active

        try {
          const {
            trip_id,
          } = req.body;
          const user_id = userInfo.getUserId(res, req.header('x-auth-token'));
          const user = await BookingController.user().select('*', 'user_id=$1', [user_id]);
          const trip = await BookingController.trips().select('*', 'trip_id=$1', [trip_id]);
          const reduce = trip[0].seating_available - 1;
          await BookingController.trips().update('seating_available=$1', 'trip_id=$2', [reduce, trip_id]);
           console.log(userInfo.getUserId(res, req.header('x-auth-token')));
          if (user[0] === undefined) {
            return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The User associated with this token doesn\'t exist.' });
          }

          const cols = 'user_id, trip_id,bus_license_number, trip_date, first_name, last_name, email';
          const sels = '$1,$2,$3,$4,$5,$6,$7';
          const vals = [user_id, trip[0].trip_id, trip[0].bus_license_number, trip[0].trip_date, user[0].first_name, user[0].last_name, user[0].email];
          const book = await BookingController.booking().insert(cols, sels, vals);
          return res.status(status.RESOURCE_CREATED).send({
            status: status.RESOURCE_CREATED,
            message: 'Booking created successfully',
            data: book,
          });
        } catch (e) {
          return res.status(status.SERVER_ERROR).json({
            status: status.NOT_FOUND,
            error: e.message,
            e,
          });
        }
      }
      return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
    }

    static findAllBooking = async (req, res) => {
      const user = userInfo.getUserPrev(res, req.header('x-auth-token'));
      const id = userInfo.getUserId(res, req.header('x-auth-token'));
      const Userbookings = await BookingController.booking().select('*', 'user_id=$1', [id]);
      const Allbookings = await BookingController.booking().select('*');
      // const bookings = Booking.getAllBooking(req.header('x-auth-token'), res, id);
      // const user = this.getUser(res, token);
      // console.log(user);
      if (user) {
        // If it is an admin
        if (Allbookings.length === 0) {
          return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'No bookings yet' });
        }
        return res.status(status.REQUEST_SUCCEDED).json({
          status: status.REQUEST_SUCCEDED,
          message: 'All bookings retrieved successfully',
          data: Allbookings,
        });
      }
      // If not a user
      if (Userbookings.length === 0) {
        return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'No bookings yet' });
      }
      return res.status(status.REQUEST_SUCCEDED).json({
        status: status.REQUEST_SUCCEDED,
        message: 'All bookings retrieved successfully',
        data: Userbookings,
      });


      // return res.status(status.REQUEST_SUCCEDED).send({ status: status.REQUEST_SUCCEDED, data: bookings });
    };

    static deleteBooking = async (req, res) => {
      try {
        const token = req.header('x-auth-token');
        const Userbookings = await BookingController.booking().select('*', 'booking_id=$1', [req.params.id]);
        // Booking.removeBooking(res, req.params.id, token);
        // const booking = this.bookings.find(b => b.booking_id === parseInt(id, 10));
        if (!Userbookings[0]) return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, message: 'Booking is not found!' });
        // Before deleting check if he/ she is the owner of booking
        const owner_id = userInfo.getUserId(res, token);
        console.log((Userbookings.user_id === owner_id));
        if (!(userInfo.getUserPrev(res, token))) {
          return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, message: 'Access denied!, You do not have permission to delete this booking.' });
        }
        // otherwise go ahead and remove property
        const booking = await BookingController.booking().select('*', 'booking_id=$1', [req.params.id]);
        const { trip_id } = booking[0];
        const trip = await BookingController.trips().select('*', 'trip_id=$1', [trip_id]);
        const increase = trip[0].seating_available + 1;
        await BookingController.trips().update('seating_available=$1', 'trip_id=$2', [increase, trip_id]);
        await BookingController.booking().delete('booking_id=$1', [req.params.id]);
        return res.status(status.REQUEST_SUCCEDED).send({ status: status.REQUEST_SUCCEDED, data: { message: 'Booking deleted successfully' } });
      } catch (e) {
        return res.status(status.SERVER_ERROR).json({
          status: status.NOT_FOUND,
          error: e.message,
          // e,
        });
      }
    }
}

export default BookingController;

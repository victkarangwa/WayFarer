
import jwt from 'jsonwebtoken';
import Trip from './trip_model';
import User from './user_model';
import userInfo from '../helpers/userInfo';
import status from '../helpers/StatusCode';

class Booking {
  constructor() {
    this.bookings = [];
    this.tempBookings = [];
  }

    reserveSeat = (res, data, token) => {
      // generate created On time
      const newId = this.tempBookings.length + 1;
      // this will create  a many-many relationship table
      // Normally called Pivot table to merge users and trips tables
      const newBooking = {
        booking_id: newId,
        user_id: userInfo(res, token),
        trip_id: data.trip_id,
        createdOn: Date(),
      };
      // for now we have created a booking in
      // bookings array as required in entity specs of Booking
      this.bookings.push(newBooking);
      // so lets go ahead and construct response payload
      // to return back to end user
      // firstly get the posted trip in trips[]
      // I.E: firing up a method in trip_model

      const trip = Trip.getTripDetail(data.trip_id);
      // then grab the owner from that trip
      // to pass to next function to find his or details in users[]
      // i.E: user_model
      const tripCreator = User.grabUserDetail(newBooking.user_id);
      let newBookingResponse = {
        booking_id: newId,
        bus_license_number: trip.bus_license_number,
        trip_date: trip.trip_date,
        first_name: tripCreator.first_name,
        last_name: tripCreator.last_name,
        user_email: tripCreator.email,

      };
      // Store necessary booking info for future use
      const temp = newBookingResponse;

      // Add user_id property
      temp.user_id = newBooking.user_id;
      temp.trip_id = newBooking.trip_id;

      // Keep the booking info
      this.tempBookings.push(temp);

      newBookingResponse = {
        status: status.RESOURCE_CREATED,
        message: 'Booking created successfully',
        data: newBookingResponse,
      };

      return newBookingResponse;
    };


    getAllBooking = (token, res, id) => {
      const user = this.getUser(res, token);
      if (user.is_admin) {
        return this.tempBookings;
      }
      const userBookings = this.tempBookings.filter(obj => obj.user_id === id);

      // this.tempBookings.find(k => k.user_id === parseInt(id, 10))];
      return userBookings;
    }

    // return all bookings to check seat avalability
    getBookings = () => this.bookings;

    // isSeatAvailable = (trip_id) => {
    //   const booking_trip = this.tempBookings.find(i => i.trip_id === parseInt(trip_id, 10));
    //   const Chosen_trip = Trip.trips.find(i => i.trip_id === parseInt(trip_id, 10));
    //   const seats = Chosen_trip.seating_capacity;
    //   const bookings = booking_trip.booking_id;

    //   if (seats <= bookings) { return false; }
    //   return true;
    // }

      getUser = (res, token) => {
        // decode token for the sake of picking user_id
        // to use in setting trip owner.
        try {
          const decoded = jwt.verify(token, 'secretKey');
          // it returns user object
          return decoded;
        } catch (error) {
          return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: error.message });
        }
      };


      // User can delete his / her own booking
    removeBooking = (res, id, token) => {
      // check if booking exists in bookings

      const booking = this.bookings.find(b => b.booking_id === parseInt(id, 10));
      if (!booking) return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, message: 'Booking is not found!' });
      // Before deleting check if he/ she is the owner of booking
      const owner_id = userInfo(res, token);
      if (!(booking.user_id === owner_id)) {
        return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, message: 'Access denied!, You do not have permission to delete this booking.' });
      }
      // otherwise go ahead and remove property
      const index = this.bookings.indexOf(booking);
      this.bookings.splice(index, 1);
      return res.status(status.REQUEST_SUCCEDED).send({ status: status.REQUEST_SUCCEDED, data: { message: 'Booking deleted successfully' } });
    }
}

export default new Booking();
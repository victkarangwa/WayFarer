
import Model from '../models/db';
import status from '../helpers/StatusCode';
import userInfo from '../helpers/userInfo';

class TripController {
  static model() {
    return new Model('trips');
  }

  // Create a trip
   createTrip = async (req, res) => {
     try {
       const {
         seating_capacity,
         bus_license_number,
         origin,
         destination,
         trip_date,
         fare,
         status,

       } = req.body;
       const seating_available = seating_capacity;
       const createdOn = Date();
       const cols = ' seating_capacity, seating_available, bus_license_number, origin, destination, trip_date, fare, status,created_on';
       const sels = '$1, $2, $3, $4, $5, $6, $7, $8, $9';
       const vals = [seating_capacity, seating_available, bus_license_number, origin, destination, trip_date, fare, status, createdOn];
       const trip = await TripController.model().insert(cols, sels, vals);

       return res.status(201).json({
         status: 201,
         message: 'Trip created successfully',
         data: trip,
       });
     } catch (e) {
       return res.status(500).json({
         error: e.message,
         e,
       });
     }
   };

   findOneTrip = async (req, res) => {
     if (isNaN(req.params.id.trim())) {
       return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip id should be an integer' });
     }
     let trip = await TripController.model().select('*', 'trip_id=$1', [req.params.id]);
     if (trip.length === 0) {
       return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'Such kind of trip is not found!' });
     }
     trip = {
       status: status.REQUEST_SUCCEDED,
       message: 'Trip retrieved successfully',
       data: trip,
     };
     return res.status(status.REQUEST_SUCCEDED).send(trip);
   };

   // Find all available trip
    findAllTrip = async (req, res) => {
      const token = req.header('x-auth-token');
      let { origin, destination } = req.query;
      // Filter by origin
      if (origin !== undefined) {
        const trips = await TripController.model().select('*', 'origin=$1', [origin]);
        if (trips.length === 0) {
          return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, data: `No trips with origin '${origin}' ` });
        }
        return res.status(status.REQUEST_SUCCEDED).send(
          {
            status: status.REQUEST_SUCCEDED,
            message: `Trips with origin '${origin}' retrieved successfully`,
            data: trips,
          },
        );
      }

      // Filter by Destination
      if (destination !== undefined) {
        const trips = await TripController.model().select('*', 'destination=$1', [destination]);
        if (trips.length === 0) {
          return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, data: `No trips with destination '${destination}' ` });
        }
        return res.status(status.REQUEST_SUCCEDED).send(
          {
            status: status.REQUEST_SUCCEDED,
            message: `Trips with destination '${destination}' retrieved successfully`,
            data: trips,
          },
        );
      }


      // With no filter
      let trips;
      if (userInfo.getUserPrev(res, token)) {
        // Display all trips to the admin
        trips = await TripController.model().select('*');
      } else {
        // Display only active trips to the users
        trips = await TripController.model().select('*', 'status=$1', ['active']);
      }

      if (trips.length === 0) {
        return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, data: 'No trips yet!' });
      }
      return res.status(status.REQUEST_SUCCEDED).send(
        {
          status: status.REQUEST_SUCCEDED,
          message: 'All trips retrieved successfully',
          data: trips,
        },
      );
    };


    // Cancela specific trip
    cancelTrip = async (req, res) => {
      try {
        const trip = await TripController.model().select('*', 'trip_id=$1', [req.params.id]);
        // console.log(isNaN(req.params.id.trim()));
        // if (!(req.params.cancel.trim() === 'cancel')) {
        //   return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Please supply :cancel param!' });
        // }
        // if (isNaN(req.params.id.trim())) {
        //   return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip id should be an integer' });
        // }
        if (trip.length === 0) return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'Such trip is not found!' });

        // If the trip is already cancelled
        if (trip[0].status === 'canceled') return res.status(status.REQUEST_CONFLICT).send({ status: status.REQUEST_CONFLICT, error: 'Trip is already cancelled' });


        TripController.model().update('status=$1', 'trip_id=$2', ['canceled', req.params.id]);
        return res.status(status.REQUEST_SUCCEDED).send({ status: status.REQUEST_SUCCEDED, data: { message: 'Trip canceled successfully' } });
      } catch (e) {
        return res.status(500).json({
          status: 500,
          error: e.message,
          // e,
        });
      }
    }
}

export default TripController;

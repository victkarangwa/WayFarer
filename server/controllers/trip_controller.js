import Joi from 'joi';
import _ from 'lodash';
import Trip from '../models/trip_model';
import status from '../helpers/StatusCode';

class TripController {
  createTrip = (req, res) => {
    const schema = {
      seating_capacity: Joi.number().required(),
      bus_license_number: Joi.string().trim().required(),
      origin: Joi.string().trim().required(),
      destination: Joi.string().trim().required(),
      trip_date: Joi.date().required(),
      fare: Joi.number().required(),
      status: Joi.string().trim().required(),
    };
    const result = Joi.validate(req.body, schema);
    if (result.error == null) {
      const trip = Trip.create(res, req.body, req.header('x-auth-token'));
      return res.status(status.RESOURCE_CREATED).send(trip);
    }
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
  };

   findOneTrip = (req, res) => {
     let trip = Trip.getTripById(req.params.id);
     if (isNaN(req.params.id.trim())) {
       return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip id should be an integer' });
     }
     if (!trip) {
       return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'Such kind of trip is not found!' });
     }
     trip = {
       status: status.REQUEST_SUCCEDED,
       message: 'Trip retrieved successfully',
       data: _.pick(trip, ['trip_id', 'seating_capacity',
         'origin', 'destination', 'trip_date', 'fare', 'createdOn']),
     };
     return res.status(status.REQUEST_SUCCEDED).send(trip);
   };

   // Find all available trip
    findAllTrip = (req, res) => {
      const trips = Trip.getAllTrip();
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
    cancelTrip = (req, res) => {
      // console.log(isNaN(req.params.id.trim()));
      if (!(req.params.cancel.trim() === 'cancel')) {
        return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Please supply :cancel param!' });
      }
      if (isNaN(req.params.id.trim())) {
        return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip id should be an integer' });
      }

      Trip.cancel(res, req.params);
      return res.status(status.RESOURCE_CREATED).send({ status: status.RESOURCE_CREATED, data: { message: 'Trip cancelled successfully' } });
    }
}

export default TripController;

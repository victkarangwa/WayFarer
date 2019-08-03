import Joi from 'joi';
import _ from 'lodash';
import Trip from '../models/trip_model';

class TripController {
  createTrip = (req, res) => {
    const schema = {
      seating_capacity: Joi.number().required(),
      bus_license_number: Joi.string().required(),
      origin: Joi.string().required(),
      destination: Joi.string().required(),
      trip_date: Joi.date().required(),
      fare: Joi.number().required(),
      status: Joi.string().required(),
    };
    const result = Joi.validate(req.body, schema);
    if (result.error == null) {
      const trip = Trip.create(res, req.body, req.header('x-auth-token'));
      return res.status(201).send(trip);
    }
    return res.status(400).send({ status: 'error', error: `${result.error.details[0].message}` });
  };

   findOneTrip = (req, res) => {
     let trip = Trip.getTripById(req.params.id);
     if (!trip) {
       return res.status(404).send({ status: 'error', message: 'Such kind of trip is not found!' });
     }
     trip = {
       status: 'success',
       data: _.pick(trip, ['trip_id', 'seating_capacity',
         'origin', 'destination', 'trip_date', 'fare', 'createdOn']),
     };
     return res.status(200).send(trip);
   };

   // Find all available trip
    findAllTrip = (req, res) => {
      const trips = Trip.getAllTrip();
      if (trips.length === 0) {
        return res.status(200).send({ status: 'success', data: 'No trips yet!' });
      }
      return res.status(200).send({ status: 'success', data: trips });
    };

    // Cancela specific trip
    cancelTrip = (req, res) => {
      // console.log(req.params.cancel);
      if (!(req.params.cancel.trim() === 'cancel')) {
        return res.status(400).send({ status: 'error', error: 'Please supply :cancel param!' });
      }
      Trip.cancel(res, req.params);
      return res.status(201).send({ status: 'success', data: { message: 'Trip cancelled successfully' } });
    }
}

export default TripController;

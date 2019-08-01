import Joi from 'joi';
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

    findAllTrip = (req, res) => {
      const trips = Trip.getAllTrip();
      if (trips.length === 0) {
        return res.status(200).send({ status: 'success', data: 'No trips yet!' });
      }
      return res.status(200).send({ status: 'success', data: trips });
    };
}

export default TripController;

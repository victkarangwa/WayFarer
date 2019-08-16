import Joi from 'joi';
import Model from '../models/db';
import status from '../helpers/StatusCode';


const Booking_model = new Model('bookings');
const Trip_model = new Model('trips');


// Check user field
export const validData = (name) => {
  let entity = name.replace(/[^a-zA-Z0-9]/g, '');
  if (entity) return true;
  return false;
};
export const validCancel = (req, res, next) => {
  if (!(req.params.cancel.trim() === 'cancel')) {
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Please supply :cancel param!' });
  }
  if (isNaN(req.params.id.trim())) {
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip id should be an integer' });
  }
  next();
};


// Validate signup data
export const validSignup = (req, res, next) => {
  const schema = {
    first_name: Joi.string().alphanum().required(),
    last_name: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    is_admin: Joi.boolean().default(false),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error !== null) { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` }); }
  if (!validData(req.body.first_name)) {
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'first_name can\'t be empty' });
  }
  if (!validData(req.body.last_name)) {
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'last_name can\'t be empty' });
  }
  if (!validData(req.body.password)) {
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'password can\'t be empty' });
  }

  next();
};

export const validSignin = async (req, res, next) => {
  // validation of Request payload
  // using JOI npm
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
    return;
  }
  return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
};

export const validTrip = async (req, res, next) => {
  try {
    const schema = {
      seating_capacity: Joi.number().required(),
      bus_license_number: Joi.string().trim().required(),
      origin: Joi.string().alphanum().trim().required(),
      destination: Joi.string().alphanum().trim().required(),
      trip_date: Joi.date().min('now').required(),
      fare: Joi.number().min(0).max(10000).required(),
      status: Joi.string().trim().required(),
    };


    const result = Joi.validate(req.body, schema);
    // Test trip fare
    const {
      fare, trip_date, bus_license_number, status: Tstatus,
    } = req.body;
    if (Tstatus.toLowerCase() !== 'active' && Tstatus.toLowerCase() !== 'canceled') { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip status should be either "active" or "canceled:' }); }

    const Farechecker = `N${fare}N`;
    if (Farechecker.indexOf('e') > -1) return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip fare should be of valid price' });
    const sameTrip = await Trip_model.select('*', 'trip_date=$1 AND bus_license_number=$2', [trip_date, bus_license_number]);
    // Check if the bus has multiple trip
    if (sameTrip.length) {
      return res.status(status.NOT_FOUND).send({ status: status.REQUEST_CONFLICT, error: `The bus with ${bus_license_number} has already assigned a trip on same date of ${trip_date}` });
    }// check fare validity
    if (isNaN(fare)) return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Invalid trip fare' });
    if (req.body.fare < 0) { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip fare can not be negative' }); }
    if (req.body.seating_capacity < 0) { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Bus seating capacity can not be negative' }); }
    if (result.error === null) {
      next();
      return;
    }
    return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
  } catch (e) {
    return res.status(500).json({
      status: status.BAD_REQUEST,
      error: 'Invalid inputs',
    });
  }
};

export const validBooking = async (req, res, next) => {
  try {
    const schema = {
      trip_id: Joi.number().required(),
      seats_booked: Joi.number().min(1).max(5).required(),
    };
    const result = Joi.validate(req.body, schema);
    if (result.error !== null) return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });


    const { trip_id, seats_booked } = req.body;
    const trip = await Trip_model.select('*', 'trip_id=$1', [trip_id]);
    if (!trip[0]) { return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The Trip you are trying to book is not found!' }); }

    const tripsBooked = await Booking_model.select('*', 'trip_id=$1', [trip_id]);
    const seats_Av = trip[0].seating_available;
    // console.log(tripsBooked.length);
    const NumberOBookings = tripsBooked.length;
    const seats = await Trip_model.select('seating_capacity', 'trip_id=$1', [trip_id]);
    if (trip[0].status === 'canceled') {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is recently cancelled!' });
    }

    if (NumberOBookings >= parseInt(seats[0].seating_capacity, 10)) {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is full' });
    }
    if (seats_booked > seats_Av) {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: `Only ${seats_Av} seats are available ` });
    }
    next();
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      // e,

    });
  }
};

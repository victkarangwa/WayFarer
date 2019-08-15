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
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
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
      origin: Joi.string().trim().required(),
      destination: Joi.string().trim().required(),
      trip_date: Joi.date().min('now').required(),
      fare: Joi.number().min(0).max(10000).required(),
      status: Joi.string().trim().required(),
    };
    const result = Joi.validate(req.body, schema);
    // Test trip fare
    const { fare } = req.body;
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
    };
    const result = Joi.validate(req.body, schema);
    if (result.error !== null) return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });


    const { trip_id } = req.body;
    const trip = await Trip_model.select('*', 'trip_id=$1', [trip_id]);
    const tripsBooked = await Booking_model.select('*', 'trip_id=$1', [trip_id]);
    // console.log(tripsBooked.length);
    const NumberOBookings = tripsBooked.length;
    const seats = await Trip_model.select('seating_capacity', 'trip_id=$1', [trip_id]);
    // console.log(`${NumberOBookings} and ${seats[0].seating_capacity}`);
    if (!trip[0]) { return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The Trip you are trying to book is not found!' }); }

    if (trip[0].status === 'canceled') {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is recently cancelled!' });
    }
    if (NumberOBookings >= parseInt(seats[0].seating_capacity, 10)) {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'The Trip you are trying to book is full' });
    }
    next();

    
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      // e,

    });
  }
};

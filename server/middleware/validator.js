import Joi from 'joi';
import status from '../helpers/StatusCode';


// heck email existance


// Check user field
export const validData = (name) => {
  let entity = name.replace(/[^a-zA-Z0-9]/g, '');
  if (entity) return true;
  return false;
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
  const schema = {
    seating_capacity: Joi.number().required(),
    bus_license_number: Joi.string().trim().required(),
    origin: Joi.string().trim().required(),
    destination: Joi.string().trim().required(),
    trip_date: Joi.date().min('now').required(),
    fare: Joi.number().required(),
    status: Joi.string().trim().required(),
  };
  const result = Joi.validate(req.body, schema);
  if (req.body.fare < 0) { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Trip fare can not be negative' }); }
  if (req.body.seating_capacity < 0) { return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: 'Bus seating capacity can not be negative' }); }
  if (result.error === null) {
    next();
    return;
  }
  return res.status(status.BAD_REQUEST).send({ status: status.BAD_REQUEST, error: `${result.error.details[0].message}` });
};

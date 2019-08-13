import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import auth from './auth';
import status from '../helpers/StatusCode';

dotenv.config();

const admin = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) { return res.status(status.UNAUTHORIZED).send({ status: status.UNAUTHORIZED, error: 'Access denied. No token provided' }); }

  try {
    const decoded_jwt = jwt.verify(token, process.env.Token_Key);
    // Go ahead and grab user_id from JWT
    // and find if that id exists in our users[](later on would be)\
    // because we can not trust that user still exists
    if (!auth.isUserExist(decoded_jwt.user_id)) {
      return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The User associated with this token doesn\'t exist.' });
    }
    // check again if user is admin to be allowed to perform
    // [create a trip, cancel a trip, see all bookings]
    if (!decoded_jwt.is_admin) {
      return res.status(status.FORBIDDEN).send({ status: status.FORBIDDEN, error: 'You are not authorized to perform this action.' });
    }
    next();
  } catch (error) {
    return res.status(status.BAD_REQUEST).send(
      { status: status.BAD_REQUEST, error: error.message },
    );
  }
};

export default admin;

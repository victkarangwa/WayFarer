import jwt from 'jsonwebtoken';
import User from '../models/user_model';

const admin = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) { return res.status(401).send({ status: 'error', error: 'Access denied. No token provided' }); }

  try {
    const decoded_jwt = jwt.verify(token, 'secretKey');
    // Go ahead and grab user_id from JWT
    // and find if that id exists in our users[](later on would be)\
    // because we can not trust that user still exists
    if (!User.isUserExist(decoded_jwt.id)) {
      return res.status(404).send({ status: 'error', error: 'The User associated with this token doesn\'t exist.' });
    }
    // check again if user is admin to be allowed to perform
    // [create a trip, cancel a trip, see all bookings]
    if (!decoded_jwt.is_admin) {
      return res.status(403).send({ status: 'error', error: 'You are not authorized to perform this action.' });
    }
    next();
  } catch (error) {
    return res.status(400).send({ status: 'error', error: error.message });
  }
};

export default admin;

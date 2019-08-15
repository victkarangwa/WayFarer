import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from '../models/db';
import status from '../helpers/StatusCode';

dotenv.config();
const model = new Model('users');
const isUserExist = async (decodedId) => {
  // Check if user with this token exist in our DB
  const user = await model.select('*', 'user_id=$1', [decodedId]);
  if (user[0]) {
    // console.log(user[0]);
    // Catch any error if it rises
    return true;
  }
};
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
 
  if (!token) return res.status(status.UNAUTHORIZED).send({ status: status.UNAUTHORIZED, error: 'Access denied. No token provided' });

  try {
    const decoded_jwt = jwt.verify(token, process.env.Token_Key);
    // Go ahead and grab user_id from JWT
    // and find if that id exists in our users[](later on would be)
    // because we can not trust that user still exists
    // console.log(` code: ${User.isUserExist(decoded_jwt.user_id)}`);
    if (!isUserExist(decoded_jwt.user_id)) {
      return res.status(status.NOT_FOUND).send({ status: status.NOT_FOUND, error: 'The User associated with this token doesn\'t exist.' });
    }
    next();
  } catch (error) {
    return res.status(status.BAD_REQUEST).send(
      { status: status.BAD_REQUEST, error: error.message },
    );
  }
};

export default { auth, isUserExist };

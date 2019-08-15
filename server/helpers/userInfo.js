import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import status from './StatusCode';


dotenv.config();

const getUserId = (res, token) => {
  // decode token for the sake of picking user_id
  // to use in setting trip owner.

  try {
    const decoded = jwt.verify(token, process.env.Token_Key);
    // console.log(`user id ${decoded.is_admin}`);
    return decoded.user_id;
    
  } catch (error) {
    return res.status(status.BAD_REQUEST).send({ status: 'error', error: error.message });
  }
};
const getUserPrev = (res, token) => {
  // decode token for the sake of picking user_id
  // to use in setting trip owner.

  try {
    const decoded = jwt.verify(token, process.env.Token_Key);
    return decoded.is_admin;
  } catch (error) {
    return res.status(status.BAD_REQUEST).send({ status: 'error', error: error.message });
  }
};

export default { getUserId, getUserPrev };

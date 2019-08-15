import jwt from 'jsonwebtoken';

const generateAuthToken = (user_id, admin) => {
  const token = jwt.sign({ user_id, is_admin: admin }, process.env.Token_Key);
  return token;
};

export default generateAuthToken;

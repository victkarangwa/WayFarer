import jwt from 'jsonwebtoken';

const generateAuthToken = (id, admin) => {
  const token = jwt.sign({ id, is_admin: admin }, process.env.Token_Key);
  return token;
};

export default generateAuthToken;

import jwt from 'jsonwebtoken';

const generateAuthToken = (id, admin) => {
  const token = jwt.sign({ id, is_admin: admin }, 'secretKey');
  return token;
};

export default generateAuthToken;

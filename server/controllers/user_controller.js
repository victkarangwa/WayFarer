import Joi from 'joi';
import User from '../models/user_model';

class UserController {
    signUp = (req, res) => {
      // validation of Request payload
      // using JOI npm
      const schema = {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        is_admin: Joi.boolean().default(false),
      };
      const result = Joi.validate(req.body, schema);
      if (result.error == null) {
        if (User.isEmailTaken(req.body.email)) {
          // 409 = Conflict due to existing email
          return res.status(409).send({ status: 'error', error: `${req.body.email} already exists` });
        }
        // Everything is okay
        // We fire up User model to create user
        const user = User.create(req.body);
        return res.status(201).send(user);
      }
      return res.status(400).send({ status: 'error', error: `${result.error.details[0].message}` });
    };

    signIn = (req, res) => {
      // validation of Request payload
      // using JOI npm
      const schema = {
        email: Joi.string().email().required(),
        password: Joi.required(),
      };
      const result = Joi.validate(req.body, schema);
      if (result.error == null) {
      // Everything is okay
        // We fire up User model to login user
        const user = User.login(req.body);
        if (user.status === 'success') {
          res.set('x-auth-token', user.data.token);
          return res.status(200).send(user);
        }

        return res.status(401).send(user);
      }
      return res.status(400).send({ status: 'error', error: `${result.error.details[0].message}` });
    };
}


export default UserController;

import jwt from 'jsonwebtoken';
import _ from 'lodash';


class User {
  constructor() {
    this.users = [
      {
        id: 7,
        first_name: 'victor',
        last_name: 'karangwa',
        email: 'victor@gmail.com',
        password: 'payloadpassword',
        is_admin: true,
      },
    ];
  }

    create = (payload) => {
      const currentId = this.users.length + 1;

      let newUser = {
        token: this.generateAuthToken(currentId, payload.is_admin),
        id: currentId,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: payload.password,
        is_admin: payload.is_admin,
      };
      this.users.push(newUser);
      newUser = {
        status: 'success',
        data: _.pick(newUser, ['token', 'id',
          'first_name', 'last_name', 'email']),
      };

      return newUser;
    };

    login = (payload) => {
    // check if user email and password exists
    // in our users array

      const user = this.users.find(Wuser => (Wuser.email === payload.email)
       && ((Wuser.password === payload.password)));
      if (!user) {
        return {
          status: 'error',
          error:
       'email or password is incorrect!.',
        };
      }

      let result = {
        token: this.generateAuthToken(user.id, user.is_admin),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };
      result = { status: 'success', data: result };

      return result;
    };

    isEmailTaken = email => this.users.find(u => u.email === email);

    isUserExist = user_id => this.users.find(u => u.id === user_id);

    generateAuthToken = (id, admin) => {
      const token = jwt.sign({ id, is_admin: admin }, 'secretKey');
      return token;
    };

     // return a certain user basing on his or id
     grabTripCreatorDetail = (user_id) => {
       const user = this.users.find(u => u.id === parseInt(String, user_id));
       return user;
     }
}

export default new User();

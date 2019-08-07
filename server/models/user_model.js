import _ from 'lodash';
import generateAuthToken from '../helpers/tokens';
import status from '../helpers/StatusCode';


class User {
  constructor() {
    this.users = [
      {
        id: 1,
        first_name: 'Victor',
        last_name: 'KARANGWA',
        email: 'victor@gmail.com',
        password: 'payloadpassword',
        is_admin: true,
      },
    ];
  }

    create = (payload) => {
      const currentId = this.users.length + 1;

      let newUser = {
        token: generateAuthToken(currentId, payload.is_admin),
        id: currentId,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: payload.password,
        is_admin: payload.is_admin,
      };
      this.users.push(newUser);
      newUser = {
        status: status.RESOURCE_CREATED,
        message: 'User successfully signed up',
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
          status: status.UNAUTHORIZED,
          error:
       'email or password is incorrect!',
        };
      }

      let result = {
        token: generateAuthToken(user.id, user.is_admin),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };
      result = {
        status: status.REQUEST_SUCCEDED,
        message: 'User successfully signed in',
        data: result,
      };

      return result;
    };

    isEmailTaken = email => this.users.find(u => u.email === email);

    isUserExist = user_id => this.users.find(u => u.id === user_id);

    // return a certain user basing on his or id
    grabUserDetail = (user_id) => {
      const user = this.users.find(u => u.id === parseInt(user_id, 10));
      return user;
    }

    validData = (name) => {
      let entity = name.replace(/[^a-zA-Z0-9]/g, '');
      if (entity) return true;
      return false;
    };
}

export default new User();

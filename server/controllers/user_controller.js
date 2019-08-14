
import generateAuthToken from '../helpers/tokens';
import Model from '../models/db';
import hashPassword from '../helpers/hashPassword';
import status from '../helpers/StatusCode';

class UserController {
  static model() {
    return new Model('users');
  }

  // Get all users
  static retrieveAllUsers = async (req, res) => {
    try {
      const rows = await this.model().select('user_id, email, first_name, last_name, is_admin');
      // If no users are registered
      if (rows.length === 0) {
        return res.status(400).json({
          status: status.NOT_FOUND,
          error: 'No user found',
        });
      }
      // If all users have been retrieved
      return res.status(200).json({
        status: status.REQUEST_SUCCEDED,
        message: 'All users are retrived successfully',
        data: rows,

      });
    } catch (e) {
      // Catch any error if it rises
      return res.status(status.SERVER_ERROR).json({
        status: status.SERVER_ERROR,
        error: 'server error',
        // e,
      });
    }
  }

  //  Signup
  static signup = async (req, res) => {
    try {
      let {
        first_name,
        last_name,
        email,
        password,
        is_admin,
      } = req.body;

      // Generate a unique ID
      // Check if Email already exist
      const user = await this.model().select('*', 'email=$1', [email]);
      if (user[0]) {
        // Catch any error if it rises
        return res.status(status.REQUEST_CONFLICT).json({
          status: status.REQUEST_CONFLICT,
          error: `${email} already exists`,

        });
      }
      // Hash user password before being stored
      password = await hashPassword.encryptPassword(password);
      // console.log(password);
      const cols = 'first_name, last_name, email, is_admin, password';
      const sels = `'${first_name}', '${last_name}', '${email}', '${is_admin}', '${password}'`;
      const rows = await this.model().insert(cols, sels);


      let token = generateAuthToken(rows[0].user_id, rows[0].is_admin);

      return res.status(status.RESOURCE_CREATED).json({
        status: status.RESOURCE_CREATED,
        message: 'User signed up successfully',
        token,
      });
      // });
    } catch (e) {
      // Catch any error if it rises
      return res.status(500).json({
        status: status.SERVER_ERROR,
        error: 'server error',
        // e,
      });
    }
  }


    static signin = async (req, res) => {
      try {
        const { email, password } = req.body;
        const data = await this.model().select('*', 'email=$1', [email]);
        //  If user credentials are correct
        if (data[0] && hashPassword.decryptPassword(password, data[0].password)) {
          const token = generateAuthToken(data[0].user_id, data[0].is_admin);
          return res.status(status.REQUEST_SUCCEDED).json({
            status: status.REQUEST_SUCCEDED,
            message: 'user signed in successfully',
            token,
          });
        }
        // If no user is found with provided inputs
        return res.status(status.UNAUTHORIZED).json({
          status: status.UNAUTHORIZED,
          error: 'Invalid Email or Password',
        });
      } catch (e) {
        // Catch any error if it rises
        return res.status(status.SERVER_ERROR).json({
          status: status.SERVER_ERROR,
          error: 'server error',
          // e,
        });
      }
    };
}


export default UserController;

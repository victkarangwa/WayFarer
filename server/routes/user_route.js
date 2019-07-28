import express from 'express';
import UserController from '../controllers/user_controller';

const router = express.Router();

// signup endpoint
// Creation of Object
const user_controller = new UserController();
router.post('/signup', user_controller.signUp);

// Login user endpoint
router.post('/signin', user_controller.signIn);

export default router;

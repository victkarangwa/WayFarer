import express from 'express';
import admin from '../middleware/admin';
import { validSignup, validSignin } from '../middleware/validator';
import UserController from '../controllers/user_controller';

const router = express.Router();


// signup endpoint
// Creation of Object
const { retrieveAllUsers, signup, signin } = UserController;

// Admin view all users
router.get('/users', admin, retrieveAllUsers);

// Sign up
router.post('/signup', validSignup, signup);

// Sign in
router.post('/signin', validSignin, signin);

// Login user endpoint
// router.post('/signin', user_controller.signIn);

export default router;

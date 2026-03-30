import express from 'express';
import { loginUser, registerUser, forgotPassword, resetPassword } from '../Controllers/AuthController.js';
import userModel from '../Models/userModel.js';

const router = express.Router(); // Register Route  



router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router; // Export the router

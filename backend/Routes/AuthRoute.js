import express from 'express';
import { loginUser, registerUser } from '../Controllers/AuthController.js';
import userModel from '../Models/userModel.js';

const router = express.Router(); // Register Route  



router.post('/register', registerUser); 
router.post('/login', loginUser);
export default router; // Export the router

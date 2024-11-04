import express from 'express';
import { login } from '../controllers/login.js';
import { register } from '../controllers/register.js';
import { resetPassword } from '../controllers/resetPassword.js';


const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);

export default router;

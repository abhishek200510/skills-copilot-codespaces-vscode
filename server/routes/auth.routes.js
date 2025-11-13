import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('role')
    .isIn(['admin', 'clinic_staff', 'patient', 'pharmacy_staff'])
    .withMessage('Valid role is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', authRateLimiter, loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;

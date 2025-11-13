import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import { generateTokens } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import emailService from '../services/emailService.js';

/**
 * Register new user
 */
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role, clinicId, pharmacyId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // For new clinic registration, create clinic first
    let tenantId;
    if (role === 'admin' && !clinicId) {
      const clinic = new Clinic({
        tenantId: new Date().getTime().toString(), // Temporary, will be updated
        name: req.body.clinicName,
        email: req.body.clinicEmail || email,
        phone: req.body.clinicPhone || phone,
        address: req.body.address || {},
      });
      await clinic.save();
      tenantId = clinic._id;
      clinic.tenantId = clinic._id; // Set tenantId to clinic's own ID
      await clinic.save();
    } else if (clinicId) {
      const clinic = await Clinic.findById(clinicId);
      if (!clinic) {
        return next(new AppError('Clinic not found', 404));
      }
      tenantId = clinic.tenantId;
    } else {
      // For patients, use a default tenant or create logic for multi-tenant patient management
      tenantId = req.body.tenantId || new Date().getTime().toString();
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      tenantId,
      clinicId: clinicId || (role === 'admin' ? tenantId : undefined),
      pharmacyId,
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token not provided', 401));
    }

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set new refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

    // Clear cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('clinicId', 'name email phone')
      .populate('pharmacyId', 'name email phone');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address', 'dateOfBirth', 'gender'];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

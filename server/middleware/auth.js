import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // Or check for token in cookies
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized, no token provided', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        tenantId: decoded.tenantId,
      };

      next();
    } catch (error) {
      return next(new AppError('Not authorized, token invalid or expired', 401));
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    next();
  };
};

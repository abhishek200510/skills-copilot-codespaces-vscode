import { sanitizeInput } from '../utils/sanitize.js';

/**
 * Middleware to sanitize all user inputs to prevent NoSQL injection
 */
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  next();
};

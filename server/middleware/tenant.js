import { AppError } from './errorHandler.js';

/**
 * Middleware to ensure all database queries are scoped to the current tenant
 * This middleware should be applied after authentication
 */
export const tenantMiddleware = (req, res, next) => {
  try {
    // Get tenantId from authenticated user
    if (!req.user || !req.user.tenantId) {
      return next(new AppError('Tenant context not found', 400));
    }

    // Attach tenant filter to request for use in controllers
    req.tenantId = req.user.tenantId;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to add tenant filter to queries
 * Usage: const filter = getTenantFilter(req, { status: 'active' });
 */
export const getTenantFilter = (req, additionalFilters = {}) => {
  return {
    tenantId: req.tenantId,
    ...additionalFilters,
  };
};

/**
 * Middleware to validate tenant access for specific resources
 * Ensures users can only access resources belonging to their tenant
 */
export const validateTenantAccess = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return next(new AppError('Resource not found', 404));
      }

      // Check if resource belongs to user's tenant
      if (resource.tenantId.toString() !== req.tenantId.toString()) {
        return next(new AppError('Access denied to this resource', 403));
      }

      // Attach resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

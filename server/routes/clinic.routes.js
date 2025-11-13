import express from 'express';
import {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
  updateApiKeys,
  getClinicSettings,
} from '../controllers/clinicController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all clinics (admin only)
router.get('/', authorize('admin'), getAllClinics);

// Create clinic (admin only)
router.post('/', authorize('admin'), createClinic);

// Get clinic by ID
router.get('/:id', getClinicById);

// Update clinic
router.put('/:id', authorize('admin', 'clinic_staff'), updateClinic);

// Delete clinic (soft delete)
router.delete('/:id', authorize('admin'), deleteClinic);

// Update API keys
router.put('/:id/api-keys', authorize('admin'), updateApiKeys);

// Get clinic settings
router.get('/:id/settings', getClinicSettings);

export default router;

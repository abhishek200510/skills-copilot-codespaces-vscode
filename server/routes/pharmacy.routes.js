import express from 'express';
import {
  getAllPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  searchNearbyPharmacies,
} from '../controllers/pharmacyController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tenantMiddleware);

// Search nearby pharmacies
router.get('/nearby', searchNearbyPharmacies);

// Get all pharmacies
router.get('/', getAllPharmacies);

// Create pharmacy
router.post('/', authorize('admin', 'pharmacy_staff'), createPharmacy);

// Get pharmacy by ID
router.get('/:id', getPharmacyById);

// Update pharmacy
router.put('/:id', authorize('admin', 'pharmacy_staff'), updatePharmacy);

// Delete pharmacy (soft delete)
router.delete('/:id', authorize('admin'), deletePharmacy);

export default router;

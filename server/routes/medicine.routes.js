import express from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateStock,
  getLowStockMedicines,
  getExpiredMedicines,
} from '../controllers/medicineController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tenantMiddleware);

// Get low stock medicines
router.get('/low-stock', authorize('admin', 'pharmacy_staff'), getLowStockMedicines);

// Get expired medicines
router.get('/expired', authorize('admin', 'pharmacy_staff'), getExpiredMedicines);

// Get all medicines
router.get('/', getAllMedicines);

// Create medicine
router.post('/', authorize('admin', 'pharmacy_staff'), createMedicine);

// Get medicine by ID
router.get('/:id', getMedicineById);

// Update medicine
router.put('/:id', authorize('admin', 'pharmacy_staff'), updateMedicine);

// Update stock
router.patch('/:id/stock', authorize('admin', 'pharmacy_staff'), updateStock);

// Delete medicine (soft delete)
router.delete('/:id', authorize('admin', 'pharmacy_staff'), deleteMedicine);

export default router;

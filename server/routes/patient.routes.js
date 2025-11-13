import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments,
} from '../controllers/patientController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tenantMiddleware);

// Get all patients
router.get('/', authorize('admin', 'clinic_staff'), getAllPatients);

// Create patient
router.post('/', authorize('admin', 'clinic_staff'), createPatient);

// Get patient by ID
router.get('/:id', getPatientById);

// Update patient
router.put('/:id', authorize('admin', 'clinic_staff'), updatePatient);

// Delete patient (soft delete)
router.delete('/:id', authorize('admin'), deletePatient);

// Get patient appointments
router.get('/:id/appointments', getPatientAppointments);

export default router;

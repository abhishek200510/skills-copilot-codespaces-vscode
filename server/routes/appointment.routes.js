import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
  generateConfirmationPDF,
} from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get available slots (public for logged-in users)
router.get('/slots', getAvailableSlots);

// Apply tenant middleware after authentication
router.use(tenantMiddleware);

// Get all appointments
router.get('/', getAllAppointments);

// Create appointment
router.post('/', createAppointment);

// Get appointment by ID
router.get('/:id', getAppointmentById);

// Update appointment
router.put('/:id', authorize('admin', 'clinic_staff'), updateAppointment);

// Cancel appointment
router.delete('/:id', cancelAppointment);

// Generate PDF confirmation
router.post('/:id/pdf', generateConfirmationPDF);

export default router;

import express from 'express';
import {
  sendWhatsAppMessage,
  sendEmail,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayConfig,
  createRefund,
  sendInstagramDM,
} from '../controllers/integrationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// WhatsApp integration
router.post('/whatsapp/send', authorize('admin', 'clinic_staff'), sendWhatsAppMessage);

// Email integration
router.post('/email/send', authorize('admin', 'clinic_staff'), sendEmail);

// Instagram integration (placeholder)
router.post('/instagram/send', authorize('admin', 'clinic_staff'), sendInstagramDM);

// Razorpay integration
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.get('/razorpay/config', getRazorpayConfig);
router.post('/razorpay/refund', authorize('admin', 'clinic_staff'), createRefund);

export default router;

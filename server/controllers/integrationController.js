import razorpayService from '../services/razorpayService.js';
import whatsappService from '../services/whatsappService.js';
import emailService from '../services/emailService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Send WhatsApp message
 */
export const sendWhatsAppMessage = async (req, res, next) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return next(new AppError('Phone number and message are required', 400));
    }

    const result = await whatsappService.sendMessage(to, message);

    res.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send email
 */
export const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject) {
      return next(new AppError('Recipient email and subject are required', 400));
    }

    const result = await emailService.sendEmail({ to, subject, text, html });

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    if (!amount) {
      return next(new AppError('Amount is required', 400));
    }

    const order = await razorpayService.createOrder(amount, currency, receipt, notes);

    res.json({
      success: true,
      message: 'Razorpay order created successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return next(new AppError('Order ID, payment ID, and signature are required', 400));
    }

    const isValid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return next(new AppError('Invalid payment signature', 400));
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { isValid },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Razorpay configuration
 */
export const getRazorpayConfig = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create refund
 */
export const createRefund = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return next(new AppError('Payment ID is required', 400));
    }

    const refund = await razorpayService.createRefund(paymentId, amount);

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: { refund },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test Instagram DM (placeholder)
 */
export const sendInstagramDM = async (req, res, next) => {
  try {
    // This is a placeholder for Instagram DM integration
    // Actual implementation would depend on Instagram's Business API

    res.json({
      success: true,
      message: 'Instagram DM feature is not yet implemented',
      data: {
        note: 'This endpoint is a placeholder for future Instagram DM integration',
      },
    });
  } catch (error) {
    next(error);
  }
};

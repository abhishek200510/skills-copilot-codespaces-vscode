import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create Razorpay order
   */
  async createOrder(amount, currency = 'INR', receipt, notes = {}) {
    try {
      const options = {
        amount: amount * 100, // Amount in smallest currency unit (paise)
        currency,
        receipt,
        notes,
      };

      const order = await this.instance.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  /**
   * Fetch payment details
   */
  async fetchPayment(paymentId) {
    try {
      const payment = await this.instance.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Capture payment
   */
  async capturePayment(paymentId, amount, currency = 'INR') {
    try {
      const payment = await this.instance.payments.capture(
        paymentId,
        amount * 100,
        currency
      );
      return payment;
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw error;
    }
  }

  /**
   * Create refund
   */
  async createRefund(paymentId, amount = null) {
    try {
      const refundData = {
        payment_id: paymentId,
      };

      if (amount) {
        refundData.amount = amount * 100; // Partial refund
      }

      const refund = await this.instance.payments.refund(paymentId, refundData);
      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Fetch refund details
   */
  async fetchRefund(paymentId, refundId) {
    try {
      const refund = await this.instance.payments.fetchRefund(paymentId, refundId);
      return refund;
    } catch (error) {
      console.error('Error fetching refund:', error);
      throw error;
    }
  }
}

export default new RazorpayService();

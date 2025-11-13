import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking', 'wallet'],
    },
    razorpayData: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDate: Date,
    refundData: {
      refundId: String,
      refundAmount: Number,
      refundDate: Date,
      reason: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ tenantId: 1, status: 1 });
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: [true, 'Clinic ID is required'],
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
      index: true,
    },
    slot: {
      startTime: {
        type: String,
        required: [true, 'Start time is required'],
      },
      endTime: {
        type: String,
        required: [true, 'End time is required'],
      },
    },
    reason: {
      type: String,
      trim: true,
    },
    symptoms: [String],
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    payment: {
      amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending',
      },
      paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'insurance'],
      },
      transactionId: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      paidAt: Date,
    },
    notifications: {
      sms: {
        sent: Boolean,
        sentAt: Date,
      },
      email: {
        sent: Boolean,
        sentAt: Date,
      },
      whatsapp: {
        sent: Boolean,
        sentAt: Date,
      },
    },
    confirmationPdf: {
      url: String,
      generatedAt: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancellationReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
appointmentSchema.index({ tenantId: 1, clinicId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

// Compound index for checking slot availability
appointmentSchema.index({
  clinicId: 1,
  appointmentDate: 1,
  'slot.startTime': 1,
  status: 1,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

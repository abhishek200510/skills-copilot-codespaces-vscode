import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
    settings: {
      workingHours: {
        monday: { open: String, close: String, isOpen: Boolean },
        tuesday: { open: String, close: String, isOpen: Boolean },
        wednesday: { open: String, close: String, isOpen: Boolean },
        thursday: { open: String, close: String, isOpen: Boolean },
        friday: { open: String, close: String, isOpen: Boolean },
        saturday: { open: String, close: String, isOpen: Boolean },
        sunday: { open: String, close: String, isOpen: Boolean },
      },
      appointmentDuration: {
        type: Number,
        default: 30, // minutes
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
    },
    apiKeys: {
      whatsapp: {
        encrypted: String,
        isActive: Boolean,
      },
      instagram: {
        encrypted: String,
        isActive: Boolean,
      },
      razorpay: {
        keyId: String,
        keySecret: { type: String, select: false }, // Encrypted
        isActive: Boolean,
      },
      googleMaps: {
        encrypted: String,
        isActive: Boolean,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['trial', 'basic', 'premium', 'enterprise'],
        default: 'trial',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
      },
      startDate: Date,
      endDate: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
clinicSchema.index({ tenantId: 1, isActive: 1 });
clinicSchema.index({ email: 1 });

const Clinic = mongoose.model('Clinic', clinicSchema);

export default Clinic;

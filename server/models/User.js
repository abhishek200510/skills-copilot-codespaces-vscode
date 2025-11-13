import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'clinic_staff', 'patient', 'pharmacy_staff'],
      required: [true, 'Role is required'],
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
    },
    profileImage: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ email: 1 });
userSchema.index({ clinicId: 1 });
userSchema.index({ pharmacyId: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;

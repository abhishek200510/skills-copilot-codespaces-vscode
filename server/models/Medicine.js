import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: [true, 'Pharmacy ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'antibiotic',
        'painkiller',
        'vitamin',
        'antacid',
        'antihistamine',
        'cardiovascular',
        'diabetes',
        'respiratory',
        'dermatology',
        'other',
      ],
      required: [true, 'Category is required'],
    },
    form: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'other'],
      required: [true, 'Medicine form is required'],
    },
    strength: {
      value: Number,
      unit: {
        type: String,
        enum: ['mg', 'ml', 'g', 'mcg', '%'],
      },
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      mrp: {
        type: Number,
        required: [true, 'MRP is required'],
      },
      selling: {
        type: Number,
        required: [true, 'Selling price is required'],
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
    stock: {
      quantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
      },
      unit: {
        type: String,
        enum: ['pieces', 'strips', 'bottles', 'boxes'],
        default: 'pieces',
      },
      reorderLevel: {
        type: Number,
        default: 10,
      },
      expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
      },
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    batchNumber: {
      type: String,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
medicineSchema.index({ tenantId: 1, pharmacyId: 1, isActive: 1 });
medicineSchema.index({ name: 1, pharmacyId: 1 });
medicineSchema.index({ category: 1, pharmacyId: 1 });
medicineSchema.index({ 'stock.quantity': 1 });

// Virtual for low stock status
medicineSchema.virtual('isLowStock').get(function () {
  return this.stock.quantity <= this.stock.reorderLevel;
});

// Virtual for expired status
medicineSchema.virtual('isExpired').get(function () {
  return this.stock.expiryDate < new Date();
});

// Ensure virtuals are included
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;

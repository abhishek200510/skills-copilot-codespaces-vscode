import Medicine from '../models/Medicine.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTenantFilter } from '../middleware/tenant.js';

/**
 * Get all medicines
 */
export const getAllMedicines = async (req, res, next) => {
  try {
    const filter = getTenantFilter(req, { isActive: true });
    const { pharmacyId, category, name, lowStock } = req.query;

    if (pharmacyId) filter.pharmacyId = pharmacyId;
    if (category) filter.category = category;
    if (name) filter.name = new RegExp(name, 'i');

    let medicines = await Medicine.find(filter).populate('pharmacyId', 'name address phone');

    // Filter for low stock if requested
    if (lowStock === 'true') {
      medicines = medicines.filter((medicine) => medicine.isLowStock);
    }

    res.json({
      success: true,
      count: medicines.length,
      data: { medicines },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get medicine by ID
 */
export const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      'pharmacyId',
      'name address phone'
    );

    if (!medicine) {
      return next(new AppError('Medicine not found', 404));
    }

    res.json({
      success: true,
      data: { medicine },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create medicine
 */
export const createMedicine = async (req, res, next) => {
  try {
    const medicineData = {
      ...req.body,
      tenantId: req.tenantId,
    };

    const medicine = new Medicine(medicineData);
    await medicine.save();

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      data: { medicine },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update medicine
 */
export const updateMedicine = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name',
      'genericName',
      'manufacturer',
      'category',
      'form',
      'strength',
      'description',
      'price',
      'stock',
      'prescriptionRequired',
      'batchNumber',
      'barcode',
      'tags',
    ];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      return next(new AppError('Medicine not found', 404));
    }

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: { medicine },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete medicine (soft delete)
 */
export const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!medicine) {
      return next(new AppError('Medicine not found', 404));
    }

    res.json({
      success: true,
      message: 'Medicine deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update medicine stock
 */
export const updateStock = async (req, res, next) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return next(new AppError('Medicine not found', 404));
    }

    if (operation === 'add') {
      medicine.stock.quantity += quantity;
    } else if (operation === 'subtract') {
      if (medicine.stock.quantity < quantity) {
        return next(new AppError('Insufficient stock', 400));
      }
      medicine.stock.quantity -= quantity;
    } else {
      return next(new AppError('Invalid operation. Use "add" or "subtract"', 400));
    }

    await medicine.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { medicine },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get low stock medicines
 */
export const getLowStockMedicines = async (req, res, next) => {
  try {
    const { pharmacyId } = req.query;
    const filter = getTenantFilter(req, { isActive: true });

    if (pharmacyId) {
      filter.pharmacyId = pharmacyId;
    }

    const medicines = await Medicine.find(filter).populate('pharmacyId', 'name');

    // Filter medicines where stock is at or below reorder level
    const lowStockMedicines = medicines.filter(
      (medicine) => medicine.stock.quantity <= medicine.stock.reorderLevel
    );

    res.json({
      success: true,
      count: lowStockMedicines.length,
      data: { medicines: lowStockMedicines },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expired medicines
 */
export const getExpiredMedicines = async (req, res, next) => {
  try {
    const { pharmacyId } = req.query;
    const filter = getTenantFilter(req, {
      isActive: true,
      'stock.expiryDate': { $lt: new Date() },
    });

    if (pharmacyId) {
      filter.pharmacyId = pharmacyId;
    }

    const medicines = await Medicine.find(filter).populate('pharmacyId', 'name');

    res.json({
      success: true,
      count: medicines.length,
      data: { medicines },
    });
  } catch (error) {
    next(error);
  }
};

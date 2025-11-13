import Clinic from '../models/Clinic.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTenantFilter } from '../middleware/tenant.js';
import { encrypt, decrypt } from '../utils/encryption.js';

/**
 * Get all clinics (admin only)
 */
export const getAllClinics = async (req, res, next) => {
  try {
    const clinics = await Clinic.find({ isActive: true });

    res.json({
      success: true,
      count: clinics.length,
      data: { clinics },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get clinic by ID
 */
export const getClinicById = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    res.json({
      success: true,
      data: { clinic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new clinic
 */
export const createClinic = async (req, res, next) => {
  try {
    const clinicData = {
      ...req.body,
      tenantId: new Date().getTime().toString(), // Temporary
    };

    const clinic = new Clinic(clinicData);
    await clinic.save();

    // Set tenantId to clinic's own ID for self-contained tenant
    clinic.tenantId = clinic._id;
    await clinic.save();

    res.status(201).json({
      success: true,
      message: 'Clinic created successfully',
      data: { clinic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update clinic
 */
export const updateClinic = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'email', 'phone', 'address', 'settings', 'location'];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const clinic = await Clinic.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    res.json({
      success: true,
      message: 'Clinic updated successfully',
      data: { clinic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete clinic (soft delete)
 */
export const deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    res.json({
      success: true,
      message: 'Clinic deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update clinic API keys
 */
export const updateApiKeys = async (req, res, next) => {
  try {
    const { whatsappKey, instagramKey, razorpayKeyId, razorpayKeySecret, googleMapsKey } =
      req.body;

    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    // Encrypt and update API keys
    if (whatsappKey) {
      clinic.apiKeys.whatsapp = {
        encrypted: encrypt(whatsappKey),
        isActive: true,
      };
    }

    if (instagramKey) {
      clinic.apiKeys.instagram = {
        encrypted: encrypt(instagramKey),
        isActive: true,
      };
    }

    if (razorpayKeyId && razorpayKeySecret) {
      clinic.apiKeys.razorpay = {
        keyId: razorpayKeyId,
        keySecret: encrypt(razorpayKeySecret),
        isActive: true,
      };
    }

    if (googleMapsKey) {
      clinic.apiKeys.googleMaps = {
        encrypted: encrypt(googleMapsKey),
        isActive: true,
      };
    }

    await clinic.save();

    res.json({
      success: true,
      message: 'API keys updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get clinic settings
 */
export const getClinicSettings = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    res.json({
      success: true,
      data: {
        settings: clinic.settings,
        subscription: clinic.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

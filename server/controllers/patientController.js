import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTenantFilter } from '../middleware/tenant.js';

/**
 * Get all patients
 */
export const getAllPatients = async (req, res, next) => {
  try {
    const filter = getTenantFilter(req, { role: 'patient', isActive: true });

    const patients = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: { patients },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient by ID
 */
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: 'patient',
    }).select('-password -refreshToken');

    if (!patient) {
      return next(new AppError('Patient not found', 404));
    }

    res.json({
      success: true,
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create patient record
 */
export const createPatient = async (req, res, next) => {
  try {
    const patientData = {
      ...req.body,
      role: 'patient',
      tenantId: req.tenantId,
    };

    const patient = new User(patientData);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient
 */
export const updatePatient = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'address',
      'dateOfBirth',
      'gender',
      'emergencyContact',
    ];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'patient' },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -refreshToken');

    if (!patient) {
      return next(new AppError('Patient not found', 404));
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete patient (soft delete)
 */
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'patient' },
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return next(new AppError('Patient not found', 404));
    }

    res.json({
      success: true,
      message: 'Patient deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient appointments
 */
export const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.id,
      tenantId: req.tenantId,
    })
      .populate('clinicId', 'name address phone')
      .populate('doctorId', 'firstName lastName')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: { appointments },
    });
  } catch (error) {
    next(error);
  }
};

import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTenantFilter } from '../middleware/tenant.js';
import emailService from '../services/emailService.js';
import whatsappService from '../services/whatsappService.js';
import pdfService from '../services/pdfService.js';

/**
 * Get all appointments
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const filter = getTenantFilter(req);
    const { status, clinicId, patientId, date } = req.query;

    if (status) filter.status = status;
    if (clinicId) filter.clinicId = clinicId;
    if (patientId) filter.patientId = patientId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName email phone')
      .populate('clinicId', 'name address phone')
      .populate('doctorId', 'firstName lastName')
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: { appointments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone')
      .populate('clinicId', 'name address phone email')
      .populate('doctorId', 'firstName lastName');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    res.json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create appointment
 */
export const createAppointment = async (req, res, next) => {
  try {
    const appointmentData = {
      ...req.body,
      tenantId: req.tenantId,
      patientId: req.body.patientId || req.user.id,
    };

    // Check for slot availability
    const existingAppointment = await Appointment.findOne({
      clinicId: appointmentData.clinicId,
      appointmentDate: appointmentData.appointmentDate,
      'slot.startTime': appointmentData.slot.startTime,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (existingAppointment) {
      return next(new AppError('This slot is already booked', 400));
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate for notifications
    await appointment.populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      { path: 'clinicId', select: 'name address phone email' },
    ]);

    // Send notifications
    try {
      await Promise.allSettled([
        emailService.sendAppointmentConfirmation(
          appointment,
          appointment.patientId,
          appointment.clinicId
        ),
        whatsappService.sendAppointmentConfirmation(
          appointment,
          appointment.patientId,
          appointment.clinicId
        ),
      ]);
    } catch (error) {
      console.error('Error sending notifications:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment
 */
export const updateAppointment = async (req, res, next) => {
  try {
    const allowedUpdates = ['appointmentDate', 'slot', 'doctorId', 'status', 'notes'];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      { path: 'clinicId', select: 'name address phone email' },
    ]);

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancelledBy: req.user.id,
        cancellationReason: req.body.reason,
        cancelledAt: new Date(),
      },
      { new: true }
    ).populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      { path: 'clinicId', select: 'name address phone email' },
    ]);

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    // Send cancellation notification
    try {
      await whatsappService.sendCancellationNotification(
        appointment,
        appointment.patientId,
        appointment.clinicId
      );
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available slots
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { clinicId, date } = req.query;

    if (!clinicId || !date) {
      return next(new AppError('Clinic ID and date are required', 400));
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return next(new AppError('Clinic not found', 404));
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleLowerCase('en-US', { weekday: 'long' });

    const workingHours = clinic.settings.workingHours[dayName];
    if (!workingHours || !workingHours.isOpen) {
      return res.json({
        success: true,
        data: { slots: [] },
        message: 'Clinic is closed on this day',
      });
    }

    // Generate time slots based on appointment duration
    const slots = [];
    const duration = clinic.settings.appointmentDuration || 30;
    let currentTime = workingHours.open;

    while (currentTime < workingHours.close) {
      const [hours, minutes] = currentTime.split(':');
      const nextMinutes = parseInt(minutes) + duration;
      const nextHours = parseInt(hours) + Math.floor(nextMinutes / 60);
      const endTime = `${String(nextHours).padStart(2, '0')}:${String(nextMinutes % 60).padStart(2, '0')}`;

      slots.push({
        startTime: currentTime,
        endTime: endTime,
      });

      currentTime = endTime;
    }

    // Check which slots are already booked
    const bookedSlots = await Appointment.find({
      clinicId,
      appointmentDate: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
      status: { $nin: ['cancelled', 'no-show'] },
    }).select('slot');

    const bookedTimes = bookedSlots.map((apt) => apt.slot.startTime);
    const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot.startTime));

    res.json({
      success: true,
      data: { slots: availableSlots },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate appointment confirmation PDF
 */
export const generateConfirmationPDF = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone')
      .populate('clinicId', 'name address phone email');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    const { filepath, filename } = await pdfService.generateAppointmentConfirmation(
      appointment,
      appointment.patientId,
      appointment.clinicId
    );

    appointment.confirmationPdf = {
      url: `/uploads/pdfs/${filename}`,
      generatedAt: new Date(),
    };
    await appointment.save();

    res.json({
      success: true,
      message: 'PDF generated successfully',
      data: {
        pdfUrl: appointment.confirmationPdf.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

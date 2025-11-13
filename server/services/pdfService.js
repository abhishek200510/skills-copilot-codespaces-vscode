import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  /**
   * Generate appointment confirmation PDF
   */
  async generateAppointmentConfirmation(appointment, user, clinic) {
    return new Promise((resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../../uploads/pdfs');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate filename
        const filename = `appointment-${appointment._id}-${Date.now()}.pdf`;
        const filepath = path.join(uploadsDir, filename);

        // Pipe PDF to file
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Add content
        // Header
        doc.fontSize(20).text('Appointment Confirmation', { align: 'center' });
        doc.moveDown();

        // Clinic Information
        doc.fontSize(14).text('Clinic Information', { underline: true });
        doc.fontSize(12);
        doc.text(`Name: ${clinic.name}`);
        doc.text(`Address: ${clinic.address.street}, ${clinic.address.city}`);
        doc.text(`Phone: ${clinic.phone}`);
        doc.text(`Email: ${clinic.email}`);
        doc.moveDown();

        // Patient Information
        doc.fontSize(14).text('Patient Information', { underline: true });
        doc.fontSize(12);
        doc.text(`Name: ${user.firstName} ${user.lastName}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone}`);
        doc.moveDown();

        // Appointment Details
        doc.fontSize(14).text('Appointment Details', { underline: true });
        doc.fontSize(12);
        doc.text(`Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}`);
        doc.text(`Time: ${appointment.slot.startTime} - ${appointment.slot.endTime}`);
        doc.text(`Status: ${appointment.status}`);
        if (appointment.reason) {
          doc.text(`Reason: ${appointment.reason}`);
        }
        doc.moveDown();

        // Payment Information
        if (appointment.payment) {
          doc.fontSize(14).text('Payment Information', { underline: true });
          doc.fontSize(12);
          doc.text(`Amount: ₹${appointment.payment.amount}`);
          doc.text(`Status: ${appointment.payment.status}`);
          if (appointment.payment.paymentMethod) {
            doc.text(`Method: ${appointment.payment.paymentMethod}`);
          }
          doc.moveDown();
        }

        // Footer
        doc.fontSize(10).text(
          'Please arrive 10 minutes before your scheduled appointment time.',
          { align: 'center', color: 'gray' }
        );
        doc.text(
          `Generated on: ${new Date().toLocaleString()}`,
          { align: 'center', color: 'gray' }
        );

        // Finalize PDF
        doc.end();

        stream.on('finish', () => {
          resolve({ filepath, filename });
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate prescription PDF
   */
  async generatePrescription(prescription, patient, doctor) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });

        const uploadsDir = path.join(__dirname, '../../uploads/pdfs');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `prescription-${prescription._id}-${Date.now()}.pdf`;
        const filepath = path.join(uploadsDir, filename);

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('Medical Prescription', { align: 'center' });
        doc.moveDown();

        // Doctor Information
        doc.fontSize(14).text('Doctor Information', { underline: true });
        doc.fontSize(12);
        doc.text(`Name: Dr. ${doctor.firstName} ${doctor.lastName}`);
        doc.moveDown();

        // Patient Information
        doc.fontSize(14).text('Patient Information', { underline: true });
        doc.fontSize(12);
        doc.text(`Name: ${patient.firstName} ${patient.lastName}`);
        doc.text(`Age: ${patient.age || 'N/A'}`);
        doc.moveDown();

        // Prescription Details
        doc.fontSize(14).text('Prescription', { underline: true });
        doc.fontSize(12);
        // Add medicines and instructions here based on prescription data

        doc.moveDown();
        doc.fontSize(10).text(
          `Date: ${new Date().toLocaleDateString()}`,
          { align: 'right' }
        );

        doc.end();

        stream.on('finish', () => {
          resolve({ filepath, filename });
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new PDFService();

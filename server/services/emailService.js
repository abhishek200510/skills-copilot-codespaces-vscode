import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(appointment, user, clinic) {
    const subject = 'Appointment Confirmation';
    const html = `
      <h1>Appointment Confirmed</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li><strong>Clinic:</strong> ${clinic.name}</li>
        <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointment.slot.startTime} - ${appointment.slot.endTime}</li>
        <li><strong>Status:</strong> ${appointment.status}</li>
      </ul>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>Thank you for choosing ${clinic.name}!</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(appointment, user, clinic) {
    const subject = 'Appointment Reminder';
    const html = `
      <h1>Appointment Reminder</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Clinic:</strong> ${clinic.name}</li>
        <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointment.slot.startTime} - ${appointment.slot.endTime}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Our Platform';
    const html = `
      <h1>Welcome!</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>You can now start booking appointments and managing your healthcare needs.</p>
      <p>Best regards,<br>The Team</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

export default new EmailService();

import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER;
  }

  /**
   * Send WhatsApp message
   */
  async sendMessage(to, message) {
    try {
      // This is a placeholder implementation
      // Replace with actual WhatsApp Business API or Twilio WhatsApp API
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          to,
          from: this.phoneNumber,
          body: message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('WhatsApp message sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.message);
      throw error;
    }
  }

  /**
   * Send appointment confirmation via WhatsApp
   */
  async sendAppointmentConfirmation(appointment, user, clinic) {
    const message = `
*Appointment Confirmed* ✅

Dear ${user.firstName} ${user.lastName},

Your appointment has been confirmed:

🏥 *Clinic:* ${clinic.name}
📅 *Date:* ${new Date(appointment.appointmentDate).toLocaleDateString()}
⏰ *Time:* ${appointment.slot.startTime} - ${appointment.slot.endTime}
📝 *Status:* ${appointment.status}

Please arrive 10 minutes before your scheduled time.

Thank you for choosing ${clinic.name}!
    `.trim();

    return await this.sendMessage(user.phone, message);
  }

  /**
   * Send appointment reminder via WhatsApp
   */
  async sendAppointmentReminder(appointment, user, clinic) {
    const message = `
*Appointment Reminder* 🔔

Dear ${user.firstName},

Reminder for your upcoming appointment:

🏥 *Clinic:* ${clinic.name}
📅 *Date:* ${new Date(appointment.appointmentDate).toLocaleDateString()}
⏰ *Time:* ${appointment.slot.startTime} - ${appointment.slot.endTime}

We look forward to seeing you!
    `.trim();

    return await this.sendMessage(user.phone, message);
  }

  /**
   * Send cancellation notification via WhatsApp
   */
  async sendCancellationNotification(appointment, user, clinic) {
    const message = `
*Appointment Cancelled* ❌

Dear ${user.firstName},

Your appointment has been cancelled:

🏥 *Clinic:* ${clinic.name}
📅 *Date:* ${new Date(appointment.appointmentDate).toLocaleDateString()}
⏰ *Time:* ${appointment.slot.startTime}

If you'd like to reschedule, please contact us.
    `.trim();

    return await this.sendMessage(user.phone, message);
  }
}

export default new WhatsAppService();

export type NotificationPayload = {
  to: string;
  subject: string;
  body: string;
};

export interface NotificationProvider {
  sendEmail(payload: NotificationPayload): Promise<void>;
}

export class ConsoleNotificationProvider implements NotificationProvider {
  async sendEmail(payload: NotificationPayload): Promise<void> {
    // Replace with SMTP/Nodemailer adapter in production wiring.
    console.log("[notification:email]", payload);
  }
}

export const notificationProvider: NotificationProvider = new ConsoleNotificationProvider();

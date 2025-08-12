import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
  }
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface AgreementEmailData {
  recipientName: string;
  agreementType: string;
  agreementNumber: string;
  effectiveDate: string;
  expirationDate: string;
}

/**
 * Send a general email using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: options.from || process.env.GMAIL_USER,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send airport agreement completion notification
 */
export async function sendAgreementNotification(
  recipientEmail: string,
  agreementData: AgreementEmailData,
  pdfBuffer?: Buffer
) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Airport License Agreement - ${agreementData.agreementType}</h2>
      
      <p>Dear ${agreementData.recipientName},</p>
      
      <p>Your airport license agreement has been processed and is ready for review.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Agreement Details:</h3>
        <ul style="margin: 0;">
          <li><strong>Agreement Type:</strong> ${agreementData.agreementType}</li>
          <li><strong>Agreement Number:</strong> ${agreementData.agreementNumber}</li>
          <li><strong>Effective Date:</strong> ${agreementData.effectiveDate}</li>
          <li><strong>Expiration Date:</strong> ${agreementData.expirationDate}</li>
        </ul>
      </div>
      
      <p>Please review the attached agreement document. If you have any questions, please contact our office.</p>
      
      <p>Best regards,<br>
      <strong>AirSpace Integration Team</strong></p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="font-size: 12px; color: #6b7280;">
        This email was sent from the CA-66 Airport License Agreement System.
      </p>
    </div>
  `;

  const attachments = pdfBuffer ? [{
    filename: `${agreementData.agreementType}_Agreement_${agreementData.agreementNumber}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  }] : undefined;

  return await sendEmail({
    to: recipientEmail,
    subject: `Airport License Agreement Ready - ${agreementData.agreementNumber}`,
    html: emailHtml,
    attachments
  });
}

/**
 * Send agreement renewal reminder
 */
export async function sendRenewalReminder(
  recipientEmail: string,
  agreementData: AgreementEmailData
) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Agreement Renewal Reminder</h2>
      
      <p>Dear ${agreementData.recipientName},</p>
      
      <p>This is a reminder that your airport license agreement is approaching its expiration date.</p>
      
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Expiring Agreement:</h3>
        <ul style="margin: 0;">
          <li><strong>Agreement Number:</strong> ${agreementData.agreementNumber}</li>
          <li><strong>Expiration Date:</strong> ${agreementData.expirationDate}</li>
        </ul>
      </div>
      
      <p>Please contact our office to begin the renewal process before the expiration date.</p>
      
      <p>Best regards,<br>
      <strong>AirSpace Integration Team</strong></p>
    </div>
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: `Agreement Renewal Required - ${agreementData.agreementNumber}`,
    html: emailHtml
  });
}

export default {
  sendEmail,
  sendAgreementNotification,
  sendRenewalReminder
};

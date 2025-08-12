import { Resend } from 'resend';

// Instantiate the Resend client with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using the Resend service.
 * The core logic will be implemented in Story 1.2.
 */
export const sendAgreementEmail = async (recipientEmail: string, agreementText: string) => {
  console.log(`Preparing to send email to ${recipientEmail}...`);
  // The actual resend.emails.send() call will be added in the next story.
  // For now, this setup confirms our configuration is correct.
};*sm
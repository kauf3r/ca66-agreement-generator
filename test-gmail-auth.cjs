/**
 * Simple Gmail authentication test
 * Tests if the Gmail credentials are working
 */

const nodemailer = require('nodemailer');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testGmailAuth() {
  console.log('🔐 Testing Gmail SMTP Authentication...');
  
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  
  console.log(`Gmail User: ${gmailUser}`);
  console.log(`Password Length: ${gmailPassword ? gmailPassword.length : 0} characters`);
  
  if (!gmailUser || !gmailPassword) {
    console.error('❌ Gmail credentials not found in .env.local');
    return;
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });
  
  try {
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP authentication successful!');
    
    // Try sending a simple test email
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: `"AirSpace Integration Test" <${gmailUser}>`,
      to: 'andy+gmailtest@andykaufman.net',
      cc: 'kaufman@airspaceintegration.com',
      subject: 'Gmail Authentication Test',
      text: 'This is a test email to verify Gmail SMTP authentication is working.',
      html: `
        <h2>Gmail Authentication Test</h2>
        <p>This email confirms that Gmail SMTP authentication is working properly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${gmailUser}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${result.messageId}`);
    
  } catch (error) {
    console.error('❌ Gmail authentication failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication Error - Check your app password:');
      console.error('1. Go to Google Account settings');
      console.error('2. Security → 2-Step Verification → App passwords');
      console.error('3. Generate a new app password for "Mail"');
      console.error('4. Update GMAIL_APP_PASSWORD in .env.local');
    }
  }
}

testGmailAuth();
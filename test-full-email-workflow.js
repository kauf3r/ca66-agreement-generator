/**
 * Test script for full email workflow with PDF attachment
 * This simulates the complete process: PDF generation + email sending
 */

import { PDFGenerator } from './assets/js/pdf-generator.js';
import { EmailClient } from './assets/js/email-client.js';

// Sample form data for testing
const testFormData = {
  'licensee-name': 'PDF Test Pilot',
  'email': 'andy+pdftest@andykaufman.net',
  'phone': '(415) 555-0123',
  'aircraft-registration': 'N12345',
  'aircraft-make-model': 'Cessna 182',
  'insurance-company': 'Test Insurance Co',
  'policy-number': 'TEST123456',
  'coverage-amount': 1000000,
  'start-date': '2025-08-15',
  'end-date': '2026-08-15',
  'policy-expiry': '2026-02-15',
  'insurance-address': '123 Test St',
  'insurance-city': 'Test City',
  'insurance-state': 'CA',
  'insurance-zip': '95000',
  'insurance-phone': '(800) 555-0000',
  'insured-name': 'PDF Test Pilot'
};

async function testFullWorkflow() {
  console.log('🧪 Starting full email workflow test...');
  
  try {
    // Step 1: Generate PDF
    console.log('📄 Step 1: Generating PDF...');
    const pdfBytes = await PDFGenerator.generateAgreementPDF(testFormData);
    console.log(`✅ PDF generated successfully: ${pdfBytes.length} bytes`);
    
    // Step 2: Prepare email data
    console.log('📧 Step 2: Preparing email data...');
    const emailData = {
      recipientEmail: testFormData['email'],
      recipientName: testFormData['licensee-name'],
      agreementData: {
        licensee: testFormData['licensee-name'],
        aircraft: `${testFormData['aircraft-registration']} - ${testFormData['aircraft-make-model']}`,
        startDate: testFormData['start-date'],
        endDate: testFormData['end-date'],
        insuranceCompany: testFormData['insurance-company'],
        policyNumber: testFormData['policy-number'],
        coverageAmount: testFormData['coverage-amount']
      },
      pdfBuffer: pdfBytes,
      includeAttachment: true
    };
    
    // Step 3: Send email with PDF attachment
    console.log('📨 Step 3: Sending email with PDF attachment...');
    const emailClient = new EmailClient();
    const result = await emailClient.sendAgreementEmail(emailData);
    
    if (result.success) {
      console.log('🎉 SUCCESS! Email sent with PDF attachment');
      console.log(`Message ID: ${result.messageId}`);
      console.log(`Recipient: ${emailData.recipientEmail}`);
      console.log(`PDF Size: ${pdfBytes.length} bytes`);
      console.log('✅ CC sent to: kaufman@airspaceintegration.com');
    } else {
      console.error('❌ Email sending failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Check if we can access the PDF library
if (typeof window !== 'undefined' && window.PDFLib) {
  console.log('✅ PDF-lib library available');
  testFullWorkflow();
} else {
  console.log('⚠️  PDF-lib not available - run this in a browser with the library loaded');
}

export { testFullWorkflow };
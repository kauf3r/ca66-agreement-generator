// Document Generation & Agreement Preview System - Phase 3 Implementation
import { AgreementTemplate } from './template.js';
import { EmailClient } from './email-client.js';
import { emailModalInstance } from './email-modal.js';
import { PDFGenerator } from './pdf-generator.js';

export const DocumentGenerator = {
  // Current agreement data cache
  currentAgreement: null,
  
  // Email client instance
  emailClient: new EmailClient(),
  
  // Generate complete legal agreement from validated form data
  generate: (formData) => {
    try {
      console.log('🔄 Starting agreement generation...', formData);
      
      // Validate that we have the minimum required data
      if (!DocumentGenerator.validateRequiredData(formData)) {
        throw new Error('Missing required form data for agreement generation');
      }
      
      // Generate the agreement using our template system
      const agreementHtml = AgreementTemplate.generate(formData);
      
      // Cache the generated agreement
      DocumentGenerator.currentAgreement = {
        html: agreementHtml,
        data: formData,
        generatedAt: new Date(),
        version: formData.version || '1.0'
      };
      
      console.log('✅ Agreement generated successfully');
      return agreementHtml;
      
    } catch (error) {
      console.error('❌ Agreement generation failed:', error);
      throw new Error(`Agreement generation failed: ${error.message}`);
    }
  },
  
  // Validate that we have minimum required data for agreement generation
  validateRequiredData: (formData) => {
    const requiredFields = [
      'licenseeName', 'phone', 'email', 'flightHoursConfirmed',
      'aircraftRegistration', 'aircraftMakeModel',
      'insuranceCompany', 'policyNumber', 'coverageAmount'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === '') {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // Validate business rules
    if (!formData.flightHoursConfirmed) {
      console.error('300+ flight hours not confirmed');
      return false;
    }
    
    if (formData.coverageAmount < 1000000) {
      console.error('Insurance coverage below minimum requirement');
      return false;
    }
    
    return true;
  },
  
  // Display agreement in preview modal
  preview: (html) => {
    try {
      console.log('📋 Displaying agreement preview...');
      
      // Get preview elements
      const previewSection = document.getElementById('agreement-preview');
      const contentDiv = document.getElementById('agreement-content');
      
      if (!previewSection || !contentDiv) {
        throw new Error('Preview elements not found in DOM');
      }
      
      // Insert the generated agreement
      contentDiv.innerHTML = html;
      
      // Show the preview section
      previewSection.hidden = false;
      previewSection.setAttribute('aria-live', 'polite');
      
      // Add print-ready class for styling
      contentDiv.classList.add('agreement-preview-content');
      
      // Smooth scroll to preview
      previewSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Update page title to indicate preview mode
      document.title = 'CA-66 Agreement Preview - Ready for Print';
      
      console.log('✅ Agreement preview displayed successfully');
      
    } catch (error) {
      console.error('❌ Failed to display preview:', error);
      DocumentGenerator.showPreviewError(error.message);
    }
  },
  
  // Show preview error message
  showPreviewError: (errorMessage) => {
    const previewSection = document.getElementById('agreement-preview');
    const contentDiv = document.getElementById('agreement-content');
    
    if (previewSection && contentDiv) {
      contentDiv.innerHTML = `
        <div class="preview-error">
          <h3>Preview Error</h3>
          <p>Unable to display agreement preview: ${errorMessage}</p>
          <button type="button" id="retry-preview" class="btn btn-primary">Try Again</button>
        </div>
      `;
      
      previewSection.hidden = false;
      previewSection.scrollIntoView({ behavior: 'smooth' });
      
      // Add retry functionality
      const retryButton = document.getElementById('retry-preview');
      if (retryButton) {
        retryButton.addEventListener('click', () => {
          previewSection.hidden = true;
          // Trigger form resubmission
          const form = document.getElementById('agreement-form');
          if (form) {
            form.dispatchEvent(new Event('submit'));
          }
        });
      }
    }
  },
  
  // Hide agreement preview and return to form
  hidePreview: () => {
    const previewSection = document.getElementById('agreement-preview');
    if (previewSection) {
      previewSection.hidden = true;
      
      // Reset page title
      document.title = 'CA-66 Airport Usage License Agreement';
      
      // Scroll back to form
      const form = document.getElementById('agreement-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      console.log('📝 Returned to form editing mode');
    }
  },
  
  // Print the agreement (optimized for legal documents)
  print: () => {
    try {
      console.log('🖨️ Preparing agreement for printing...');
      
      if (!DocumentGenerator.currentAgreement) {
        throw new Error('No agreement available to print');
      }
      
      const contentDiv = document.getElementById('agreement-content');
      if (!contentDiv) {
        throw new Error('Agreement content not found');
      }
      
      // Create a new window for printing only the agreement
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      // Get the print CSS
      const printStyles = `
        <style>
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              font-family: "Times New Roman", Times, serif !important;
              font-size: 11pt;
              line-height: 1.3;
              color: #000 !important;
              background: white !important;
            }
            
            @page {
              size: 8.5in 11in;
              margin: 1in 1in 1in 1.25in;
            }
            
            .agreement-document {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0;
              background: white;
              font-family: "Times New Roman", Times, serif;
            }
            
            .agreement-header {
              text-align: center;
              margin-bottom: 24pt;
              page-break-inside: avoid;
            }
            
            .agreement-header h1 {
              font-size: 16pt;
              font-weight: bold;
              margin: 0 0 8pt 0;
              text-transform: uppercase;
              letter-spacing: 1pt;
            }
            
            .agreement-header h2 {
              font-size: 14pt;
              font-weight: normal;
              margin: 0 0 12pt 0;
            }
            
            .agreement-body section {
              margin-bottom: 18pt;
              page-break-inside: avoid;
            }
            
            .agreement-body h3 {
              font-size: 12pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 18pt 0 10pt 0;
              text-align: center;
              border-bottom: 1pt solid #000;
              padding-bottom: 4pt;
            }
            
            .agreement-body p {
              margin: 6pt 0;
              text-align: justify;
              orphans: 3;
              widows: 3;
            }
            
            .party-block {
              margin: 12pt 0;
              padding: 8pt;
              border: 1pt solid #000;
              page-break-inside: avoid;
            }
            
            .signature-line .line {
              border-bottom: 1pt solid #000;
              width: 200pt;
              height: 24pt;
              margin: 0 auto 6pt auto;
            }
          }
        </style>
      `;
      
      // Write the agreement content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CA-66 Airport Usage License Agreement</title>
          <meta charset="utf-8">
          ${printStyles}
        </head>
        <body>
          ${contentDiv.innerHTML}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 250);
      };
      
      console.log('✅ Print dialog opened for agreement only');
      
    } catch (error) {
      console.error('❌ Print failed:', error);
      alert(`Unable to print agreement: ${error.message}`);
    }
  },
  
  // Generate and display agreement (main workflow function)
  generateAndPreview: (formData) => {
    try {
      // Show loading state
      DocumentGenerator.showLoadingState();
      
      // Generate the agreement
      const agreementHtml = DocumentGenerator.generate(formData);
      
      // Format for print optimization
      const printReadyHtml = AgreementTemplate.formatForPrint(agreementHtml);
      
      // Display in preview
      DocumentGenerator.preview(printReadyHtml);
      
      // Hide loading state
      DocumentGenerator.hideLoadingState();
      
      return true;
      
    } catch (error) {
      DocumentGenerator.hideLoadingState();
      console.error('❌ Generate and preview failed:', error);
      
      // Show error to user
      alert(`Failed to generate agreement: ${error.message}\n\nPlease check your form data and try again.`);
      
      return false;
    }
  },
  
  // Show loading state during generation
  showLoadingState: () => {
    const generatePdfButton = document.getElementById('generate-pdf');
    if (generatePdfButton) {
      generatePdfButton.textContent = 'Generating PDF...';
      generatePdfButton.disabled = true;
      generatePdfButton.classList.add('loading');
    }
    
    // Show progress indicator
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.style.opacity = '0.6';
    }
  },
  
  // Hide loading state after generation
  hideLoadingState: () => {
    const generatePdfButton = document.getElementById('generate-pdf');
    if (generatePdfButton) {
      generatePdfButton.textContent = 'Generate PDF Agreement';
      generatePdfButton.disabled = false;
      generatePdfButton.classList.remove('loading');
    }
    
    // Restore progress indicator
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.style.opacity = '1';
    }
  },
  
  // Get agreement metadata for debugging/logging
  getAgreementInfo: () => {
    if (!DocumentGenerator.currentAgreement) {
      return null;
    }
    
    return {
      generatedAt: DocumentGenerator.currentAgreement.generatedAt,
      version: DocumentGenerator.currentAgreement.version,
      dataFields: Object.keys(DocumentGenerator.currentAgreement.data).length,
      htmlSize: DocumentGenerator.currentAgreement.html.length
    };
  },
  
  // Send agreement via email
  sendEmail: async (emailOptions = {}) => {
    try {
      console.log('📧 Preparing to send agreement via email...');
      
      if (!DocumentGenerator.currentAgreement) {
        throw new Error('No agreement available to send');
      }
      
      const formData = DocumentGenerator.currentAgreement.data;
      
      // Use provided email address or fall back to form data
      const recipientEmail = emailOptions.email || formData.email;
      const recipientName = emailOptions.name || formData.licenseeName || 'Valued Pilot';
      
      if (!recipientEmail) {
        throw new Error('No email address available for sending');
      }
      
      // Prepare agreement data for email template
      const agreementData = {
        licensee: formData.licenseeName,
        aircraft: `${formData.aircraftRegistration} - ${formData.aircraftMakeModel}`,
        startDate: DocumentGenerator.formatDate(formData.startDate),
        endDate: DocumentGenerator.formatDate(formData.endDate),
        annualFee: '$250.00',
        insuranceCompany: formData.insuranceCompany,
        policyNumber: formData.policyNumber,
        coverageAmount: DocumentGenerator.formatCurrency(formData.coverageAmount)
      };
      
      // Generate PDF if requested
      let pdfBuffer = null;
      if (emailOptions.includePdf !== false) {
        try {
          console.log('📄 Generating PDF for email attachment...');
          // Use imported PDFGenerator directly
          pdfBuffer = await PDFGenerator.generateAgreementPDF(formData);
          console.log('📊 PDF generation result - Type:', typeof pdfBuffer, 'Size:', pdfBuffer?.length, 'bytes');
          
          // CRITICAL: Verify PDF is valid and has substantial content
          if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('PDF generation returned empty buffer');
          }
          
          if (pdfBuffer.length < 10000) { // PDF should be at least 10KB for a real agreement
            throw new Error(`PDF appears incomplete (${pdfBuffer.length} bytes) - template may not have loaded`);
          }
          
          // Verify it's a proper Uint8Array/ArrayBuffer
          if (!(pdfBuffer instanceof Uint8Array) && !(pdfBuffer instanceof ArrayBuffer)) {
            throw new Error(`PDF buffer is wrong type: ${typeof pdfBuffer}`);
          }
          
          console.log('✅ PDF validation passed - Valid PDF with', pdfBuffer.length, 'bytes');
        } catch (pdfError) {
          console.error('❌ PDF generation failed:', pdfError);
          // Show user-friendly error and ask if they want to continue without PDF
          const continueWithoutPdf = confirm(
            `PDF generation failed: ${pdfError.message}\n\n` +
            'Would you like to send the email without the PDF attachment?'
          );
          
          if (!continueWithoutPdf) {
            throw new Error('Email cancelled: PDF generation required but failed');
          }
          
          console.warn('⚠️ Continuing to send email without PDF attachment');
          pdfBuffer = null;
        }
      }
      
      // Send email using email client
      const result = await DocumentGenerator.emailClient.sendAgreementEmail({
        recipientEmail,
        recipientName,
        agreementData,
        pdfBuffer,
        includeAttachment: emailOptions.includePdf !== false
      });
      
      if (result.success) {
        console.log('✅ Agreement sent via email successfully');
        return result;
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  },
  
  // Show email modal/dialog
  showEmailDialog: () => {
    try {
      if (!DocumentGenerator.currentAgreement) {
        alert('Please generate an agreement first before sending via email.');
        return;
      }
      
      const formData = DocumentGenerator.currentAgreement.data;
      const defaultEmail = formData.email || '';
      const defaultName = formData.licenseeName || '';
      
      // Prepare agreement data for modal
      const agreementData = {
        licensee: formData.licenseeName,
        aircraft: `${formData.aircraftRegistration} - ${formData.aircraftMakeModel}`,
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      
      // Show professional email modal
      if (emailModalInstance) {
        emailModalInstance.show(
          defaultEmail,
          defaultName,
          agreementData,
          DocumentGenerator.handleEmailSend
        );
      } else {
        // Fallback to simple modal
        DocumentGenerator.createSimpleEmailModal(defaultEmail, defaultName);
      }
      
    } catch (error) {
      console.error('❌ Failed to show email dialog:', error);
      alert('Unable to show email dialog. Please try again.');
    }
  },
  
  // Handle email send from modal
  handleEmailSend: async (formData) => {
    try {
      await DocumentGenerator.sendEmail({
        email: formData.email,
        name: formData.name,
        includePdf: formData.includePdf
      });
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      // Error notification is handled by EmailClient
      throw error; // Re-throw to keep modal open
    }
  },
  
  // Fallback simple modal (in case EmailModal fails to load)
  createSimpleEmailModal: (defaultEmail, defaultName) => {
    const email = prompt('Enter email address for sending agreement:', defaultEmail);
    if (!email) return;
    
    const name = prompt('Enter recipient name:', defaultName) || defaultName;
    const includePdf = confirm('Include PDF attachment?');
    
    DocumentGenerator.sendEmail({
      email: email.trim(),
      name: name.trim(),
      includePdf
    }).catch(error => {
      alert(`Failed to send email: ${error.message}`);
    });
  },
  
  // Utility: Format date for display
  formatDate: (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  },
  
  // Utility: Format currency
  formatCurrency: (amount) => {
    if (!amount) return '$0.00';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } catch {
      return `$${amount}`;
    }
  },
  
  // Initialize document generator (set up event listeners)
  init: () => {
    console.log('📄 Initializing Document Generator...');
    
    // Set up print button handler
    const printButton = document.getElementById('print-agreement');
    if (printButton) {
      printButton.addEventListener('click', DocumentGenerator.print);
    }
    
    // Set up edit button handler (return to form)
    const editButton = document.getElementById('edit-agreement');
    if (editButton) {
      editButton.addEventListener('click', DocumentGenerator.hidePreview);
    }
    
    // Set up email button handler
    const emailButton = document.getElementById('email-agreement');
    if (emailButton) {
      emailButton.addEventListener('click', DocumentGenerator.showEmailDialog);
    }
    
    console.log('✅ Document Generator initialized with email support');
  }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DocumentGenerator.init);
} else {
  DocumentGenerator.init();
}

console.log('CA-66 Agreement Generator - Enhanced Document Generator loaded');

// Document Generation & Agreement Preview System - Phase 3 Implementation
import { AgreementTemplate } from './template.js';

export const DocumentGenerator = {
  // Current agreement data cache
  currentAgreement: null,
  
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
      'licenseeName', 'streetAddress', 'city', 'state', 'zipCode',
      'phone', 'email', 'pilotCert', 'flightHours',
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
    if (formData.flightHours < 300) {
      console.error('Flight hours below minimum requirement');
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
    const generateButton = document.getElementById('generate-agreement');
    if (generateButton) {
      generateButton.textContent = 'Generating Agreement...';
      generateButton.disabled = true;
      generateButton.classList.add('loading');
    }
    
    // Show progress indicator
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.style.opacity = '0.6';
    }
  },
  
  // Hide loading state after generation
  hideLoadingState: () => {
    const generateButton = document.getElementById('generate-agreement');
    if (generateButton) {
      generateButton.textContent = 'Generate Agreement';
      generateButton.disabled = false;
      generateButton.classList.remove('loading');
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
    
    console.log('✅ Document Generator initialized');
  }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DocumentGenerator.init);
} else {
  DocumentGenerator.init();
}

console.log('CA-66 Agreement Generator - Enhanced Document Generator loaded');

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
      
      // Add print-specific styling to the document
      const contentDiv = document.getElementById('agreement-content');
      if (contentDiv) {
        contentDiv.classList.add('print-ready');
      }
      
      // Update page title for print
      const originalTitle = document.title;
      document.title = 'CA-66 Airport Usage License Agreement - Print Version';
      
      // Trigger browser print dialog
      window.print();
      
      // Restore original title after print dialog
      setTimeout(() => {
        document.title = originalTitle;
        if (contentDiv) {
          contentDiv.classList.remove('print-ready');
        }
      }, 1000);
      
      console.log('✅ Print dialog opened');
      
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

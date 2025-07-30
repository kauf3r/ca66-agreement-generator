// Main Application - Phase 3 Complete System with Exhibit A Modal and UI Enhancements
import { AppConfig } from './config.js';
import { Validators, ValidationHelpers } from './validators.js';
import { DateCalculator, FeeCalculator, AutoPopulator } from './calculator.js';
import { UIManager } from './ui.js';
import { DocumentGenerator } from './generator.js';
import { PDFGenerator } from './pdf-generator.js';
import { ExhibitModal } from './exhibit-modal.js';
import { UIEnhancements } from './ui-enhancements.js';

class AgreementApp {
  constructor() {
    this.config = AppConfig;
    this.formData = {};
    this.validationErrors = {};
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    console.log('CA-66 Agreement Generator - Application starting...');
    console.log('Configuration:', this.config);
    
    // Initialize UI Manager (handles all form interactions and validation)
    UIManager.init();
    
    // Initialize Exhibit A Modal
    ExhibitModal.init();
    
    // Initialize UI Enhancements (loading states, animations, auto-save)
    UIEnhancements.init();
    
    // Set up main form event listeners
    this.setupFormListeners();
    
    // Set up data collection system
    this.setupDataCollection();
    
    // Initialize auto-population
    this.initializeAutoPopulation();
    
    this.isInitialized = true;
    console.log('CA-66 Agreement Generator - Phase 3 Complete System with UI Enhancements Initialized');
  }
  
  // Data Collection & Management System
  setupDataCollection() {
    const form = document.getElementById('agreement-form');
    if (!form) return;
    
    // Collect form data in real-time
    form.addEventListener('input', (e) => {
      this.updateFormData(e.target);
    });
    
    form.addEventListener('change', (e) => {
      this.updateFormData(e.target);
    });
  }
  
  // Update internal form data store
  updateFormData(field) {
    if (!field.name) return;
    
    let value = field.value;
    
    // Handle different field types
    if (field.type === 'checkbox') {
      value = field.checked;
    } else if (field.type === 'number') {
      value = field.value ? Number(field.value) : null;
    } else if (typeof value === 'string') {
      // Sanitize string inputs
      value = ValidationHelpers.sanitizeInput(value);
    }
    
    // Store the value
    this.formData[field.name] = value;
    
    // Log for debugging (remove in production)
    if (this.config.debug) {
      console.log(`Updated ${field.name}:`, value);
    }
  }
  
  // Get complete sanitized form data
  getFormData() {
    const sanitizedData = {};
    
    // First, collect data from internal store
    Object.keys(this.formData).forEach(key => {
      const value = this.formData[key];
      if (typeof value === 'string') {
        sanitizedData[key] = ValidationHelpers.sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    });
    
    // Ensure critical fields are always included from DOM if missing
    const criticalFields = ['start-date', 'end-date'];
    criticalFields.forEach(fieldId => {
      if (!sanitizedData[fieldId]) {
        const field = document.getElementById(fieldId);
        if (field && field.value) {
          sanitizedData[fieldId] = field.value;
        }
      }
    });
    
    // If start-date is still missing, use today's date
    if (!sanitizedData['start-date']) {
      sanitizedData['start-date'] = DateCalculator.getTodayFormatted();
    }
    
    // If end-date is still missing but we have start-date, calculate it
    if (!sanitizedData['end-date'] && sanitizedData['start-date']) {
      const endDate = DateCalculator.addOneYear(new Date(sanitizedData['start-date']));
      sanitizedData['end-date'] = DateCalculator.formatDateForInput(endDate);
    }
    
    return sanitizedData;
  }
  
  // Initialize auto-population features
  initializeAutoPopulation() {
    // Set today's date as start date (this will trigger change event)
    AutoPopulator.setStartDate();
    
    // Calculate and set end date based on start date (this will trigger change event)  
    const startDate = DateCalculator.getTodayFormatted();
    AutoPopulator.updateEndDate(startDate);
    
    // Display the annual fee
    AutoPopulator.updateFeeDisplay();
    
    // Set up automatic end date calculation
    this.setupEndDateCalculation();
    
    // Force update form data with current DOM values after auto-population
    setTimeout(() => {
      this.syncFormDataWithDOM();
    }, 100);
  }
  
  // Sync form data with current DOM values
  syncFormDataWithDOM() {
    const form = document.getElementById('agreement-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      if (field.name) {
        this.updateFormData(field);
      }
    });
    
    console.log('Form data synced with DOM:', this.formData);
  }
  
  // Set up automatic end date calculation when insurance expiry changes
  setupEndDateCalculation() {
    const policyExpiryField = document.getElementById('policy-expiry');
    const startDateField = document.getElementById('start-date');
    
    if (policyExpiryField && startDateField) {
      const updateEndDate = () => {
        const startDate = startDateField.value;
        
        if (startDate) {
          AutoPopulator.updateEndDate(startDate);
        }
      };
      
      policyExpiryField.addEventListener('change', updateEndDate);
      startDateField.addEventListener('change', updateEndDate);
    }
  }
  
  // Main form event listeners
  setupFormListeners() {
    const form = document.getElementById('agreement-form');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }
    
    // Listen for HTML agreement generation event
    document.addEventListener('generateAgreement', (e) => {
      console.log('HTML Agreement generation requested');
      if (e.detail.formValid) {
        this.generateHTMLAgreement();
      }
    });
    
    // Listen for PDF generation event
    document.addEventListener('generatePDF', (e) => {
      console.log('PDF Agreement generation requested');
      if (e.detail.formValid) {
        this.generatePDFAgreement();
      }
    });
    
    // Listen for PDF download event
    document.addEventListener('downloadPDF', (e) => {
      console.log('PDF download requested');
      this.downloadPDFAgreement();
    });
  }
  
  // Handle form submission (validation + agreement generation)
  handleFormSubmission() {
    const submitButton = document.getElementById('generate-agreement');
    
    console.log('Form submission initiated...');
    
    // Validate entire form
    if (!UIManager.isFormValid()) {
      console.log('Form validation failed - submission blocked');
      UIManager.scrollToFirstError();
      UIEnhancements.showToast('Please complete all required fields', 'warning');
      return;
    }
    
    try {
      // Show loading states
      UIEnhancements.showButtonLoading(submitButton, 'Generating Agreement...');
      UIEnhancements.showLoading('Creating Agreement', 'Generating your legal agreement document...');
      
      // Get sanitized form data
      const formData = this.getFormData();
      console.log('Form data collected:', formData);
      
      // Calculate agreement dates
      const agreementData = this.prepareAgreementData(formData);
      console.log('Agreement data prepared:', agreementData);
      
      // Store for reference
      this.agreementData = agreementData;
      
      // Generate and preview the agreement
      console.log('🔄 Generating legal agreement...');
      const success = DocumentGenerator.generateAndPreview(agreementData);
      
      // Hide loading states
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(submitButton);
      
      if (success) {
        console.log('✅ Agreement generated successfully');
        UIEnhancements.showButtonSuccess(submitButton, 'Agreement Generated!');
        UIEnhancements.showToast('Agreement generated successfully!', 'success');
        
        // Clear saved form progress since form is complete
        UIEnhancements.clearSavedProgress();
      } else {
        console.error('❌ Agreement generation failed');
        UIEnhancements.showToast('Agreement generation failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('❌ Agreement generation error:', error);
      
      // Hide loading states
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(submitButton);
      
      // Show error toast
      UIEnhancements.showToast('Failed to generate agreement. Please check your form data and try again.', 'error');
    }
  }
  
  // Prepare comprehensive agreement data
  prepareAgreementData(formData) {
    const startDate = formData['start-date'] || DateCalculator.getTodayFormatted();
    const insuranceExpiry = formData['policy-expiry'];
    
    const agreementData = {
      // Licensee Information (map form field names to template variables)
      licenseeName: formData['licensee-name'] || '',
      companyName: formData['company-name'] || null,
      phone: formData['phone'] || '',
      email: formData['email'] || '',
      flightHoursConfirmed: formData['flight-hours-confirmation'] || false,
      
      // Aircraft Information
      aircraftRegistration: formData['aircraft-registration'] || '',
      aircraftMakeModel: formData['aircraft-make-model'] || '',
      
      // Insurance Information
      insuredName: formData['insured-name'] || '',
      insuranceCompany: formData['insurance-company'] || '',
      insuranceAddress: formData['insurance-address'] || '',
      insuranceCity: formData['insurance-city'] || '',
      insuranceState: formData['insurance-state'] || '',
      insuranceZip: formData['insurance-zip'] || '',
      policyNumber: formData['policy-number'] || '',
      policyExpiry: insuranceExpiry || '',
      coverageAmount: formData['coverage-amount'] || '',
      
      // Calculated dates - Always 1 year from start date
      startDate: startDate,
      endDate: DateCalculator.formatDateForInput(
        DateCalculator.addOneYear(new Date(startDate))
      ),
      
      // Fee information
      annualFee: FeeCalculator.calculateAnnualFee(),
      feeFormatted: FeeCalculator.formatFee(FeeCalculator.calculateAnnualFee()),
      
      // Additional insureds (from config)
      additionalInsureds: this.config.additionalInsureds,
      
      // Generation metadata
      generatedDate: new Date().toISOString(),
      generatedBy: 'CA-66 Agreement Generator',
      version: '1.0',
      
      // Business logic validation flags
      validations: {
        flightHoursValid: formData['flight-hours-confirmation'] || false,
        insuranceValid: (formData['coverage-amount'] || 0) >= this.config.minimumInsurance,
        allRequiredFieldsComplete: UIManager.isFormValid(),
        agreementExpiryCalculated: true
      }
    };
    
    return agreementData;
  }
  
  // Utility method to get current application state
  getApplicationState() {
    return {
      initialized: this.isInitialized,
      formData: this.getFormData(),
      validationState: UIManager.validationState,
      progress: UIManager.calculateProgress(),
      isFormValid: UIManager.isFormValid()
    };
  }
  
  
  // Generate HTML agreement (existing functionality)
  async generateHTMLAgreement() {
    try {
      const formData = this.getFormData();
      console.log('Generating HTML agreement with data:', formData);
      
      // Generate the agreement using DocumentGenerator
      const agreementHTML = await DocumentGenerator.generateAgreement(formData);
      
      // Show the preview
      const previewSection = document.getElementById('agreement-preview');
      const contentDiv = document.getElementById('agreement-content');
      
      if (previewSection && contentDiv) {
        contentDiv.innerHTML = agreementHTML;
        previewSection.hidden = false;
        
        // Scroll to preview
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      console.log('HTML agreement generated successfully');
    } catch (error) {
      console.error('Failed to generate HTML agreement:', error);
      alert('Failed to generate agreement. Please check all fields and try again.');
    }
  }
  
  // Generate PDF agreement
  async generatePDFAgreement() {
    const generatePdfButton = document.getElementById('generate-pdf');
    
    try {
      const formData = this.getFormData();
      console.log('Generating PDF agreement with data:', formData);
      
      // Validate data for PDF generation
      const validation = PDFGenerator.validatePDFData(formData);
      if (!validation.isValid) {
        console.error('PDF validation failed:', validation.message);
        UIEnhancements.showToast('PDF generation failed: ' + validation.message, 'error');
        return;
      }
      
      // Show loading states
      UIEnhancements.showButtonLoading(generatePdfButton, 'Generating PDF...');
      UIEnhancements.showLoading('Generating PDF', 'Creating your legal agreement document...');
      
      // Generate PDF
      const pdfBytes = await PDFGenerator.generateAgreementPDF(formData);
      console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');
      
      // Store PDF bytes for potential download
      this.generatedPDFBytes = pdfBytes;
      
      // Preview the PDF in a new tab
      await PDFGenerator.previewPDF(pdfBytes);
      
      // Hide loading states
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(generatePdfButton);
      
      // Show success animation and toast
      UIEnhancements.showButtonSuccess(generatePdfButton, 'PDF Generated!');
      UIEnhancements.showToast('PDF generated successfully! Check the new tab to view your agreement.', 'success');
      
      console.log('PDF agreement generation completed');
    } catch (error) {
      console.error('Failed to generate PDF agreement:', error);
      
      // Hide loading states
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(generatePdfButton);
      
      // Show error toast
      UIEnhancements.showToast('Failed to generate PDF: ' + error.message, 'error');
    }
  }
  
  // Download PDF agreement with preview option
  async downloadPDFAgreement() {
    const downloadButton = document.getElementById('download-pdf');
    
    try {
      // If we have previously generated PDF bytes, show preview first
      if (this.generatedPDFBytes) {
        console.log('PDF already generated, showing preview options');
        this.showPDFPreviewModal(this.generatedPDFBytes);
        return;
      }
      
      // Otherwise, generate new PDF
      const formData = this.getFormData();
      console.log('Generating PDF for preview and download');
      
      // Show loading states
      UIEnhancements.showButtonLoading(downloadButton, 'Generating PDF...');
      UIEnhancements.showLoading('Preparing PDF', 'Generating your PDF for preview...');
      
      // Generate PDF
      const pdfBytes = await PDFGenerator.generateAgreementPDF(formData);
      
      // Store for future use
      this.generatedPDFBytes = pdfBytes;
      
      // Hide loading
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(downloadButton);
      
      // Show preview modal
      this.showPDFPreviewModal(pdfBytes);
      
      console.log('PDF generated and preview modal shown');
      
    } catch (error) {
      console.error('Failed to generate PDF for preview:', error);
      
      // Hide loading states
      UIEnhancements.hideLoading();
      UIEnhancements.hideButtonLoading(downloadButton);
      
      // Show error toast
      UIEnhancements.showToast('Failed to generate PDF: ' + error.message, 'error');
    }
  }
  
  // Show PDF preview modal with download options
  showPDFPreviewModal(pdfBytes) {
    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay pdf-preview-modal';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>PDF Preview</h3>
          <button class="modal-close" aria-label="Close preview">&times;</button>
        </div>
        <div class="modal-body">
          <div class="pdf-preview-content">
            <p>Your CA-66 Airport Use Agreement has been generated successfully.</p>
            <div class="preview-actions">
              <button class="btn btn-secondary" id="preview-in-tab">
                Preview in New Tab
              </button>
              <button class="btn btn-primary" id="download-now">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Event listeners
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Preview in tab
    modal.querySelector('#preview-in-tab').addEventListener('click', async () => {
      try {
        await PDFGenerator.previewPDF(pdfBytes);
        UIEnhancements.showToast('PDF opened in new tab', 'success');
      } catch (error) {
        UIEnhancements.showToast('Failed to preview PDF: ' + error.message, 'error');
      }
    });
    
    // Download directly
    modal.querySelector('#download-now').addEventListener('click', async () => {
      try {
        await PDFGenerator.downloadPDF(pdfBytes);
        UIEnhancements.showToast('PDF downloaded successfully!', 'success');
        closeModal();
      } catch (error) {
        UIEnhancements.showToast('Failed to download PDF: ' + error.message, 'error');
      }
    });
  }
  
  // Reset application to initial state
  resetApplication() {
    // Clear form data
    this.formData = {};
    this.validationErrors = {};
    this.agreementData = null;
    this.generatedPDFBytes = null;
    
    // Reset UI
    UIManager.clearForm();
    
    // Clear saved progress
    UIEnhancements.clearSavedProgress();
    
    // Show confirmation toast
    UIEnhancements.showToast('Form cleared successfully', 'info');
    
    // Re-initialize auto-population
    this.initializeAutoPopulation();
    
    console.log('Application reset to initial state');
  }
}

// Global application instance
let appInstance = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  appInstance = new AgreementApp();
  
  // Expose to global scope for debugging
  if (window) {
    window.CA66App = appInstance;
    window.DocumentGenerator = DocumentGenerator; // For console debugging
  }
});

// Export for potential module usage
export { AgreementApp };

console.log('CA-66 Agreement Generator - Phase 3 Complete App module loaded');

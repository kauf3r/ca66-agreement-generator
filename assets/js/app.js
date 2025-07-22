// Main Application - Phase 3 Complete System
import { AppConfig } from './config.js';
import { Validators, ValidationHelpers } from './validators.js';
import { DateCalculator, FeeCalculator, AutoPopulator } from './calculator.js';
import { UIManager } from './ui.js';
import { DocumentGenerator } from './generator.js';

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
    
    // Set up main form event listeners
    this.setupFormListeners();
    
    // Set up data collection system
    this.setupDataCollection();
    
    // Initialize auto-population
    this.initializeAutoPopulation();
    
    this.isInitialized = true;
    console.log('CA-66 Agreement Generator - Phase 3 Complete System Initialized');
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
    
    Object.keys(this.formData).forEach(key => {
      const value = this.formData[key];
      if (typeof value === 'string') {
        sanitizedData[key] = ValidationHelpers.sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    });
    
    return sanitizedData;
  }
  
  // Initialize auto-population features
  initializeAutoPopulation() {
    // Set today's date as start date
    AutoPopulator.setStartDate();
    
    // Display the annual fee
    AutoPopulator.updateFeeDisplay();
    
    // Set up automatic end date calculation
    this.setupEndDateCalculation();
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
    
    // Listen for agreement generation event from UI
    document.addEventListener('generateAgreement', (e) => {
      console.log('Generate agreement event received');
      this.handleFormSubmission();
    });
  }
  
  // Handle form submission (validation + agreement generation)
  handleFormSubmission() {
    console.log('Form submission initiated...');
    
    // Validate entire form
    if (!UIManager.isFormValid()) {
      console.log('Form validation failed - submission blocked');
      UIManager.scrollToFirstError();
      return;
    }
    
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
    try {
      const success = DocumentGenerator.generateAndPreview(agreementData);
      if (success) {
        console.log('✅ Agreement generated successfully');
      } else {
        console.error('❌ Agreement generation failed');
      }
    } catch (error) {
      console.error('❌ Agreement generation error:', error);
      alert('Failed to generate agreement. Please check your form data and try again.');
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
  
  // Reset application to initial state
  resetApplication() {
    // Clear form data
    this.formData = {};
    this.validationErrors = {};
    this.agreementData = null;
    
    // Reset UI
    UIManager.clearForm();
    
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

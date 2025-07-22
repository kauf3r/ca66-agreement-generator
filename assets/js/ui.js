// UI Interactions - Real-time Form Feedback System
import { Validators } from './validators.js';
import { DateCalculator, AutoPopulator } from './calculator.js';

export const UIManager = {
  // Form validation state tracking
  validationState: {},
  
  // Progress tracking
  updateProgress: (percentage) => {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
      progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
      progressText.textContent = `${Math.round(percentage)}% Complete`;
    }
  },
  
  // Calculate form completion percentage
  calculateProgress: () => {
    const requiredFields = [
      'licensee-name', 'phone', 'email', 'flight-hours-confirmation', 'medical-cert',
      'aircraft-registration', 'aircraft-make-model', 'mtow-confirmation', 'grass-field-capable',
      'insured-name', 'insurance-company', 'insurance-address', 'insurance-city',
      'insurance-state', 'insurance-zip', 'insurance-phone', 'policy-number',
      'policy-expiry', 'coverage-amount', 'sabbath-observance', 'airport-rules', 'liability-waiver'
    ];
    
    let completedFields = 0;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        if (field.type === 'checkbox') {
          if (field.checked) completedFields++;
        } else {
          if (field.value.trim()) completedFields++;
        }
      }
    });
    
    return (completedFields / requiredFields.length) * 100;
  },
  
  // Show validation error for a field
  showError: (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error class to field
    field.classList.add('error');
    field.classList.remove('success');
    
    // Remove existing error message
    UIManager.clearError(fieldId);
    
    // Create and insert error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.id = `${fieldId}-error`;
    
    // Insert after the field or its parent form-group
    const formGroup = field.closest('.form-group') || field.parentNode;
    formGroup.appendChild(errorElement);
    
    // Update validation state
    UIManager.validationState[fieldId] = { valid: false, message };
  },
  
  // Show validation success for a field
  showSuccess: (fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add success class to field
    field.classList.add('success');
    field.classList.remove('error');
    
    // Remove error message
    UIManager.clearError(fieldId);
    
    // Update validation state
    UIManager.validationState[fieldId] = { valid: true };
  },
  
  // Clear validation styling and messages for a field
  clearError: (fieldId) => {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.remove();
    }
  },
  
  // Validate a single field in real-time
  validateField: (fieldId, value) => {
    let validation;
    
    switch (fieldId) {
      case 'licensee-name':
      case 'aircraft-make-model':
      case 'insured-name':
      case 'insurance-company':
      case 'insurance-address':
      case 'insurance-city':
        validation = Validators.required(value);
        break;
        
      case 'email':
        validation = Validators.email(value);
        break;
        
      case 'phone':
      case 'insurance-phone':
        validation = Validators.phone(value);
        if (validation.valid && validation.formatted) {
          // Auto-format phone number
          const field = document.getElementById(fieldId);
          if (field) field.value = validation.formatted;
        }
        break;
        
        
      case 'coverage-amount':
        validation = Validators.insurance(value);
        break;
        
      case 'insurance-zip':
        validation = Validators.zipCode(value);
        break;
        
      case 'aircraft-registration':
        validation = Validators.aircraftRegistration(value);
        if (validation.valid && validation.formatted) {
          // Auto-format aircraft registration
          const field = document.getElementById(fieldId);
          if (field) field.value = validation.formatted;
        }
        break;
        
      case 'policy-number':
        validation = Validators.policyNumber(value);
        break;
        
      case 'policy-expiry':
        validation = DateCalculator.validateInsuranceExpiry(value);
        // Also update the end date when insurance expiry changes
        if (validation.valid) {
          const startDate = document.getElementById('start-date')?.value;
          if (startDate) {
            AutoPopulator.updateEndDate(startDate);
          }
        }
        break;
        
      case 'company-name':
        // Company name is optional
        validation = { valid: true };
        break;
        
      default:
        // For fields without specific validation, just check if required
        validation = value ? { valid: true } : { valid: false, message: 'This field is required.' };
    }
    
    // Show validation result
    if (validation.valid) {
      UIManager.showSuccess(fieldId);
    } else {
      UIManager.showError(fieldId, validation.message);
    }
    
    // Update progress
    UIManager.updateProgress(UIManager.calculateProgress());
    
    // Update button state after each field validation
    UIManager.updateButtonState();
    
    return validation.valid;
  },
  
  // Check if form is ready for submission
  isFormValid: () => {
    const requiredFields = [
      'licensee-name', 'phone', 'email', 'flight-hours-confirmation', 'medical-cert',
      'aircraft-registration', 'aircraft-make-model', 'mtow-confirmation', 'grass-field-capable',
      'insured-name', 'insurance-company', 'insurance-address', 'insurance-city',
      'insurance-state', 'insurance-zip', 'insurance-phone', 'policy-number',
      'policy-expiry', 'coverage-amount', 'sabbath-observance', 'airport-rules', 'liability-waiver'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        let value;
        if (field.type === 'checkbox') {
          value = field.checked;
          if (!value) {
            UIManager.showError(fieldId, 'This acknowledgment is required.');
            isValid = false;
          } else {
            UIManager.showSuccess(fieldId);
          }
        } else {
          value = field.value;
          if (!UIManager.validateField(fieldId, value)) {
            isValid = false;
          }
        }
      }
    });
    
    // Enable/disable generate button
    const generateButton = document.getElementById('generate-agreement');
    if (generateButton) {
      generateButton.disabled = !isValid;
    }
    
    return isValid;
  },
  
  // Update button state based on form validation (without triggering validation)
  updateButtonState: () => {
    const generateButton = document.getElementById('generate-agreement');
    if (generateButton) {
      // Check validation state without re-running validations
      const isValid = UIManager.checkFormValidationState();
      generateButton.disabled = !isValid;
      
      if (isValid) {
        generateButton.classList.remove('disabled');
        generateButton.setAttribute('title', 'Generate your agreement');
      } else {
        generateButton.classList.add('disabled');
        generateButton.setAttribute('title', 'Complete all required fields to generate agreement');
      }
    }
  },

  // Check validation state without running validations (prevents recursion)
  checkFormValidationState: () => {
    const requiredFields = [
      'licensee-name', 'phone', 'email', 'flight-hours-confirmation', 'medical-cert',
      'aircraft-registration', 'aircraft-make-model', 'mtow-confirmation', 'grass-field-capable',
      'insured-name', 'insurance-company', 'insurance-address', 'insurance-city',
      'insurance-state', 'insurance-zip', 'insurance-phone', 'policy-number',
      'policy-expiry', 'coverage-amount', 'sabbath-observance', 'airport-rules', 'liability-waiver'
    ];
    
    // Check if all fields have valid state in validationState
    for (const fieldId of requiredFields) {
      if (!UIManager.validationState[fieldId] || !UIManager.validationState[fieldId].valid) {
        return false;
      }
    }
    return true;
  },
  
  // Clear all form data
  clearForm: () => {
    if (!confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      return;
    }
    
    // Clear all form fields
    const form = document.getElementById('agreement-form');
    if (form) {
      form.reset();
    }
    
    // Clear all validation states
    Object.keys(UIManager.validationState).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.classList.remove('error', 'success');
      }
      UIManager.clearError(fieldId);
    });
    
    UIManager.validationState = {};
    
    // Reset progress
    UIManager.updateProgress(0);
    
    // Re-populate auto fields
    AutoPopulator.setStartDate();
    AutoPopulator.updateFeeDisplay();
    
    console.log('Form cleared successfully');
  },
  
  // Smooth scroll to first error
  scrollToFirstError: () => {
    const firstError = document.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  },
  
  // Initialize all UI interactions
  init: () => {
    console.log('UI Manager initializing real-time form feedback...');
    
    // Auto-populate initial values
    AutoPopulator.setStartDate();
    AutoPopulator.updateFeeDisplay();
    
    // Set up real-time validation for all form fields
    UIManager.setupRealTimeValidation();
    
    // Set up button handlers
    UIManager.setupButtonHandlers();
    
    // Set up special field handlers
    UIManager.setupSpecialHandlers();
    
    // Initialize button state
    UIManager.updateButtonState();
    
    console.log('UI Manager initialized with real-time feedback system');
  },
  
  // Set up real-time validation for all form fields
  setupRealTimeValidation: () => {
    const form = document.getElementById('agreement-form');
    if (!form) return;
    
    // Add event listeners to all form fields
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      // Validate on blur (when user leaves the field)
      field.addEventListener('blur', (e) => {
        if (e.target.type === 'checkbox') {
          UIManager.validateField(e.target.id, e.target.checked);
        } else {
          UIManager.validateField(e.target.id, e.target.value);
        }
      });
      
      // Validate on input for immediate feedback (with debouncing)
      let timeout;
      field.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (e.target.type === 'checkbox') {
            UIManager.validateField(e.target.id, e.target.checked);
          } else {
            UIManager.validateField(e.target.id, e.target.value);
          }
        }, 300); // 300ms debounce
      });
    });
  },
  
  // Set up button event handlers
  setupButtonHandlers: () => {
    const clearButton = document.getElementById('clear-form');
    const generateButton = document.getElementById('generate-agreement');
    const printButton = document.getElementById('print-agreement');
    const editButton = document.getElementById('edit-agreement');
    
    if (clearButton) {
      clearButton.addEventListener('click', UIManager.clearForm);
    }
    
    if (generateButton) {
      generateButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (UIManager.isFormValid()) {
          console.log('Form is valid, generating agreement...');
          // Trigger agreement generation (this will be handled by the main app)
          const generateEvent = new CustomEvent('generateAgreement', {
            detail: { formValid: true }
          });
          document.dispatchEvent(generateEvent);
        } else {
          console.log('Form validation failed');
          UIManager.scrollToFirstError();
        }
      });
    }
    
    // Print button handler is managed by DocumentGenerator
    
    if (editButton) {
      editButton.addEventListener('click', () => {
        const previewSection = document.getElementById('agreement-preview');
        if (previewSection) {
          previewSection.hidden = true;
        }
      });
    }
  },
  
  // Set up special field handlers (auto-calculations)
  setupSpecialHandlers: () => {
    // Update end date when insurance expiry changes
    const policyExpiryField = document.getElementById('policy-expiry');
    if (policyExpiryField) {
      policyExpiryField.addEventListener('change', (e) => {
        const startDate = document.getElementById('start-date')?.value;
        if (startDate) {
          AutoPopulator.updateEndDate(startDate);
        }
      });
    }
    
    // Format phone numbers as user types
    document.querySelectorAll('input[type="tel"]').forEach(field => {
      field.addEventListener('input', (e) => {
        // This will be handled by the validation system
      });
    });
  }
};

console.log('CA-66 Agreement Generator - Enhanced UI Manager loaded');

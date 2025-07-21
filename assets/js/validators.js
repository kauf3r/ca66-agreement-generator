// Form Validation Engine - Safety & Legal Compliance
import { AppConfig } from './config.js';

export const Validators = {
  // Required field validation
  required: (value) => {
    if (!value) return { valid: false, message: 'This field is required.' };
    const trimmed = String(value).trim();
    return trimmed.length > 0 
      ? { valid: true } 
      : { valid: false, message: 'This field is required.' };
  },

  // Email validation with comprehensive checks
  email: (email) => {
    if (!email) return { valid: false, message: 'Email address is required.' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = email.trim();
    
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    
    // Additional email validation checks
    if (trimmed.length > 254) {
      return { valid: false, message: 'Email address is too long.' };
    }
    
    return { valid: true };
  },

  // Phone number validation with formatting
  phone: (phone) => {
    if (!phone) return { valid: false, message: 'Phone number is required.' };
    
    // Remove all non-digit characters for validation
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length < 10) {
      return { valid: false, message: 'Please enter a valid 10-digit phone number.' };
    }
    
    if (digits.length > 11) {
      return { valid: false, message: 'Phone number is too long.' };
    }
    
    // Format phone number for display
    const formatted = digits.length === 10 
      ? `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
      : `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
    
    return { valid: true, formatted };
  },

  // CRITICAL: Flight hours validation (safety requirement)
  flightHours: (hours) => {
    if (!hours) {
      return { valid: false, message: 'Total flight hours is required.' };
    }
    
    const numHours = Number(hours);
    
    if (isNaN(numHours)) {
      return { valid: false, message: 'Please enter a valid number of flight hours.' };
    }
    
    if (numHours < 0) {
      return { valid: false, message: 'Flight hours cannot be negative.' };
    }
    
    if (numHours < AppConfig.minimumFlightHours) {
      return { 
        valid: false, 
        message: `Minimum ${AppConfig.minimumFlightHours} flight hours required for safety compliance.` 
      };
    }
    
    if (numHours > 50000) {
      return { valid: false, message: 'Flight hours seems unrealistic. Please verify.' };
    }
    
    return { valid: true };
  },

  // CRITICAL: Insurance amount validation (legal requirement)
  insurance: (amount) => {
    if (!amount) {
      return { valid: false, message: 'Insurance coverage amount is required.' };
    }
    
    const numAmount = Number(amount);
    
    if (isNaN(numAmount)) {
      return { valid: false, message: 'Please enter a valid insurance amount.' };
    }
    
    if (numAmount < AppConfig.minimumInsurance) {
      return { 
        valid: false, 
        message: `Minimum $${AppConfig.minimumInsurance.toLocaleString()} coverage required.` 
      };
    }
    
    if (numAmount > 100000000) { // $100M seems excessive, flag for review
      return { valid: false, message: 'Insurance amount seems unusually high. Please verify.' };
    }
    
    return { valid: true };
  },

  // Date validation
  date: (dateString, fieldName = 'Date') => {
    if (!dateString) {
      return { valid: false, message: `${fieldName} is required.` };
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return { valid: false, message: 'Please enter a valid date.' };
    }
    
    return { valid: true, date };
  },

  // Future date validation (for insurance expiry)
  futureDate: (dateString, fieldName = 'Date') => {
    const basicValidation = Validators.date(dateString, fieldName);
    if (!basicValidation.valid) return basicValidation;
    
    const date = basicValidation.date;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for date comparison
    
    if (date <= today) {
      return { valid: false, message: `${fieldName} must be in the future.` };
    }
    
    // Check if date is too far in the future (more than 10 years)
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
    
    if (date > tenYearsFromNow) {
      return { valid: false, message: `${fieldName} seems too far in the future.` };
    }
    
    return { valid: true, date };
  },

  // ZIP code validation
  zipCode: (zip) => {
    if (!zip) return { valid: false, message: 'ZIP code is required.' };
    
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    
    if (!zipRegex.test(zip.trim())) {
      return { valid: false, message: 'Please enter a valid ZIP code (12345 or 12345-6789).' };
    }
    
    return { valid: true };
  },

  // Aircraft registration validation
  aircraftRegistration: (registration) => {
    if (!registration) {
      return { valid: false, message: 'Aircraft registration number is required.' };
    }
    
    const reg = registration.trim().toUpperCase();
    
    // Basic US registration format: N followed by 1-5 digits, optionally followed by 0-2 letters
    const usRegex = /^N[0-9]{1,5}[A-Z]{0,2}$/;
    
    if (!usRegex.test(reg)) {
      return { 
        valid: false, 
        message: 'Please enter a valid US aircraft registration (e.g., N12345, N123AB).' 
      };
    }
    
    return { valid: true, formatted: reg };
  },

  // Generic text validation
  text: (value, minLength = 1, maxLength = 255) => {
    if (!value) return { valid: false, message: 'This field is required.' };
    
    const trimmed = value.trim();
    
    if (trimmed.length < minLength) {
      return { valid: false, message: `Must be at least ${minLength} characters.` };
    }
    
    if (trimmed.length > maxLength) {
      return { valid: false, message: `Must be no more than ${maxLength} characters.` };
    }
    
    return { valid: true };
  },

  // Policy number validation
  policyNumber: (policyNum) => {
    if (!policyNum) {
      return { valid: false, message: 'Insurance policy number is required.' };
    }
    
    const trimmed = policyNum.trim();
    
    if (trimmed.length < 3) {
      return { valid: false, message: 'Policy number seems too short.' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, message: 'Policy number is too long.' };
    }
    
    return { valid: true };
  }
};

// Validation helper functions
export const ValidationHelpers = {
  // Sanitize input to prevent XSS
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove basic HTML chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },
  
  // Format currency for display
  formatCurrency: (amount) => {
    const num = Number(amount);
    return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
  },
  
  // Format date for display
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US');
  }
};

console.log('CA-66 Agreement Generator - Enhanced Validators loaded');

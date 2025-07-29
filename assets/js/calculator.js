// Date and Fee Calculations - Business Logic Engine
import { AppConfig } from './config.js';

export const DateCalculator = {
  // Get today's date formatted for HTML date inputs (YYYY-MM-DD)
  getTodayFormatted: () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },
  
  // Add exactly one year to a date
  addOneYear: (date) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate;
  },
  
  // CRITICAL BUSINESS LOGIC: Calculate agreement expiry date
  // Agreement expires on the EARLIER of:
  // 1. Insurance policy expiry date
  // 2. One year from start date
  getAgreementExpiryDate: (startDate, insuranceExpiryDate) => {
    if (!startDate) {
      throw new Error('Start date is required for agreement expiry calculation');
    }
    
    const start = new Date(startDate);
    const oneYearFromStart = DateCalculator.addOneYear(start);
    
    // If no insurance expiry provided, default to one year
    if (!insuranceExpiryDate) {
      return oneYearFromStart;
    }
    
    const insuranceExpiry = new Date(insuranceExpiryDate);
    
    // Return the earlier date
    return insuranceExpiry < oneYearFromStart ? insuranceExpiry : oneYearFromStart;
  },
  
  // Sabbath observance check (MBA values - no operations Friday sunset to Saturday sunset)
  isSabbathTime: (date) => {
    const day = new Date(date).getDay();
    // 0 = Sunday, 6 = Saturday
    // For simplicity, we'll consider all of Friday (5) and Saturday (6) as Sabbath
    // In practice, this would need sunset calculations
    return day === 5 || day === 6;
  },
  
  // Check if a date falls on weekend (for Sabbath restrictions)
  isWeekend: (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  },
  
  // Format date for display (DD/MM/YYYY)
  formatDateForDisplay: (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // Format as DD/MM/YYYY
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  },
  
  // Format date for HTML date input (YYYY-MM-DD)
  formatDateForInput: (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toISOString().split('T')[0];
  },
  
  // Calculate days between two dates
  daysBetween: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },
  
  // Check if insurance expiry is approaching (within 30 days)
  isInsuranceExpiringShown: (expiryDate) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = DateCalculator.daysBetween(today, expiry);
    
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  },
  
  // Validate that insurance expiry is not too soon
  validateInsuranceExpiry: (expiryDate) => {
    if (!expiryDate) {
      return { valid: false, message: 'Insurance expiry date is required.' };
    }
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiry <= today) {
      return { 
        valid: false, 
        message: 'Insurance policy has already expired. Please renew before proceeding.' 
      };
    }
    
    const daysUntilExpiry = DateCalculator.daysBetween(today, expiry);
    
    if (daysUntilExpiry < 30) {
      return {
        valid: false,
        message: `Insurance expires in ${daysUntilExpiry} days. Please renew policy before applying.`
      };
    }
    
    return { valid: true };
  },
  
  // Get current fiscal year (for fee calculations)
  getCurrentFiscalYear: () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Assuming fiscal year starts July 1
    const fiscalYearStart = new Date(currentYear, 6, 1); // July 1
    
    if (now >= fiscalYearStart) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  }
};

// Fee calculation utilities
export const FeeCalculator = {
  // Calculate annual fee (currently fixed at $250)
  calculateAnnualFee: () => {
    return AppConfig.annualFee;
  },
  
  // Format fee for display
  formatFee: (amount) => {
    return `$${amount.toFixed(2)}`;
  },
  
  // Calculate pro-rated fee if agreement starts mid-year (future enhancement)
  calculateProratedFee: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const totalDays = DateCalculator.daysBetween(start, end);
    const fullYearDays = 365;
    
    const proratedAmount = (AppConfig.annualFee * totalDays) / fullYearDays;
    
    // Minimum fee is always the full amount for this application
    return Math.max(proratedAmount, AppConfig.annualFee);
  }
};

// Auto-population utilities for form fields
export const AutoPopulator = {
  // Auto-populate start date with today
  setStartDate: () => {
    const startDateField = document.getElementById('start-date');
    if (startDateField) {
      startDateField.value = DateCalculator.getTodayFormatted();
      // Trigger change event to update form data
      startDateField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
  
  // Calculate and set end date - always 1 year from start date
  updateEndDate: (startDate) => {
    const endDateField = document.getElementById('end-date');
    if (!endDateField) return;
    
    try {
      // Always use 1 year from start date (ignore insurance expiry for end date calculation)
      const oneYearLater = DateCalculator.addOneYear(new Date(startDate));
      endDateField.value = DateCalculator.formatDateForInput(oneYearLater);
      // Trigger change event to update form data
      endDateField.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {
      console.error('Error calculating end date:', error);
      endDateField.value = '';
    }
  },
  
  // Auto-populate fee display
  updateFeeDisplay: () => {
    const feeAmountElement = document.querySelector('.fee-amount');
    if (feeAmountElement) {
      const fee = FeeCalculator.calculateAnnualFee();
      feeAmountElement.textContent = FeeCalculator.formatFee(fee);
    }
  }
};

console.log('CA-66 Agreement Generator - Enhanced Calculator loaded');

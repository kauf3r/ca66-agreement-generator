/**
 * PDF Generator Module
 * Handles PDF generation using pdf-lib for CA-66 Agreement Generator
 * Creates filled PDF documents that match the exact template formatting
 */

import { DateCalculator } from './calculator.js';
import { PDFLibGenerator } from './pdf-lib-generator.js';

export class PDFGenerator {
  
  /**
   * Main method to generate a filled PDF agreement
   * @param {Object} formData - Form data from the application
   * @returns {Promise<Uint8Array>} Generated PDF bytes
   */
  static async generateAgreementPDF(formData) {
    try {
      console.log('Generating PDF with form data:', formData);
      
      // Use pdf-lib implementation to generate filled PDF
      const pdfBytes = await PDFLibGenerator.generateFilledPDF(formData);
      
      console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');
      
      return pdfBytes;
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  }
  
  /**
   * Creates the field mapping from form data to PDF field names
   * @param {Object} formData - Raw form data
   * @returns {Object} Mapped PDF field data
   */
  static createFieldMapping(formData) {
    // Format dates to DD/MM/YYYY for PDF
    const startDate = DateCalculator.formatDateForDisplay(formData['start-date']);
    const endDate = DateCalculator.formatDateForDisplay(formData['end-date']);
    const policyExpiry = DateCalculator.formatDateForDisplay(formData['policy-expiry']);
    
    // Combine aircraft information
    const aircraftInfo = `${formData['aircraft-registration']} - ${formData['aircraft-make-model']}`;
    
    // Format insurance coverage amount
    const coverageFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(formData['coverage-amount']);
    
    // Combine insurance address
    const insuranceFullAddress = `${formData['insurance-address']}, ${formData['insurance-city']}, ${formData['insurance-state']} ${formData['insurance-zip']}`;
    
    // PDF field mapping based on template analysis
    const pdfFieldMapping = {
      // Main agreement fields
      '[START-DATE]': startDate,
      '[END-DATE]': endDate,
      '[LICENSEE]': formData['licensee-name'],
      '[AIRCRAFT]': aircraftInfo,
      
      // Contact information
      '[PHONE]': formData['phone'],
      '[EMAIL]': formData['email'],
      
      // Insurance information
      '[INSURANCE-COMPANY]': formData['insurance-company'],
      '[INSURANCE-POLICY-NUMBER]': formData['policy-number'], 
      '[INSURANCE-EXPIRATION]': policyExpiry,
      '[INSURANCE-PHONE]': formData['insurance-phone'],
      '[INSURANCE-ADDRESS]': formData['insurance-address'],
      '[INSURANCE-CITY]': formData['insurance-city'],
      '[INSURANCE-STATE]': formData['insurance-state'],
      '[INSURANCE-ZIP]': formData['insurance-zip'],
      
      // Additional fields that might be in the template
      'LICENSEE': formData['licensee-name'], // Alternative field name
      'PHONE': formData['phone'], // Alternative field name
      'EMAIL': formData['email'] // Alternative field name
    };
    
    return pdfFieldMapping;
  }
  
  /**
   * Download generated PDF file
   * @param {Uint8Array} pdfBytes - PDF bytes to download
   * @param {string} filename - Filename for download
   */
  static async downloadPDF(pdfBytes, filename = null) {
    try {
      // Use PDFLibGenerator download method
      PDFLibGenerator.downloadPDF(pdfBytes, filename);
      
    } catch (error) {
      console.error('PDF Download Error:', error);
      throw new Error('Failed to download PDF: ' + error.message);
    }
  }
  
  /**
   * Preview generated PDF in new tab
   * @param {Uint8Array} pdfBytes - PDF bytes to preview
   */
  static async previewPDF(pdfBytes) {
    try {
      PDFLibGenerator.previewPDF(pdfBytes);
    } catch (error) {
      console.error('PDF Preview Error:', error);
      throw new Error('Failed to preview PDF: ' + error.message);
    }
  }
  
  /**
   * Validate that all required PDF fields have data
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result
   */
  static validatePDFData(formData) {
    const requiredFields = [
      'licensee-name',
      'phone', 
      'email',
      'aircraft-registration',
      'aircraft-make-model',
      'insurance-company',
      'policy-number',
      'policy-expiry',
      'coverage-amount',
      'start-date',
      'end-date'
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      const value = formData[field];
      
      // Handle different data types properly
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else if (typeof value === 'string' && value.trim() === '') {
        missingFields.push(field);
      } else if (typeof value === 'number' && isNaN(value)) {
        missingFields.push(field);
      } else if (typeof value === 'boolean' && !value) {
        // For checkboxes, false means missing
        missingFields.push(field);
      }
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields,
      message: missingFields.length > 0 
        ? `Missing required fields: ${missingFields.join(', ')}`
        : 'All required fields present'
    };
  }
  
  /**
   * Get template information
   * @returns {Object} Template metadata
   */
  static getTemplateInfo() {
    return {
      name: 'CA66 Monterey Bay Academy Airport License Agreement',
      version: 'July 2025',
      path: 'assets/examples/[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July25.pdf',
      fieldCount: Object.keys(this.createFieldMapping({})).length,
      supportedFormats: ['PDF']
    };
  }
}

/**
 * PDF Generation Error Classes
 */
export class PDFGenerationError extends Error {
  constructor(message, code = 'PDF_GENERATION_ERROR') {
    super(message);
    this.name = 'PDFGenerationError';
    this.code = code;
  }
}

export class PDFTemplateError extends Error {
  constructor(message, code = 'PDF_TEMPLATE_ERROR') {
    super(message);
    this.name = 'PDFTemplateError'; 
    this.code = code;
  }
}

console.log('CA-66 Agreement Generator - PDF Generator module loaded');
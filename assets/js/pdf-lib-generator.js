/**
 * PDF-lib Implementation for CA-66 Agreement Generator
 * Generates filled PDF documents using pdf-lib library
 */

import { DateCalculator } from './calculator.js';
import { PDFPositionConfig } from './pdf-position-config.js';

export class PDFLibGenerator {
  
  /**
   * Generate a filled PDF agreement using pdf-lib
   * @param {Object} formData - Form data from the application
   * @returns {Promise<Uint8Array>} Generated PDF bytes
   */
  static async generateFilledPDF(formData) {
    try {
      // Import pdf-lib dynamically (it's loaded via CDN)
      const { PDFDocument, rgb } = PDFLib;
      
      // Load the template PDF
      const templatePath = 'assets/examples/[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July25.pdf';
      const templateBytes = await this.fetchPDFTemplate(templatePath);
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(templateBytes);
      
      // Get the form from the PDF
      const form = pdfDoc.getForm();
      
      // Check if form has fields
      const fields = form.getFields();
      console.log(`PDF has ${fields.length} form fields`);
      
      if (fields.length === 0) {
        console.log('PDF template has no form fields. Using text replacement method.');
        // Since this PDF uses text placeholders instead of form fields,
        // we need to add text overlays at the placeholder positions
        await this.addTextOverlays(pdfDoc, formData);
      } else {
        console.log('PDF has form fields. Using form field filling method.');
        // Fill the form fields
        await this.fillFormFields(form, formData);
        // Flatten the form to make it non-editable
        form.flatten();
      }
      
      // Generate the filled PDF bytes
      const pdfBytes = await pdfDoc.save();
      
      return pdfBytes;
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  }
  
  /**
   * Fetch the PDF template file
   * @param {string} templatePath - Path to the template PDF
   * @returns {Promise<ArrayBuffer>} PDF template bytes
   */
  static async fetchPDFTemplate(templatePath) {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Template fetch error:', error);
      throw new Error('Could not load PDF template: ' + error.message);
    }
  }
  
  /**
   * Add text overlays to replace placeholder text in PDF
   * Uses configuration-based positioning for accurate text placement
   * @param {PDFDocument} pdfDoc - The PDF document
   * @param {Object} formData - Form data to overlay
   */
  static async addTextOverlays(pdfDoc, formData) {
    try {
      const { rgb, StandardFonts } = PDFLib;
      
      // Get field mapping for replacements
      const fieldMapping = this.createFieldMapping(formData);
      console.log('Field mapping for text overlay:', fieldMapping);
      
      // Get all pages
      const pages = pdfDoc.getPages();
      
      // Embed the configured font
      const font = await pdfDoc.embedFont(StandardFonts[PDFPositionConfig.defaultFont] || StandardFonts.Helvetica);
      
      // Log total number of pages
      console.log(`PDF has ${pages.length} page(s)`);
      
      // Process each page
      pages.forEach((page, pageIndex) => {
        const pageNumber = pageIndex + 1;
        console.log(`Processing page ${pageNumber} of ${pages.length}`);
        
        // Get page dimensions for debugging
        const { width, height } = page.getSize();
        console.log(`Page ${pageNumber} dimensions: ${width} x ${height}`);
        
        // Get placeholders for this page
        const pagePlaceholders = PDFPositionConfig.getPlaceholdersForPage(pageNumber);
        console.log(`Found ${pagePlaceholders.length} placeholders for page ${pageNumber}`);
        
        pagePlaceholders.forEach(({ placeholder, originalPlaceholder, x, y, size, maxWidth, description }) => {
          // Get the replacement value from field mapping
          // Use originalPlaceholder for lookup (handles multiple positions)
          const lookupKey = originalPlaceholder || placeholder;
          const placeholderKey = lookupKey.replace(/[\[\]]/g, ''); // Remove brackets for lookup
          const value = fieldMapping[lookupKey] || fieldMapping[placeholderKey];
          
          if (value && String(value).trim()) {
            const textValue = String(value).trim();
            const fontSize = size || PDFPositionConfig.defaultFontSize;
            
            // Validate text fits within max width
            if (!PDFPositionConfig.validateTextFit(textValue, { maxWidth, size: fontSize }, font)) {
              console.warn(`Text "${textValue}" may be too wide for placeholder ${placeholder}`);
            }
            
            // Draw a white rectangle to cover the placeholder
            const textWidth = font.widthOfTextAtSize(textValue, fontSize);
            const rectHeight = fontSize + 4;
            
            page.drawRectangle({
              x: x - 2,
              y: y - 2,
              width: Math.min(textWidth + 4, maxWidth + 4),
              height: rectHeight,
              color: rgb(1, 1, 1), // White background to cover placeholder
            });
            
            // Draw the replacement text
            page.drawText(textValue, {
              x: x,
              y: y,
              size: fontSize,
              font: font,
              color: rgb(...PDFPositionConfig.defaultColor),
            });
            
            console.log(`✅ Replaced ${placeholder} with "${textValue}" at (${x}, ${y}) - ${description}`);
          } else {
            console.warn(`⚠️  No value found for placeholder ${placeholder} - ${description}`);
          }
        });
      });
      
      console.log(`Text overlays completed. Processed ${pages.length} page(s).`);
      
    } catch (error) {
      console.error('Error adding text overlays:', error);
      throw error;
    }
  }
  
  /**
   * Fill form fields in the PDF
   * @param {PDFForm} form - The PDF form object
   * @param {Object} formData - Form data to fill
   */
  static async fillFormFields(form, formData) {
    try {
      // Get all field names in the PDF (for debugging)
      const fieldNames = form.getFields().map(field => field.getName());
      console.log('Available PDF fields:', fieldNames);
      
      // Create field mapping
      const fieldMapping = this.createFieldMapping(formData);
      
      // Fill each field
      Object.entries(fieldMapping).forEach(([fieldName, value]) => {
        try {
          const field = form.getField(fieldName);
          if (field) {
            // Handle different field types
            if (field.constructor.name === 'PDFTextField') {
              // Ensure value is string and handle null/undefined
              const textValue = (value === null || value === undefined) ? '' : String(value);
              field.setText(textValue);
            } else if (field.constructor.name === 'PDFCheckBox') {
              if (value) {
                field.check();
              } else {
                field.uncheck();
              }
            } else if (field.constructor.name === 'PDFDropdown') {
              const selectValue = (value === null || value === undefined) ? '' : String(value);
              field.select(selectValue);
            }
            console.log(`Filled field '${fieldName}' with value:`, value);
          }
        } catch (fieldError) {
          console.warn(`Could not fill field '${fieldName}':`, fieldError.message);
        }
      });
      
    } catch (error) {
      console.error('Form filling error:', error);
      throw error;
    }
  }
  
  /**
   * Create field mapping from form data
   * @param {Object} formData - Raw form data
   * @returns {Object} Mapped PDF field data
   */
  static createFieldMapping(formData) {
    console.log('Creating field mapping from form data:', formData);
    
    // Safely get date values and format them
    const startDateValue = formData['start-date'];
    const endDateValue = formData['end-date'];
    const policyExpiryValue = formData['policy-expiry'];
    
    const startDate = startDateValue ? DateCalculator.formatDateForDisplay(startDateValue) : '';
    const endDate = endDateValue ? DateCalculator.formatDateForDisplay(endDateValue) : '';
    const policyExpiry = policyExpiryValue ? DateCalculator.formatDateForDisplay(policyExpiryValue) : '';
    
    // Safely combine aircraft information
    const aircraftReg = formData['aircraft-registration'] || '';
    const aircraftModel = formData['aircraft-make-model'] || '';
    const aircraftInfo = aircraftReg && aircraftModel ? `${aircraftReg} - ${aircraftModel}` : (aircraftReg || aircraftModel);
    
    // Safely format insurance coverage amount
    const coverageAmount = formData['coverage-amount'];
    let coverageFormatted = '';
    if (coverageAmount && typeof coverageAmount === 'number' && !isNaN(coverageAmount)) {
      coverageFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(coverageAmount);
    } else if (coverageAmount) {
      coverageFormatted = String(coverageAmount);
    }
    
    // Helper function to safely get form data
    const getFormValue = (key) => {
      const value = formData[key];
      return (value === null || value === undefined) ? '' : String(value);
    };
    
    // Try multiple possible field name variations
    const fieldMapping = {
      // Common field name patterns
      'LICENSEE': getFormValue('licensee-name'),
      'LICENSEE-NAME': getFormValue('licensee-name'),
      'LICENSEE_NAME': getFormValue('licensee-name'),
      'Licensee': getFormValue('licensee-name'),
      'Licensee Name': getFormValue('licensee-name'),
      'Name': getFormValue('licensee-name'),
      
      'PHONE': getFormValue('phone'),
      'PHONE-NUMBER': getFormValue('phone'), 
      'Phone': getFormValue('phone'),
      'Phone Number': getFormValue('phone'),
      
      'EMAIL': getFormValue('email'),
      'EMAIL-ADDRESS': getFormValue('email'),
      'Email': getFormValue('email'),
      'Email Address': getFormValue('email'),
      
      'AIRCRAFT': aircraftInfo,
      'AIRCRAFT-INFO': aircraftInfo,
      'AIRCRAFT-REGISTRATION': getFormValue('aircraft-registration'),
      'Aircraft Registration': getFormValue('aircraft-registration'),
      'Registration': getFormValue('aircraft-registration'),
      
      'AIRCRAFT-MAKE-MODEL': getFormValue('aircraft-make-model'),
      'Aircraft Make Model': getFormValue('aircraft-make-model'),
      'Make Model': getFormValue('aircraft-make-model'),
      
      'INSURANCE-COMPANY': getFormValue('insurance-company'),
      'Insurance Company': getFormValue('insurance-company'),
      'Insurer': getFormValue('insurance-company'),
      
      'POLICY-NUMBER': getFormValue('policy-number'),
      'Policy Number': getFormValue('policy-number'),
      'Policy': getFormValue('policy-number'),
      
      'COVERAGE-AMOUNT': coverageFormatted,
      'Coverage Amount': coverageFormatted,
      'Coverage': coverageFormatted,
      
      'POLICY-EXPIRY': policyExpiry,
      'Policy Expiry': policyExpiry,
      'Insurance Expiry': policyExpiry,
      
      'START-DATE': startDate,
      'Start Date': startDate,
      'Agreement Start': startDate,
      
      'END-DATE': endDate,
      'End Date': endDate,
      'Agreement End': endDate,
      
      'INSURANCE-ADDRESS': getFormValue('insurance-address'),
      'Insurance Address': getFormValue('insurance-address'),
      
      'INSURANCE-CITY': getFormValue('insurance-city'),
      'Insurance City': getFormValue('insurance-city'),
      
      'INSURANCE-STATE': getFormValue('insurance-state'),
      'Insurance State': getFormValue('insurance-state'),
      
      'INSURANCE-ZIP': getFormValue('insurance-zip'),
      'Insurance ZIP': getFormValue('insurance-zip'),
      
      'INSURANCE-PHONE': getFormValue('insurance-phone'),
      'Insurance Phone': getFormValue('insurance-phone')
    };
    
    return fieldMapping;
  }
  
  /**
   * Download the generated PDF
   * @param {Uint8Array} pdfBytes - Generated PDF bytes
   * @param {string} filename - Filename for download
   */
  static downloadPDF(pdfBytes, filename = null) {
    try {
      if (!filename) {
        const timestamp = new Date().toISOString().slice(0, 10);
        const licensee = document.getElementById('licensee-name')?.value || 'Agreement';
        const safeName = licensee.replace(/[^a-zA-Z0-9]/g, '_');
        filename = `CA66-${safeName}-${timestamp}.pdf`;
      }
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF downloaded successfully:', filename);
      
    } catch (error) {
      console.error('PDF Download Error:', error);
      throw new Error('Failed to download PDF: ' + error.message);
    }
  }
  
  /**
   * Open PDF in new tab for preview
   * @param {Uint8Array} pdfBytes - Generated PDF bytes
   */
  static previewPDF(pdfBytes) {
    try {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('PDF Preview Error:', error);
      throw new Error('Failed to preview PDF: ' + error.message);
    }
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
      library: 'pdf-lib',
      supportedFormats: ['PDF']
    };
  }
}

console.log('CA-66 Agreement Generator - PDF-lib Generator module loaded');
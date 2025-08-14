// PDF Filler Integration Module for CA-66 Agreement Generator
import { AppConfig } from './config.js';
import { DateCalculator, FeeCalculator } from './calculator.js';
import { ValidationHelpers } from './validators.js';

export const PDFFiller = {
  // Field mapping between your app data and PDF form fields
  fieldMapping: {
    'AGREEMENT-DATE': 'agreementDate',
    'LICENSEE-NAME': 'licenseeName',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'PILOT-CERT': 'pilotCertificate',
    'FLIGHT-HOURS': 'flightHours',
    'AIRCRAFT-REGISTRATION': 'aircraftRegistration',
    'AIRCRAFT-MAKE-MODEL': 'aircraftMakeModel',
    'INSURANCE-COMPANY': 'insuranceCompany',
    'INSURANCE-ADDRESS': 'insuranceAddress',
    'INSURANCE-CITY': 'insuranceCity',
    'INSURANCE-STATE': 'insuranceState',
    'INSURANCE-ZIP': 'insuranceZip',
    'POLICY-NUMBER': 'policyNumber',
    'POLICY-EXPIRY': 'policyExpiry',
    'COVERAGE-AMOUNT': 'coverageAmount',
    'START-DATE': 'startDate',
    'END-DATE': 'endDate',
    'ANNUAL-FEE': 'annualFee',
    'LICENSEE-SIGNATURE': 'licenseeSignature',
    'LICENSEE-DATE': 'licenseeDate',
    'LICENSOR-SIGNATURE': 'licensorSignature',
    'LICENSOR-DATE': 'licensorDate'
  },

  // Convert your application data to PDF form data
  preparePDFData: (formData) => {
    const startDate = formData['start-date'] || DateCalculator.getTodayFormatted();
    const insuranceExpiry = formData['policy-expiry'];
    
    // Process and format the data for PDF
    const pdfData = {
      // Licensee Information
      'LICENSEE-NAME': formData['licensee-name'] || '',
      'PHONE': formData['phone'] || '',
      'EMAIL': formData['email'] || '',
      'PILOT-CERT': formData['pilot-certificate'] || '',
      'FLIGHT-HOURS': formData['flight-hours'] || '',
      
      // Aircraft Information
      'AIRCRAFT-REGISTRATION': formData['aircraft-registration'] || '',
      'AIRCRAFT-MAKE-MODEL': formData['aircraft-make-model'] || '',
      
      // Insurance Information
      'INSURANCE-COMPANY': formData['insurance-company'] || '',
      'INSURANCE-ADDRESS': formData['insurance-address'] || '',
      'INSURANCE-CITY': formData['insurance-city'] || '',
      'INSURANCE-STATE': formData['insurance-state'] || '',
      'INSURANCE-ZIP': formData['insurance-zip'] || '',
      'POLICY-NUMBER': formData['policy-number'] || '',
      'POLICY-EXPIRY': DateCalculator.formatDateForDisplay(insuranceExpiry) || '',
      'COVERAGE-AMOUNT': ValidationHelpers.formatCurrency(formData['coverage-amount']) || '',
      
      // Agreement Terms
      'START-DATE': DateCalculator.formatDateForDisplay(startDate) || '',
      'END-DATE': DateCalculator.formatDateForDisplay(
        DateCalculator.addOneYear(new Date(startDate))
      ) || '',
      'ANNUAL-FEE': FeeCalculator.formatFee(FeeCalculator.calculateAnnualFee()),
      
      // Metadata
      'AGREEMENT-DATE': DateCalculator.formatDateForDisplay(new Date()),
      'LICENSOR-SIGNATURE': 'Christopher Bley, AirSpace Integration, Inc.',
      'LICENSOR-DATE': DateCalculator.formatDateForDisplay(new Date())
    };
    
    return pdfData;
  },

  // Generate filled PDF using the PDF filler extension
  generateFilledPDF: async (formData, outputPath = null) => {
    try {
      console.log('🔄 Preparing PDF data...');
      
      // Prepare the data for PDF filling
      const pdfData = PDFFiller.preparePDFData(formData);
      
      // Generate output filename if not provided
      if (!outputPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const licenseeName = formData['licensee-name'] || 'unknown';
        const safeName = licenseeName.replace(/[^a-zA-Z0-9]/g, '_');
        outputPath = `CA66_Agreement_${safeName}_${timestamp}.pdf`;
      }
      
      console.log('📋 PDF data prepared:', pdfData);
      console.log('📄 Output path:', outputPath);
      
      // This would integrate with the PDF filler extension
      // For now, return the data structure that can be used with the extension
      return {
        success: true,
        pdfData,
        outputPath,
        fieldCount: Object.keys(pdfData).length,
        message: 'PDF data prepared successfully. Use with PDF filler extension to generate filled PDF.'
      };
      
    } catch (error) {
      console.error('❌ Error preparing PDF data:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to prepare PDF data'
      };
    }
  },

  // Create a profile for the PDF filler extension
  createProfile: (formData, profileName = 'ca66-default') => {
    try {
      const pdfData = PDFFiller.preparePDFData(formData);
      
      return {
        profileName,
        fieldData: pdfData,
        message: `Profile '${profileName}' created with ${Object.keys(pdfData).length} fields`
      };
      
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate PDF data before filling
  validatePDFData: (pdfData) => {
    const errors = [];
    const warnings = [];
    
    // Required fields validation
    const requiredFields = [
      'LICENSEE-NAME', 'EMAIL', 'PHONE', 'AIRCRAFT-REGISTRATION',
      'AIRCRAFT-MAKE-MODEL', 'INSURANCE-COMPANY', 'POLICY-NUMBER'
    ];
    
    requiredFields.forEach(field => {
      if (!pdfData[field] || pdfData[field].trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Flight hours validation
    const flightHours = parseInt(pdfData['FLIGHT-HOURS']);
    if (isNaN(flightHours) || flightHours < AppConfig.minimumFlightHours) {
      errors.push(`Flight hours must be at least ${AppConfig.minimumFlightHours}`);
    }
    
    // Insurance coverage validation
    const coverage = pdfData['COVERAGE-AMOUNT'];
    if (coverage && !coverage.includes('$1,000,000')) {
      warnings.push('Insurance coverage should be at least $1,000,000');
    }
    
    // Date validation
    const startDate = new Date(pdfData['START-DATE']);
    const endDate = new Date(pdfData['END-DATE']);
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldCount: Object.keys(pdfData).length
    };
  },

  // Get instructions for using with PDF filler extension
  getInstructions: () => {
    return {
      title: 'PDF Filler Integration Instructions',
      steps: [
        '1. Ensure the PDF filler extension is installed in Claude Desktop',
        '2. Use the generated PDF form: assets/examples/CA66-Agreement-Form.pdf',
        '3. Call the PDF filler with the prepared data',
        '4. The filled PDF will be saved with the specified filename',
        '5. Review the filled PDF for accuracy before distribution'
      ],
      commands: [
        'Use fill_pdf tool with:',
        '- pdf_path: "assets/examples/CA66-Agreement-Form.pdf"',
        '- output_path: "generated_agreement.pdf"',
        '- field_data: { /* prepared data */ }'
      ]
    };
  }
};

console.log('CA-66 Agreement Generator - PDF Filler Integration loaded'); 
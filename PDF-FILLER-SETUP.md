# PDF Filler Extension Setup Guide

## Overview

This guide will help you configure the PDF filler extension for Claude Desktop to work with your CA-66 Airport Use Agreement Generator.

## ✅ What's Already Done

1. **PDF Form Created**: `assets/examples/CA66-Agreement-Form.pdf` with 24 fillable fields
2. **Integration Module**: `assets/js/pdf-filler.js` - converts your form data to PDF format
3. **Field Mapping**: Complete mapping between your app fields and PDF form fields
4. **Data Validation**: Ensures all required fields are filled before PDF generation

## 🔧 PDF Filler Extension Configuration

### 1. Extension Location
The PDF filler extension is installed at:
```
/Users/andykaufman/Library/Application Support/Claude/Claude Extensions/ant.dir.gh.silverstein.pdf-filler-simple/
```

### 2. Extension Status
✅ **Installed**: Extension is properly installed  
✅ **Dependencies**: All required packages are installed  
✅ **Server**: Ready to run  

### 3. Available Tools
The PDF filler extension provides these tools:

- `list_pdfs` - List PDF files in a directory
- `read_pdf_fields` - Read form fields from a PDF
- `fill_pdf` - Fill a PDF form with data
- `bulk_fill_from_csv` - Fill multiple PDFs from CSV
- `save_profile` - Save form data as reusable profile
- `load_profile` - Load a saved profile
- `list_profiles` - List all saved profiles
- `fill_with_profile` - Fill PDF using a saved profile
- `extract_to_csv` - Extract data from filled PDFs
- `validate_pdf` - Validate if all required fields are filled

## 🎯 Field Mapping

Your CA-66 application uses this field mapping:

```javascript
const fieldMapping = {
  'AGREEMENT-DATE': 'agreementDate',
  'LICENSEE-NAME': 'licenseeName',
  'COMPANY-NAME': 'companyName',
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
};
```

## 🚀 Usage Examples

### Example 1: Fill PDF with Form Data

```javascript
// 1. Prepare your form data
const formData = {
  'licensee-name': 'John Smith',
  'company-name': 'Smith Aviation',
  'phone': '(555) 123-4567',
  'email': 'john.smith@example.com',
  // ... other fields
};

// 2. Use the PDF filler integration
import { PDFFiller } from './assets/js/pdf-filler.js';
const result = await PDFFiller.generateFilledPDF(formData);

// 3. Use the PDF filler extension
const pdfFillerData = {
  pdf_path: "assets/examples/CA66-Agreement-Form.pdf",
  output_path: result.outputPath,
  field_data: result.pdfData
};
```

### Example 2: Create and Use Profiles

```javascript
// Create a profile for repeated use
const profile = PDFFiller.createProfile(formData, 'standard-pilot');

// Use the profile with the PDF filler extension
const profileData = {
  pdf_path: "assets/examples/CA66-Agreement-Form.pdf",
  output_path: "agreement.pdf",
  profile_name: "standard-pilot",
  additional_data: {
    'LICENSEE-NAME': 'Specific Pilot Name'
  }
};
```

### Example 3: Bulk Processing

```javascript
// For multiple agreements, use CSV bulk processing
const bulkData = {
  pdf_path: "assets/examples/CA66-Agreement-Form.pdf",
  csv_path: "pilots.csv",
  output_directory: "generated_agreements/",
  filename_column: "pilot_name"
};
```

## 📋 CSV Format for Bulk Processing

Create a CSV file with headers matching the PDF field names:

```csv
LICENSEE-NAME,COMPANY-NAME,PHONE,EMAIL,PILOT-CERT,FLIGHT-HOURS,AIRCRAFT-REGISTRATION,AIRCRAFT-MAKE-MODEL,INSURANCE-COMPANY,INSURANCE-ADDRESS,INSURANCE-CITY,INSURANCE-STATE,INSURANCE-ZIP,POLICY-NUMBER,POLICY-EXPIRY,COVERAGE-AMOUNT,START-DATE,END-DATE,ANNUAL-FEE
John Smith,Smith Aviation,(555) 123-4567,john.smith@example.com,123456789,450,N12345,Cessna 172,Aviation Insurance Co,123 Insurance St,San Francisco,CA,94102,POL123456,12/31/2025,$1,000,000,01/15/2025,01/15/2026,$250.00
Jane Doe,Doe Aviation,(555) 987-6543,jane.doe@example.com,987654321,600,N67890,Piper Cherokee,Aviation Insurance Co,456 Insurance Ave,Los Angeles,CA,90210,POL789012,12/31/2025,$1,000,000,01/15/2025,01/15/2026,$250.00
```

## 🔍 Testing the Setup

### Test 1: Verify PDF Form Fields

```bash
# Run this to see all available fields
node -e "
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
(async () => {
  const pdfPath = 'assets/examples/CA66-Agreement-Form.pdf';
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log('Available fields:', fields.map(f => f.getName()));
})();
"
```

### Test 2: Test Data Preparation

```bash
# Run the integration test
node test-pdf-integration.js
```

### Test 3: Test PDF Filling

Use the PDF filler extension with this data:

```javascript
const testData = {
  pdf_path: "assets/examples/CA66-Agreement-Form.pdf",
  output_path: "test_agreement.pdf",
  field_data: {
    'LICENSEE-NAME': 'Test Pilot',
    'EMAIL': 'test@example.com',
    'PHONE': '(555) 123-4567',
    'AIRCRAFT-REGISTRATION': 'N12345',
    'AIRCRAFT-MAKE-MODEL': 'Cessna 172',
    'INSURANCE-COMPANY': 'Test Insurance',
    'POLICY-NUMBER': 'TEST123',
    'FLIGHT-HOURS': '500',
    'COVERAGE-AMOUNT': '$1,000,000',
    'START-DATE': '01/15/2025',
    'END-DATE': '01/15/2026',
    'ANNUAL-FEE': '$250.00',
    'AGREEMENT-DATE': '07/28/2025',
    'LICENSOR-SIGNATURE': 'Christopher Bley, AirSpace Integration, Inc.',
    'LICENSOR-DATE': '07/28/2025'
  }
};
```

## 🎯 Integration with Your Application

### Add PDF Generation Button

Add this to your HTML:

```html
<button type="button" id="generate-pdf" class="btn btn-primary">
  Generate PDF Agreement
</button>
```

### Add JavaScript Handler

```javascript
// In your app.js or main application file
import { PDFFiller } from './assets/js/pdf-filler.js';

document.getElementById('generate-pdf').addEventListener('click', async () => {
  try {
    // Get form data
    const formData = collectFormData(); // Your existing form data collection
    
    // Generate PDF
    const result = await PDFFiller.generateFilledPDF(formData);
    
    if (result.success) {
      // Use the PDF filler extension here
      console.log('PDF data ready:', result.pdfData);
      console.log('Output path:', result.outputPath);
      
      // Show success message
      showMessage('PDF data prepared successfully!', 'success');
    } else {
      showMessage('Failed to prepare PDF data: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    showMessage('PDF generation failed', 'error');
  }
});
```

## 🔧 Troubleshooting

### Common Issues

1. **PDF Form Not Found**
   - Ensure `assets/examples/CA66-Agreement-Form.pdf` exists
   - Run `node create-pdf-form.js` to regenerate if needed

2. **Field Mapping Errors**
   - Check that field names match exactly (case-sensitive)
   - Use the field mapping in `assets/js/pdf-filler.js`

3. **Data Validation Failures**
   - Ensure all required fields are filled
   - Check flight hours (minimum 300)
   - Verify insurance coverage (minimum $1,000,000)

4. **PDF Filler Extension Not Working**
   - Restart Claude Desktop
   - Check extension installation path
   - Verify dependencies are installed

### Debug Commands

```bash
# Check PDF form fields
node test-pdf-filler.js

# Test integration
node test-pdf-integration.js

# Regenerate PDF form
node create-pdf-form.js

# Check extension status
cd "/Users/andykaufman/Library/Application Support/Claude/Claude Extensions/ant.dir.gh.silverstein.pdf-filler-simple" && npm list
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Run the test scripts to verify functionality
3. Check the console for error messages
4. Verify the PDF filler extension is properly installed

## 🎉 Success Indicators

Your PDF filler is properly configured when:

✅ PDF form has 24 fillable fields  
✅ Integration test passes all checks  
✅ Data validation works correctly  
✅ Field mapping is complete  
✅ PDF filler extension responds to commands  

---

**Next Steps**: Test the PDF filler extension with your actual form data and integrate it into your main application workflow. 
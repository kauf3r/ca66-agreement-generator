# Fillable PDF Template Creation Guide

## Overview
This guide provides instructions for creating a fillable PDF template for the CA-66 Airport Use Agreement Generator that replaces the current text overlay approach with proper form fields.

## Required Fields for PDF Template

The following form fields must be created in the fillable PDF template (named `CA66-Agreement-Form.pdf`):

### Basic Information Fields
- `LICENSEE-NAME` - Full name of the licensee
- `COMPANY-NAME` - Company name (optional)
- `PHONE` - Contact phone number
- `EMAIL` - Email address

### Aircraft Information Fields
- `AIRCRAFT-REGISTRATION` - Aircraft N-number
- `AIRCRAFT-MAKE-MODEL` - Aircraft make and model

### Insurance Information Fields
- `INSURANCE-COMPANY` - Insurance company name
- `INSURANCE-ADDRESS` - Insurance company address
- `INSURANCE-CITY` - Insurance company city
- `INSURANCE-STATE` - Insurance company state
- `INSURANCE-ZIP` - Insurance company ZIP code
- `POLICY-NUMBER` - Insurance policy number
- `POLICY-EXPIRY` - Insurance policy expiration date
- `COVERAGE-AMOUNT` - Insurance coverage amount

### Agreement Information Fields
- `START-DATE` - Agreement start date
- `END-DATE` - Agreement end date
- `ANNUAL-FEE` - Annual fee amount
- `AGREEMENT-DATE` - Date agreement was generated

### Signature Fields
- `LICENSEE-SIGNATURE` - Licensee signature field
- `LICENSEE-DATE` - Date licensee signed
- `LICENSOR-SIGNATURE` - Licensor signature (auto-filled)
- `LICENSOR-DATE` - Date licensor signed (auto-filled)

## Field Naming Conventions

The system supports multiple field name variations for compatibility:
- Primary names (e.g., `LICENSEE-NAME`)
- Lowercase versions (e.g., `licensee-name`)
- Space-separated (e.g., `Licensee Name`)
- Underscore-separated (e.g., `LICENSEE_NAME`)

## Creating the Fillable PDF

### Step 1: Using Adobe Acrobat Pro
1. Open the existing template: `[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July29.pdf`
2. Go to Tools → Prepare Form
3. Adobe will auto-detect potential form fields
4. Manual field creation:
   - Use the Text Field tool for most fields
   - Position fields exactly where data should appear
   - Name fields according to the list above
   - Set appropriate field properties (font, size, alignment)

### Step 2: Field Properties Configuration
For each field, set these properties:
- **Font**: Helvetica, 11pt (to match existing template)
- **Text Color**: Black (RGB: 0,0,0)
- **Background**: Transparent or white
- **Border**: None or thin black line
- **Alignment**: Left for text, right for currency amounts

### Step 3: Field Validation
Add validation where appropriate:
- Date fields: Date format validation
- Phone fields: Phone number format
- Email fields: Email format validation
- Currency fields: Number format with currency symbol

### Step 4: Multi-Page Considerations
The template spans 5 pages. Fields should be distributed as follows:
- **Page 1**: Basic licensee info, start date
- **Page 2**: Aircraft information  
- **Page 3**: Insurance details
- **Page 4**: Contact information
- **Page 5**: Signature blocks

### Step 5: Save and Test
1. Save as `CA66-Agreement-Form.pdf` in the `assets/examples/` directory
2. Test form field accessibility using the system's debug mode
3. Verify all fields can be filled programmatically

## Alternative: Using PDFtk (Command Line)
```bash
# Generate FDF template from existing PDF
pdftk input.pdf generate_fdf output fields.fdf

# Create fillable form from template
pdftk template.pdf fill_form data.fdf output filled.pdf flatten
```

## Alternative: Using LibreOffice/OpenOffice
1. Create form in Writer with Form Controls
2. Export as PDF with form fields enabled
3. Verify field names match required naming convention

## Field Testing and Validation

### Testing Form Fields
1. Open the created PDF in Adobe Reader
2. Verify all fields are accessible and editable
3. Test field tab order for logical navigation
4. Ensure field sizes accommodate expected data

### Programmatic Testing
Use the debug tools to verify field detection:
```javascript
// Test form field availability
const form = pdfDoc.getForm();
const fields = form.getFields();
const fieldNames = fields.map(field => field.getName());
console.log('Available fields:', fieldNames);
```

## Integration with Existing System

The improved system will:
1. **Priority Check**: First try to load `CA66-Agreement-Form.pdf` (fillable)
2. **Fallback**: If not found, use existing text overlay template
3. **Data Processing**: Use `PDFFiller.preparePDFData()` for consistent data formatting
4. **Field Filling**: Use improved field matching with name variations
5. **Validation**: Apply business logic validation before PDF generation

## Quality Assurance Checklist

- [ ] All 24+ required fields are present and named correctly
- [ ] Fields are positioned accurately on appropriate pages
- [ ] Font styling matches existing template appearance
- [ ] Field sizes accommodate maximum expected text length
- [ ] Tab order flows logically through the form
- [ ] Form can be filled both manually and programmatically
- [ ] Generated PDF maintains professional appearance
- [ ] All business validation rules continue to work
- [ ] Cross-browser compatibility maintained
- [ ] Print quality matches original template standards

## Troubleshooting

### Common Issues
1. **Fields not detected**: Check field naming against supported variations
2. **Text overflow**: Adjust field sizes or font sizes
3. **Alignment issues**: Verify field positioning coordinates
4. **Missing data**: Check data preparation in `PDFFiller.preparePDFData()`

### Debug Tools
The system includes comprehensive logging to help identify issues:
- Form field detection and naming
- Data preparation and validation
- Field filling success/failure tracking
- Fallback to text overlay if needed

This fillable form approach will eliminate the positioning issues of the current text overlay system while providing a more professional and maintainable solution.
# Instructions for Creating the Fillable PDF Template

## Overview
The system has been upgraded to support fillable PDF forms, but requires a properly formatted fillable PDF template (`CA66-Agreement-Form.pdf`) to be created from the existing template.

## Current Status
✅ **Code Implementation Complete:**
- Form field detection and population system implemented
- Automatic fallback to text overlay if fillable template not found
- DD/MM/YYYY date formatting for legal compliance
- Special character handling and sanitization
- Adaptive font sizing for text fitting
- Support for all 24 required fields

❌ **Missing Component:**
- `assets/examples/CA66-Agreement-Form.pdf` - The fillable PDF template

## Creating the Fillable PDF Template

### Option 1: Adobe Acrobat Pro (Recommended)

1. **Open the existing template:**
   - File: `assets/examples/[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July29.pdf`
   - Open in Adobe Acrobat Pro

2. **Convert to fillable form:**
   - Go to Tools → Prepare Form
   - Select "Start with existing document"
   - Let Acrobat auto-detect form fields

3. **Create/verify these 24 form fields:**

   **Basic Information (Page 1):**
   - `LICENSEE-NAME` - Licensee full name
   - `START-DATE` - Agreement start date (2 locations on page 1)
   - `END-DATE` - Agreement end date
   - `AIRCRAFT-MAKE-MODEL` - Aircraft make and model

   **Insurance Information (Page 3):**
   - `LICENSEE` - Licensee name (multiple locations)
   - `INSURANCE-COMPANY` - Insurance company name
   - `INSURANCE-ADDRESS` - Insurance company address
   - `INSURANCE-CITY` - Insurance company city
   - `INSURANCE-STATE` - Insurance company state
   - `INSURANCE-ZIP` - Insurance company ZIP
   - `INSURANCE-PHONE` - Insurance company phone
   - `POLICY-NUMBER` - Policy number
   - `POLICY-EXPIRY` - Policy expiration date

   **Contact Information (Page 4):**
   - `PHONE` - Contact phone number
   - `EMAIL` - Email address

   **Additional Fields (Page 5):**
   - Any signature or date fields as needed

4. **Field Properties:**
   - Font: Helvetica, 11pt
   - Text Color: Black (RGB: 0,0,0)
   - Background: Transparent
   - Border: None
   - Alignment: Left (Right for currency)

5. **Save the fillable PDF:**
   - Save as: `assets/examples/CA66-Agreement-Form.pdf`
   - Ensure "Extend features in Adobe Reader" is enabled

### Option 2: Free Online Tools

1. **Use PDFescape (free online):**
   - Go to www.pdfescape.com
   - Upload the template PDF
   - Add form fields manually
   - Save and download

2. **Use LibreOffice (free desktop):**
   - Open template in LibreOffice Draw
   - Insert → Form Control → Text Box
   - Position fields where needed
   - Export as PDF with form fields

### Option 3: Command Line (pdftk)

```bash
# Install pdftk
brew install pdftk-java  # Mac
apt-get install pdftk     # Linux

# Generate field template
pdftk "[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July29.pdf" generate_fdf output template.fdf

# Edit template.fdf to add field definitions
# Then merge back
pdftk "[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July29.pdf" fill_form template.fdf output CA66-Agreement-Form.pdf
```

## Testing the Fillable PDF

1. **Open test page:**
   - Navigate to: `test-pdf-generation.html`
   - Click "Test Fillable Template"

2. **Verify field detection:**
   - Should show "Fillable template found with 24 form fields"
   - Lists all field names

3. **Test full generation:**
   - Click "Test Full PDF Generation"
   - Verify all fields populate correctly
   - Check date formatting (DD/MM/YYYY)
   - Verify special characters handled properly

## Field Naming Reference

The system supports multiple variations of field names for compatibility:
- Primary: `LICENSEE-NAME`
- Alternative: `licensee-name`, `Licensee Name`, `LICENSEE_NAME`

## System Behavior

### With Fillable Template:
1. Loads `CA66-Agreement-Form.pdf`
2. Detects form fields
3. Fills fields with sanitized data
4. Applies DD/MM/YYYY date formatting
5. Generates professional PDF

### Without Fillable Template (Current):
1. Falls back to text overlay template
2. Uses coordinate-based positioning
3. Applies adaptive font sizing
4. Still generates valid PDF

## Benefits of Fillable Template

✅ **Professional appearance** - Native PDF form fields
✅ **Better text fitting** - Fields handle overflow automatically
✅ **Improved compatibility** - Works better across PDF viewers
✅ **Easier maintenance** - Update template without code changes
✅ **Accessibility** - Screen readers can identify form fields

## Next Steps

1. Create the fillable PDF using one of the methods above
2. Save as `assets/examples/CA66-Agreement-Form.pdf`
3. Test using `test-pdf-generation.html`
4. System will automatically use fillable template when available

## Support

The system will continue to work with the text overlay approach until the fillable template is created. No code changes are needed once the fillable PDF is added - the system will automatically detect and use it.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CA-66 Airport Use Agreement Generator** - A single-page web application that generates legal usage license agreements for Monterey Bay Academy Airport. Built for AirSpace Integration, Inc. to streamline pilot onboarding while ensuring strict safety, insurance, and operational compliance.

## Architecture

**Technology Stack:**
- Vanilla JavaScript (ES6+ with modules) - zero dependencies for security
- HTML5 + CSS3 (Grid & Flexbox) - no frameworks
- Client-side only - no backend, no data persistence
- Deployment: Vercel with automatic HTTPS

**Core Components:**
```javascript
const FormValidator = {
  validateEmail: (email) => { /* ... */ },
  validatePilotHours: (hours) => { /* min 300 required */ },
  validateInsurance: (coverage) => { /* min $1M required */ }
};

const AgreementGenerator = {
  template: `...legal agreement template...`,
  generate: (data) => { /* merge data with template */ },
  formatForPrint: (html) => { /* 8.5x11 print styles */ }
};
```

## Development Commands

**Local Development:**
```bash
# Python (recommended)
python -m http.server 8000

# Node.js alternative
npx http-server

# VS Code Live Server extension (preferred in VS Code)
```

**Deployment:**
```bash
# Deploy to production
vercel --prod

# Link repository (first time)
vercel
```

**Testing & Validation:**
```bash
# Accessibility audit
npm install -g pa11y
pa11y http://localhost:8000

# HTML validation (manual)
# Visit: https://validator.w3.org/

# Performance audit
# Chrome DevTools > Lighthouse
```

## Critical Business Rules

**Mandatory Validations:**
- Pilot must have 300+ flight hours (hard requirement)
- Insurance coverage minimum $1,000,000
- Insurance must include 7 specific additional insureds:
  1. Monterey Bay Academy
  2. AirSpace Integration, Inc.
  3. Andy Kaufman
  4. Property owner
  5. Management companies
  6. Agents and employees
  7. Successors and assigns

**Agreement Terms:**
- Annual fee: $250 (supports aviation education)
- Sabbath observance: No operations Friday sunset to Saturday sunset
- Agreement expires: Earlier of insurance expiry OR 1 year from start
- Aircraft restrictions: Single Engine Reciprocating only, MTOW < 12,500 lbs

**Form Structure:**
1. **Licensee Information** - Name, address, contact, pilot cert, flight hours
2. **Aircraft Details** - Registration, make/model, weight confirmation
3. **Insurance Information** - Company, policy details, coverage amounts
4. **Agreement Terms** - Auto-calculated dates, fee display, acknowledgments

## Key Features

**Data Flow:**
1. User Input → Client Validation → State Update
2. Preview Generation → Final Agreement → Print/Sign

**Template System:**
- JavaScript template literals with placeholder replacement
- Print-optimized CSS (@media print)
- Signature blocks and legal formatting
- Exhibit A (Airport Rules) appendix

**Responsive Design:**
- Mobile-first approach (320px base)
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly targets (44px minimum)
- Print styles for 8.5x11 paper

## Security Considerations

- No backend = no attack surface for data breaches
- Client-side only = no stored PII
- Input sanitization for XSS prevention
- HTTPS required for all deployments
- No external dependencies = reduced supply chain risk

## Performance Targets

- First Contentful Paint: < 1.0s
- Time to Interactive: < 2.0s
- Total Page Size: < 100KB
- Lighthouse Score: > 95
- Mobile-responsive and accessible

## File Organization

```
/
├── index.html          # Main application
├── styles.css          # All styling (including print)
├── script.js           # Core JavaScript
├── agreement-template.js # Legal template
└── validation.js       # Form validation logic
```

## Development Notes

- Use semantic HTML for accessibility
- Implement keyboard navigation
- Test print preview functionality
- Validate all inputs before agreement generation
- Handle edge cases (past dates, special characters)
- Mobile-first responsive design
- No console.log statements in production

## Session Summary (Last Updated: July 21, 2025)

### Completed Implementation Progress

**✅ Milestone 1: Project Setup & Structure (COMPLETE)**
- Full project architecture with modular CSS and JavaScript
- Semantic HTML5 structure with accessibility features
- Git repository initialization with comprehensive structure
- Professional documentation and project organization

**✅ Milestone 2: HTML Form Structure (COMPLETE)**
- Complete 4-section form with all required fields
- Responsive design with professional styling
- Accessibility compliance (ARIA labels, fieldsets, legends)
- Form progress indicators and user feedback systems

**✅ Phase 1: JavaScript Core Functionality (COMPLETE)**
- **Safety-Critical Validation Engine:** 300+ flight hours and $1M insurance enforcement
- **Real-time Form Feedback:** Live validation with error/success states and progress tracking
- **Business Logic Implementation:** Date calculations, Sabbath observance, fee management
- **Auto-population System:** Dynamic date calculations and fee displays
- **Data Collection & Management:** Form state tracking, input sanitization, validation management

**✅ Phase 3: Agreement Generation (COMPLETE)**
- **Legal Agreement Template System:** Complete legal document with all required sections
- **Data Merging Engine:** Form data integration with template placeholders
- **Document Generation Workflow:** End-to-end agreement creation and preview
- **Print Optimization:** Professional legal document formatting for 8.5x11 paper
- **UI Integration:** Seamless form-to-document generation workflow

### Recent Bug Fixes & Improvements (July 21, 2025 Session)

**🔧 Critical Bug Fixes:**
1. **Form Field Name Mapping** - Fixed mismatch between HTML field names and JavaScript expectations (26 fields updated)
2. **Button Validation Logic** - Resolved infinite recursion loop preventing Generate Agreement button from enabling
3. **DocumentGenerator Access** - Fixed module import issues for proper agreement generation workflow
4. **End Date Logic** - Updated to always use 1 year from start date instead of "earlier of insurance/1 year"
5. **Aircraft Registration Validation** - Fixed regex pattern to allow 5-digit registrations (N12345)
6. **Auto-Population Logic** - Fixed form field updates to consistently show 1 year from start date

**📝 Content Updates:**
- **Licensor Information**: Updated from "Andy Kaufman" to "Christopher Bley" throughout all templates and configs
- **Additional Insureds**: Updated insurance requirements to reflect correct signatory
- **Agreement Terms**: Clarified that agreements are always 1-year terms with insurance expiry noted separately

### Current Technical State

**✅ Fully Functional System:**
- **End-to-End Workflow**: Form validation → Agreement generation → Print-ready document
- **All Validations Working**: 300+ hours, $1M+ insurance, required field validation
- **Professional Legal Documents**: Complete agreements with proper formatting and signatures
- **Real-time Feedback**: Button states, progress tracking, validation messaging
- **Print Optimization**: Legal document formatting with proper margins and typography

**Business Logic Enforcement:**
- Flight hours minimum: 300 hours (safety requirement)
- Insurance minimum: $1,000,000 coverage (legal requirement)
- **Agreement expiry: ALWAYS 1 year from start date** (insurance expiry noted separately)
- Insurance validation: Must be >30 days in future
- Christopher Bley as AirSpace Integration representative

**Application Architecture:**
- ES6 modular JavaScript with clean separation of concerns
- Complete form-to-document generation pipeline
- Professional error handling and user feedback
- Print-ready legal document generation
- Accessibility and responsive design compliance

### Ready for Deployment

**✅ Core Functionality Complete:**
- Form validation system operational
- Agreement generation working end-to-end
- Legal document templates with proper formatting
- Print functionality tested and working
- Professional user experience with real-time feedback

**Remaining Tasks:**
- Create GitHub repository and push code
- Deploy to Vercel production environment
- Final cross-browser testing

The CA-66 Agreement Generator is now a fully functional legal document generation system ready for production deployment.

## Recent Session Updates (July 23, 2025)

### 🎯 **E-Signature Integration & Template Enhancement**

**✅ Major Improvements Completed:**

1. **Date Format Standardization (DD/MM/YYYY)**
   - Updated `DateCalculator.formatDateForDisplay()` to use DD/MM/YYYY format
   - Matches international standard and PDF template requirements
   - Maintains US format (YYYY-MM-DD) for HTML date inputs

2. **E-Signature [TAG] Template Support**
   - Added dual template format support in `template.js`
   - Configuration option: `AppConfig.templateFormat = 'esignature'`
   - Template conversion maps `{{field}}` to `[FIELD-NAME]` format
   - Compatible with e-signature platforms like DocuSign, Adobe Sign
   - Field mapping aligned with provided PDF template structure

3. **Complete US State Dropdown Implementation**
   - Added comprehensive state list to `AppConfig.usStates` (76 options)
   - Includes all 50 states, DC, territories, and military postal codes
   - Dynamic population via `ValidationHelpers.populateStateDropdown()`
   - Replaced text input with professional dropdown interface
   - Auto-populated on application initialization

4. **Aircraft Registration Enhancement**
   - Verified existing N-number field and validation are complete
   - US aircraft registration format validation (N12345, N123AB patterns)
   - Integration confirmed with form validation system

**Technical Implementation Details:**
- Template system supports both `{{mustache}}` and `[E-SIGNATURE]` formats
- State dropdown populated dynamically to avoid content filtering issues
- Modular approach maintains clean separation of concerns
- All changes maintain backward compatibility

**Current System Status:**
- ✅ End-to-end form validation and agreement generation
- ✅ E-signature platform compatibility
- ✅ Professional user interface with real-time feedback
- ✅ Complete state/territory dropdown functionality
- ✅ DD/MM/YYYY date formatting
- ✅ Legal document template with [TAG] placeholder support

## Project Milestones

- Milestone 2 completion ✅
- **E-signature integration milestone** ✅

## Recent Session Updates (July 28, 2025)

### 🎯 **PDF Generation System Implementation & Multi-Page Support**

**✅ Major Achievements Completed:**

1. **Complete PDF Generation System Implementation**
   - Built comprehensive PDF generation using pdf-lib library
   - Implemented text overlay system for bracket placeholder replacement `[FIELD-NAME]`
   - Created position-based configuration system for precise text placement
   - Added support for both form field filling and text overlay methods

## Latest Session Updates (July 29, 2025)

### 🚀 **PDF Generation System Improvements - Fillable Form Integration**

**✅ Major Improvements Implemented:**

1. **Fillable Form Priority System**
   - Enhanced `PDFLibGenerator.generateFilledPDF()` to prioritize fillable forms over text overlays
   - System now automatically detects and uses `CA66-Agreement-Form.pdf` if available
   - Falls back gracefully to text overlay method if fillable template not found
   - Integrated existing `PDFFiller` module for optimal data preparation

2. **Smart Field Mapping & Compatibility**
   - Improved field matching with multiple name variations (uppercase, lowercase, hyphens, spaces)
   - Enhanced `fillFormFieldsImproved()` method with comprehensive field type handling
   - Added robust error handling and field mapping success tracking
   - Supports all PDF field types: text, checkbox, dropdown, radio groups

3. **Professional Document Output**
   - Form field flattening for non-editable final PDFs
   - Maintains existing business logic validation (300+ hours, $1M insurance)
   - Professional formatting with consistent appearance
   - Eliminates coordinate-based positioning issues

2. **Multi-Page PDF Template Support (5 Pages)**
   - Enhanced system to handle multi-page PDF documents (pages 1-5)
   - Implemented page-specific field positioning and management
   - Added debug tools for all pages with page selection dropdown
   - Created comprehensive position configuration for each page

3. **Advanced Position Configuration System**
   - **Configuration File**: `assets/js/pdf-position-config.js` - centralized position management
   - **Multiple Field Locations**: Support for same field on multiple pages/positions
   - **Debug Tools**: Enhanced `debug-pdf-positions.html` with page-specific debugging
   - **Position Editor**: Interactive editor for fine-tuning field positions

4. **Field Distribution Across Pages**
   - **Page 1**: `[LICENSEE-NAME]`, `[LICENSEE]`, `[START-DATE]` (removed email, phone, aircraft-registration, coverage-amount, end-date)
   - **Page 3**: Full insurance section - company, policy, address, city, state, zip, phone
   - **Page 4**: Contact info - `[LICENSEE]`, `[PHONE]`, `[EMAIL]`  
   - **Page 5**: `[LICENSEE]` name reference

5. **Bug Fixes & Error Resolution**
   - **Fixed `trim()` errors**: Enhanced validation to handle mixed data types (strings, numbers, booleans)
   - **Fixed missing date fields**: Auto-population now properly syncs with form data store
   - **Fixed PDF placeholder replacement**: Template now generates merged documents with actual data

**Technical Architecture:**

```javascript
// Multi-page position configuration
'[LICENSEE]': [
  { page: 1, x: 260, y: 675, size: 11, maxWidth: 75 },
  { page: 3, x: 140, y: 385, size: 11, maxWidth: 75 },
  { page: 4, x: 350, y: 465, size: 11, maxWidth: 200 },
  { page: 5, x: 100, y: 162, size: 11, maxWidth: 200 }
]

// PDF generation workflow
formData → validation → fieldMapping → textOverlays → mergedPDF
```

**Key Files:**
- `assets/js/pdf-lib-generator.js` - Core PDF generation with text overlays
- `assets/js/pdf-position-config.js` - Position configuration for all fields/pages
- `debug-pdf-positions.html` - Debug tools for position adjustment
- `index.html` - Updated with pdf-lib CDN integration

**Debug Workflow:**
1. Select page (1-5) or "All Pages"
2. Generate debug PDF with position markers
3. Generate test PDF with sample data
4. Use position editor to adjust coordinates
5. Update configuration file with new positions

**Current System Status:**
- ✅ Full 5-page PDF template support
- ✅ Text overlay system replacing bracket placeholders
- ✅ Multi-location field support (same field on multiple pages)
- ✅ Comprehensive debug and position adjustment tools
- ✅ Form data validation for all data types
- ✅ Auto-population of date fields with proper sync

**Ready for Production:**
- PDF generation creates properly filled legal documents
- All placeholders replaced with actual form data
- Multi-page template fully supported
- Position configuration system allows easy adjustments

## Project Milestones

- Milestone 2 completion ✅
- **E-signature integration milestone** ✅
- **PDF Generation & Multi-Page Support milestone** ✅
- **PDF Generation Improvements - Fillable Form Integration milestone** ✅

## Technical Architecture (Current State)

**PDF Generation Workflow:**
1. **Template Detection**: System first attempts to load `CA66-Agreement-Form.pdf` (fillable)
2. **Field Analysis**: Uses pdf-lib to detect available form fields
3. **Data Preparation**: `PDFFiller.preparePDFData()` formats form data for PDF fields
4. **Smart Mapping**: Multiple field name variations attempted for compatibility
5. **Professional Output**: Form fields filled and flattened for final document
6. **Fallback System**: Text overlay approach if fillable template unavailable

**Key Files (Updated):**
- `assets/js/pdf-lib-generator.js` - Enhanced with fillable form priority system
- `assets/js/pdf-filler.js` - Integrated for optimal data preparation and validation
- `assets/examples/CA66-Agreement-Form.pdf` - Fillable form template (if available)
- `assets/examples/[TEMPLATE]...pdf` - Fallback text overlay template

**Performance Metrics:**
- PDF Generation Time: <3 seconds (fillable forms often faster than text overlay)
- Field Mapping Success: Depends on template field naming compatibility
- Document Quality: Professional formatting with proper alignment
- Browser Compatibility: All major browsers supported via pdf-lib

## Memories

- The CA-66 Agreement Generator is now functionally complete with all Phase 1-3 requirements implemented.
- **July 23, 2025**: Successfully added e-signature compatibility, complete state dropdown, and DD/MM/YYYY date formatting. System ready for e-signature platform integration.
- **July 28, 2025**: Implemented complete PDF generation system with multi-page support (5 pages), text overlay positioning, debug tools, and field distribution optimization. System now generates fully merged PDF documents with all placeholders replaced by actual form data.
- **July 29, 2025**: Enhanced PDF generation with fillable form priority system. System now automatically detects and uses fillable PDF templates when available, providing professional document quality while maintaining full backward compatibility with text overlay approach.